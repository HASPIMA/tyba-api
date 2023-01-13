import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';

import signUp from './sign-up';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/sign-up', signUp);

export default router;
