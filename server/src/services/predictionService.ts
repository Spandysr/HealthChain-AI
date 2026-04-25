import { pool } from '../database/db';
import { PatientData, PredictionResult } from '../types/patient';
import { recordService } from './recordService';

let fallbackPredictionId = 1;
let fallbackPatientId = 9000;
const fallbackPredictions: any[] = [];

export const getFallbackPredictionsSnapshot = () => {
    return [...fallbackPredictions];
};

const calculateRisk = (score: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (score < 0.3) return 'Low';
    if (score < 0.6) return 'Medium';
    if (score < 0.8) return 'High';
    return 'Critical';
};

const simulatePrediction = (data: PatientData): PredictionResult => {
    // This is a mock prediction logic. Replace with a real ML model call.
    const diabetesScore = (data.glucose / 200) + (data.bmi / 40) - (data.age / 100);
    const cvdScore = (data.bloodPressure / 180) + (data.cholesterol / 300) - (data.age / 100);
    const ckdScore = (data.bloodPressure / 180) + (data.glucose / 200) - (data.age / 100);

    return {
        diabetes: {
            probability: Math.max(0, Math.min(1, diabetesScore)),
            risk: calculateRisk(diabetesScore),
        },
        cardiovascularDisease: {
            probability: Math.max(0, Math.min(1, cvdScore)),
            risk: calculateRisk(cvdScore),
        },
        chronicKidneyDisease: {
            probability: Math.max(0, Math.min(1, ckdScore)),
            risk: calculateRisk(ckdScore),
        },
        recommendations: {
            nextActions: "Consult with a primary care physician for a detailed check-up.",
            dietaryAdvice: "Consider a balanced diet low in processed sugars and saturated fats.",
            doctorVisit: "A doctor's visit is recommended within the next month.",
        },
        patientSummary: "Based on the provided data, there are moderate risk factors for several conditions. A professional medical consultation is advised to get a comprehensive diagnosis."
    };
};

export const predictionService = {
    createPrediction: async (patientData: PatientData): Promise<any> => {
        const prediction = simulatePrediction(patientData);
        const fallbackResult = { id: fallbackPredictionId++, ...prediction };

        try {
            const [patientRows]: any = await pool.query('SELECT id FROM patients WHERE name = ? AND age = ?', [patientData.name, patientData.age]);
            let patientId;

            if (patientRows.length > 0) {
                patientId = patientRows[0].id;
            } else {
                const [newPatient]: any = await pool.query('INSERT INTO patients SET ?', [patientData]);
                patientId = newPatient.insertId;
            }

            const predictionResult = {
                patient_id: patientId,
                diabetes_prob: prediction.diabetes.probability,
                diabetes_risk: prediction.diabetes.risk,
                cvd_prob: prediction.cardiovascularDisease.probability,
                cvd_risk: prediction.cardiovascularDisease.risk,
                ckd_prob: prediction.chronicKidneyDisease.probability,
                ckd_risk: prediction.chronicKidneyDisease.risk,
                recommendations: JSON.stringify(prediction.recommendations),
                patient_summary: prediction.patientSummary
            };

            const [newPrediction]: any = await pool.query('INSERT INTO predictions SET ?', [predictionResult]);

            // Best-effort blockchain record persistence.
            try {
                await recordService.createRecord(patientId, JSON.stringify({ patientData, prediction }), patientData.name);
            } catch (error) {
                console.error('Record persistence failed, returning prediction anyway.', error);
            }

            return { id: newPrediction.insertId, ...prediction };
        } catch (error) {
            console.error('Database unavailable, returning in-memory prediction.', error);
            const patientId = fallbackPatientId++;

            try {
                await recordService.createRecord(patientId, JSON.stringify({ patientData, prediction }), patientData.name);
            } catch (recordError) {
                console.error('Fallback record creation failed.', recordError);
            }

            fallbackPredictions.unshift({
                ...fallbackResult,
                patient_id: patientId,
                created_at: new Date().toISOString(),
            });
            return fallbackResult;
        }
    },

    getPredictions: async (): Promise<any> => {
        try {
            const [rows] = await pool.query('SELECT * FROM predictions');
            return rows;
        } catch (error) {
            console.error('Database unavailable, returning in-memory predictions.', error);
            return fallbackPredictions;
        }
    },

    getPredictionById: async (id: number): Promise<any> => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM predictions WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Database unavailable, returning in-memory prediction by id.', error);
            return fallbackPredictions.find(prediction => prediction.id === id);
        }
    }
};
