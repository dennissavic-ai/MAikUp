import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Route imports
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscription';
import makeupRoutes from './routes/makeup';
import hairstyleRoutes from './routes/hairstyles';
import favoriteRoutes from './routes/favorites';
import lookRoutes from './routes/looks';

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

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

// ─── Routes ──────────────────────────────────────────────────

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/makeup', makeupRoutes);
app.use('/api/hairstyles', hairstyleRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/looks', lookRoutes);

// ─── Error Handling ──────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
