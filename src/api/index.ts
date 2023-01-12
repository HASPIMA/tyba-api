import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});


router.post<{}, any>('/sign-up', (req, res) => {
  return res.status(400).json({});
});

export default router;
