import { Request, Response } from 'express';
import { predictionService } from '../services/predictionService';
import { PatientData } from '../types/patient';

export const createPrediction = async (req: Request, res: Response) => {
    try {
        const patientData: PatientData = req.body;
        const result = await predictionService.createPrediction(patientData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating prediction', error });
    }
};

export const getPredictions = async (req: Request, res: Response) => {
    try {
        const predictions = await predictionService.getPredictions();
        res.status(200).json(predictions);
    } catch (error) {
        res.status(500).json({ message: 'Error getting predictions', error });
    }
};

export const getPredictionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const prediction = await predictionService.getPredictionById(parseInt(id));
        if (prediction) {
            res.status(200).json(prediction);
        } else {
            res.status(404).json({ message: 'Prediction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting prediction', error });
    }
};
