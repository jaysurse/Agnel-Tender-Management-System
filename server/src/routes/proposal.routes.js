import { Router } from 'express';
import { listProposals } from '../controllers/proposal.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, listProposals);

export default router;
