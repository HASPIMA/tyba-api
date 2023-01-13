import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';

import signUp from './sign-up';
import login from './login';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/sign-up', signUp);
router.use('/login', login);

export default router;
