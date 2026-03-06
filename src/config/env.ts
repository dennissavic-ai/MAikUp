import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  // Database
  databaseUrl: process.env.DATABASE_URL!,

  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    prices: {
      basicMonthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
      basicYearly: process.env.STRIPE_PRICE_BASIC_YEARLY || '',
      premiumMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
      premiumYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
    },
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
} as const;
