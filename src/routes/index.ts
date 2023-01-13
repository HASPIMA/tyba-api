import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';

import signUp from './sign-up.routes';
import login from './login.routes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/sign-up', signUp);
router.use('/login', login);

export default router;
