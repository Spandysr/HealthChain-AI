import { Router } from 'express';
import { whatsappWebhook, sendWhatsappSummary } from '../controllers/whatsappController';

const router = Router();

router.post('/webhook', whatsappWebhook);
router.post('/send-summary', sendWhatsappSummary);

export default router;
