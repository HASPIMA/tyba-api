import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import Redis from 'ioredis';

import * as middlewares from './middlewares/handlers.middleware';
import api from './routes';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Setup redis client
const client = new Redis(process.env.REDIS_CONNECTION_STRING as string);

// Provide redis client to each request
app.use(async (_req, res, next) => {
  res.locals.redisClient = client;
  return next();
});

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});


app.get<{}, MessageResponse>('/ping', async (_, res) => {
  const ping = await client.ping();
  return res.json({ message: ping });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
