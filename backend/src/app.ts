import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/request-logger.middleware.js';
import { errorHandler } from './middleware/error-handler.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import loanRoutes from './modules/loan/loan.routes.js';
import creditRoutes from './modules/credit/credit.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: "https://we-credit-frontend-mnkz.vercel.app",
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);

// Health Check
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'OK' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/credit', creditRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

export default app;
