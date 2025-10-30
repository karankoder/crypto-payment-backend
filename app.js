import express from 'express';
import './config/env.js';
import { errorMiddleware } from './middlewares/error.js';
import cors from 'cors';
import { backendUrl, frontendUrl } from './config/constants.js';

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [process.env.LOCAL_FRONTEND_URL, process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.get('/failure', (req, res) => {
  res.send('Failed to Login');
});

app.use(errorMiddleware);
