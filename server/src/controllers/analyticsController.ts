import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

export const getAnalyticsSummary = async (req: Request, res: Response) => {
    try {
        const summary = await analyticsService.getSummary();
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error getting analytics summary', error });
    }
};
