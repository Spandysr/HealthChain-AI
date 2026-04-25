// This file is now primarily for type definitions.
// The static data has been moved to the backend and is served via API.

export interface HealthParameters {
  glucose: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bmi: number;
  insulin: number;
  age: number;
  skinThickness: number;
  pregnancies?: number;
  diabetesPedigree: number;
  cholesterol: number;
  heartRate: number;
  serumCreatinine: number;
}

export interface PredictionResult {
  disease: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  probability: number;
  factors: string[];
  recommendation: string;
  accuracyConclusion?: string;
  confidenceLevel?: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  contact: string;
  lastVisit: string;
  status: 'Active' | 'Critical' | 'Recovered';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
  department: string;
  blockchainHash: string;
  blockchainTxId: string;
  verified: boolean;
  blockNumber: number;
  timestamp: number;
}

export const dashboardStats = {
  totalPatients: 18420,
  predictionsToday: 764,
  recordsVerified: 17602,
  accuracyRate: 96.4,
};

const clampPercent = (value: number): number => {
  return Math.max(0, Math.min(100, Math.round(value)));
};

const riskFromProbability = (probability: number): PredictionResult['riskLevel'] => {
  if (probability >= 80) {
    return 'Critical';
  }
  if (probability >= 60) {
    return 'High';
  }
  if (probability >= 35) {
    return 'Moderate';
  }
  return 'Low';
};

export const predictDisease = (params: HealthParameters): PredictionResult[] => {
  const diabetesScore =
    params.glucose * 0.30 +
    params.bmi * 1.2 +
    params.age * 0.35 +
    params.diabetesPedigree * 38 +
    (params.pregnancies ?? 0) * 1.8;

  const cardiovascularScore =
    params.bloodPressureSystolic * 0.22 +
    params.bloodPressureDiastolic * 0.18 +
    params.cholesterol * 0.20 +
    params.heartRate * 0.28 +
    params.age * 0.24 +
    params.bmi * 0.65;

  const kidneyScore =
    params.serumCreatinine * 52 +
    params.glucose * 0.12 +
    params.bloodPressureSystolic * 0.17 +
    params.age * 0.24 +
    params.bmi * 0.45;

  const diabetesProbability = clampPercent(diabetesScore / 1.7);
  const cardiovascularProbability = clampPercent(cardiovascularScore / 1.8);
  const kidneyProbability = clampPercent(kidneyScore / 1.4);

  return [
    {
      disease: 'Diabetes Mellitus',
      riskLevel: riskFromProbability(diabetesProbability),
      probability: diabetesProbability,
      factors: ['Glucose', 'BMI', 'Age', 'Family History'],
      recommendation: 'Monitor fasting glucose, improve nutrition, and schedule routine HbA1c tests.',
    },
    {
      disease: 'Cardiovascular Disease',
      riskLevel: riskFromProbability(cardiovascularProbability),
      probability: cardiovascularProbability,
      factors: ['Blood Pressure', 'Cholesterol', 'Heart Rate', 'BMI'],
      recommendation: 'Manage blood pressure and cholesterol, and increase weekly aerobic activity.',
    },
    {
      disease: 'Chronic Kidney Disease',
      riskLevel: riskFromProbability(kidneyProbability),
      probability: kidneyProbability,
      factors: ['Serum Creatinine', 'Blood Pressure', 'Glucose', 'Age'],
      recommendation: 'Assess kidney function with eGFR/urinalysis and maintain hydration and BP control.',
    },
  ];
};

