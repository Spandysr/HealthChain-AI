export interface PatientData {
    name: string;
    age: number;
    sex: 'Male' | 'Female' | 'Other';
    bloodPressure: number;
    cholesterol: number;
    glucose: number;
    bmi: number;
}

export interface Prediction {
    probability: number;
    risk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface PredictionResult {
    diabetes: Prediction;
    cardiovascularDisease: Prediction;
    chronicKidneyDisease: Prediction;
    recommendations: {
        nextActions: string;
        dietaryAdvice: string;
        doctorVisit: string;
    };
    patientSummary: string;
}
