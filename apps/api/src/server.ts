import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import pino from 'pino';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

import categoryRoutes from './routes/category.routes';
import genreRoutes from './routes/genre.routes';
import tagRoutes from './routes/tag.routes';
import postRoutes from './routes/post.routes';
import mediaRoutes from './routes/media.routes';
import engagementRoutes from './routes/engagement.routes';
import commentRoutes from './routes/comment.routes';
import contactRoutes from './routes/contact.routes';
import newsletterRoutes from './routes/newsletter.routes';
import seoRoutes from './routes/seo.routes';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});

export const createServer = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: process.env.WEB_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  
  app.use(pinoHttp({ logger }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Limit each IP to 10 requests per windowMs for auth endpoints
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/v1/auth', authLimiter, authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/genres', genreRoutes);
  app.use('/api/v1/tags', tagRoutes);
  app.use('/api/v1/posts', postRoutes);
  app.use('/api/v1/media', mediaRoutes);
  app.use('/api/v1', engagementRoutes);
  app.use('/api/v1', commentRoutes);
  app.use('/api/v1/contact', contactRoutes);
  app.use('/api/v1/newsletter', newsletterRoutes);
  app.use('/api/v1/seo', seoRoutes);

  // Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      }
    });
  });

  return app;
};
