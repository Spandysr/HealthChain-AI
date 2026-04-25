import { Request, Response } from 'express';
import { whatsappService } from '../services/whatsappService';

export const whatsappWebhook = async (req: Request, res: Response) => {
    try {
        console.log('Incoming WhatsApp Webhook received!', req.body);
        const message = req.body;
        await whatsappService.handleIncomingMessage(message);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Whatsapp webhook error:', error);
        res.status(500).json({ message: 'Error processing WhatsApp message', error });
    }
};

export const sendWhatsappSummary = async (req: Request, res: Response) => {
    try {
        const { to, predictionId } = req.body;
        await whatsappService.sendPredictionSummary(to, predictionId);
        res.status(200).json({ message: 'Summary sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending summary', error });
    }
};
