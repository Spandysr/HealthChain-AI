import { Router } from 'express';
import predictionsRouter from './predictions';
import recordsRouter from './records';
import analyticsRouter from './analytics';
import whatsappRouter from './whatsapp';

const router = Router();

router.use('/predictions', predictionsRouter);
router.use('/records', recordsRouter);
router.use('/analytics', analyticsRouter);
router.use('/whatsapp', whatsappRouter);

export default router;
