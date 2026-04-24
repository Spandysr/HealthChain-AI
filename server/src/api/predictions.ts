import { Router } from 'express';
import { createPrediction, getPredictions, getPredictionById } from '../controllers/predictionController';

const router = Router();

router.post('/', createPrediction);
router.get('/', getPredictions);
router.get('/:id', getPredictionById);

export default router;
