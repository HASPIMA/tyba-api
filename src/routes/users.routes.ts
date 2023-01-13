import express, { Request } from 'express';

import { getCurrentUserInfo } from '../middlewares/userInfo.middleware';

const router = express.Router();

// All routes refering to /**/users/* require getCurrentUserInfo middleware
router.route('/*').all(getCurrentUserInfo);

export default router;
