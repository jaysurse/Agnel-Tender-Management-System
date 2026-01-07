import { Router } from 'express';
import { listTenders, getTender } from '../controllers/tender.controller.js';

const router = Router();

router.get('/', listTenders);
router.get('/:id', getTender);

export default router;
