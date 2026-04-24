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

