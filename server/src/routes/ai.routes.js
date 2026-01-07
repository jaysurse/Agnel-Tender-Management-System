import { Router } from 'express';
import { askAI } from '../controllers/ai.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/ask', requireAuth, askAI);

export default router;
