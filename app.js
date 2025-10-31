import express from 'express';
import './config/env.js';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middlewares/error.js';
import cors from 'cors';
import { backendUrl, frontendUrl } from './config/constants.js';
import walletRoutes from './routes/wallet.js';

export const app = express();

app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: [process.env.LOCAL_FRONTEND_URL, process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use('/api/v1', apiLimiter);

app.use('/api/v1/wallet', walletRoutes);

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.get('/failure', (req, res) => {
  res.send('Failed to Login');
});

app.use(errorMiddleware);
