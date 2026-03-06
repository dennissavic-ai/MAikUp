import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { stripe } from '../config/stripe';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { env } from '../config/env';
import { SubscriptionTier } from '@prisma/client';

const router = Router();

// Get subscription plans
router.get('/plans', (_req: Request, res: Response) => {
  const plans = [
    {
      tier: 'FREE',
      name: 'Free',
      description: 'Basic makeup try-on features',
      features: [
        'Access to basic makeup colors',
        'Limited hairstyle options',
        'Save up to 5 looks',
        'Basic skin tone matching',
      ],
      price: { monthly: 0, yearly: 0 },
    },
    {
      tier: 'BASIC',
      name: 'Basic',
      description: 'Expanded catalog and features',
      features: [
        'Full makeup color palette',
        'All hairstyle categories',
        'Save up to 25 looks',
        'Look history',
        'Advanced skin tone matching',
        'Curated makeup looks',
      ],
      price: { monthly: 4.99, yearly: 39.99 },
      stripePrices: {
        monthly: env.stripe.prices.basicMonthly,
        yearly: env.stripe.prices.basicYearly,
      },
    },
    {
      tier: 'PREMIUM',
      name: 'Premium',
      description: 'Full access to all features',
      features: [
        'Everything in Basic',
        'Exclusive premium styles',
        'Unlimited saved looks',
        'Priority new feature access',
        'Hair color try-on',
        'Complete look combinations',
        'Trending styles updated weekly',
      ],
      price: { monthly: 9.99, yearly: 79.99 },
      stripePrices: {
        monthly: env.stripe.prices.premiumMonthly,
        yearly: env.stripe.prices.premiumYearly,
      },
    },
  ];

  sendSuccess(res, plans);
});

// Get current subscription status
router.get('/status', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.userId },
    });

    sendSuccess(res, subscription);
  } catch (error) {
    sendError(res, 'Failed to fetch subscription status', 500);
  }
});

// Create Stripe checkout session for subscription
router.post('/checkout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      sendError(res, 'priceId, successUrl, and cancelUrl are required');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { subscription: true },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    let customerId = user.subscription?.stripeCustomerId;

    // Create Stripe customer if none exists
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id, firebaseUid: user.firebaseUid },
      });
      customerId = customer.id;

      await prisma.subscription.update({
        where: { userId: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: user.id },
    });

    sendSuccess(res, { sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    sendError(res, 'Failed to create checkout session', 500);
  }
});

// Create customer portal session (manage subscription)
router.post('/portal', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { returnUrl } = req.body;

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!subscription?.stripeCustomerId) {
      sendError(res, 'No active subscription found', 404);
      return;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl || undefined,
    });

    sendSuccess(res, { url: session.url });
  } catch (error) {
    sendError(res, 'Failed to create portal session', 500);
  }
});

// Cancel subscription
router.post('/cancel', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!subscription?.stripeSubscriptionId) {
      sendError(res, 'No active subscription to cancel', 404);
      return;
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { userId: req.user!.userId },
      data: { cancelAtPeriodEnd: true },
    });

    sendSuccess(res, null, 'Subscription will be canceled at the end of the billing period');
  } catch (error) {
    sendError(res, 'Failed to cancel subscription', 500);
  }
});

// Stripe webhook handler
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.stripe.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    sendError(res, 'Webhook signature verification failed', 400);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const priceId = stripeSubscription.items.data[0]?.price.id;
          const tier = determineTier(priceId);

          await prisma.subscription.update({
            where: { userId },
            data: {
              tier,
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
              currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
              currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: sub.id },
        });

        if (dbSub) {
          const priceId = sub.items.data[0]?.price.id;
          await prisma.subscription.update({
            where: { stripeSubscriptionId: sub.id },
            data: {
              tier: determineTier(priceId),
              status: mapStripeStatus(sub.status),
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            tier: 'FREE',
            status: 'EXPIRED',
            stripeSubscriptionId: null,
            cancelAtPeriodEnd: false,
          },
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: { status: 'PAST_DUE' },
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    sendError(res, 'Webhook processing failed', 500);
  }
});

function determineTier(priceId: string): SubscriptionTier {
  if (
    priceId === env.stripe.prices.premiumMonthly ||
    priceId === env.stripe.prices.premiumYearly
  ) {
    return 'PREMIUM';
  }
  if (
    priceId === env.stripe.prices.basicMonthly ||
    priceId === env.stripe.prices.basicYearly
  ) {
    return 'BASIC';
  }
  return 'FREE';
}

function mapStripeStatus(status: string): 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'EXPIRED' {
  switch (status) {
    case 'active': return 'ACTIVE';
    case 'canceled': return 'CANCELED';
    case 'past_due': return 'PAST_DUE';
    case 'trialing': return 'TRIALING';
    default: return 'EXPIRED';
  }
}

export default router;
