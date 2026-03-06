import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});
