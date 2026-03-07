import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { tieredLimiter, strictLimiter, catalogLimiter } from './middleware/rateLimiter';

// Route imports
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscription';
import makeupRoutes from './routes/makeup';
import hairstyleRoutes from './routes/hairstyles';
import favoriteRoutes from './routes/favorites';
import lookRoutes from './routes/looks';
import adminRoutes from './routes/admin';
import recommendationRoutes from './routes/recommendations';
import analyticsRoutes from './routes/analytics';
import sharingRoutes from './routes/sharing';
import uploadRoutes from './routes/uploads';
import notificationRoutes from './routes/notifications';
import arAssetRoutes from './routes/ar-assets';
import trendingRoutes from './routes/trending';
import searchRoutes from './routes/search';
import tryOnRoutes from './routes/try-on';
import docsRoutes from './routes/docs';

const app = express();

// ─── Global Middleware ───────────────────────────────────────

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: env.corsOrigin === '*' ? '*' : env.corsOrigin.split(','),
    credentials: true,
  })
);

// Body parsing - raw body needed for Stripe webhooks
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Routes with Tiered Rate Limiting ────────────────────────

// No rate limit on health check
app.use('/api/health', healthRoutes);

// Strict rate limit on auth & payment endpoints
app.use('/api/auth', strictLimiter, authRoutes);
app.use('/api/subscription', strictLimiter, subscriptionRoutes);

// Permissive rate limit on read-heavy catalog endpoints
app.use('/api/makeup', catalogLimiter, makeupRoutes);
app.use('/api/hairstyles', catalogLimiter, hairstyleRoutes);
app.use('/api/search', catalogLimiter, searchRoutes);
app.use('/api/trending', catalogLimiter, trendingRoutes);
app.use('/api/recommendations', catalogLimiter, recommendationRoutes);
app.use('/api/ar', catalogLimiter, arAssetRoutes);

// Tiered rate limit on user-action endpoints
app.use('/api/favorites', tieredLimiter, favoriteRoutes);
app.use('/api/looks', tieredLimiter, lookRoutes);
app.use('/api/sharing', tieredLimiter, sharingRoutes);
app.use('/api/analytics', tieredLimiter, analyticsRoutes);
app.use('/api/uploads', tieredLimiter, uploadRoutes);
app.use('/api/notifications', tieredLimiter, notificationRoutes);
app.use('/api/try-on', tieredLimiter, tryOnRoutes);

// Admin routes use tiered limiter (admins get 1000 req/15min)
app.use('/api/admin', tieredLimiter, adminRoutes);

// ─── API Documentation (no rate limit) ──────────────────────

app.use('/api/docs', docsRoutes);

// ─── Error Handling ──────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
