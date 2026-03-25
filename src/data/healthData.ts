// Realistic patient records and health data

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

export const patients: Patient[] = [
  { id: 'P-10234', name: 'Rajesh Kumar', age: 54, gender: 'Male', bloodGroup: 'B+', contact: '+91 98765 43210', lastVisit: '2026-03-20', status: 'Active' },
  { id: 'P-10235', name: 'Priya Sharma', age: 38, gender: 'Female', bloodGroup: 'O+', contact: '+91 87654 32109', lastVisit: '2026-03-18', status: 'Active' },
  { id: 'P-10236', name: 'Amit Patel', age: 62, gender: 'Male', bloodGroup: 'A-', contact: '+91 76543 21098', lastVisit: '2026-03-22', status: 'Critical' },
  { id: 'P-10237', name: 'Sneha Reddy', age: 29, gender: 'Female', bloodGroup: 'AB+', contact: '+91 65432 10987', lastVisit: '2026-03-19', status: 'Active' },
  { id: 'P-10238', name: 'Vikram Singh', age: 47, gender: 'Male', bloodGroup: 'O-', contact: '+91 54321 09876', lastVisit: '2026-03-21', status: 'Recovered' },
  { id: 'P-10239', name: 'Ananya Desai', age: 35, gender: 'Female', bloodGroup: 'B-', contact: '+91 43210 98765', lastVisit: '2026-03-23', status: 'Active' },
  { id: 'P-10240', name: 'Karthik Nair', age: 58, gender: 'Male', bloodGroup: 'A+', contact: '+91 32109 87654', lastVisit: '2026-03-17', status: 'Critical' },
  { id: 'P-10241', name: 'Meera Iyer', age: 44, gender: 'Female', bloodGroup: 'AB-', contact: '+91 21098 76543', lastVisit: '2026-03-24', status: 'Active' },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: 'MR-5001', patientId: 'P-10234', patientName: 'Rajesh Kumar',
    date: '2026-03-20', diagnosis: 'Type 2 Diabetes Mellitus',
    treatment: 'Metformin 500mg BD, Dietary counseling, HbA1c monitoring',
    doctor: 'Dr. Anil Mehta', department: 'Endocrinology',
    blockchainHash: '0x7a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    blockchainTxId: '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456',
    verified: true, blockNumber: 18942567, timestamp: 1710892800
  },
  {
    id: 'MR-5002', patientId: 'P-10235', patientName: 'Priya Sharma',
    date: '2026-03-18', diagnosis: 'Gestational Diabetes Screening - Normal',
    treatment: 'Routine monitoring, Folic acid supplementation',
    doctor: 'Dr. Kavitha Rao', department: 'Obstetrics',
    blockchainHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    blockchainTxId: '0xdef456789abc012345678901234567890abcdef1234567890abcdef12345678',
    verified: true, blockNumber: 18942103, timestamp: 1710720000
  },
  {
    id: 'MR-5003', patientId: 'P-10236', patientName: 'Amit Patel',
    date: '2026-03-22', diagnosis: 'Acute Myocardial Infarction (STEMI)',
    treatment: 'Emergency PCI, Dual antiplatelet therapy, Statin, ACE inhibitor, Beta-blocker',
    doctor: 'Dr. Sanjay Gupta', department: 'Cardiology',
    blockchainHash: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
    blockchainTxId: '0x789abc012def345678901234567890abcdef1234567890abcdef1234567890',
    verified: true, blockNumber: 18943201, timestamp: 1711065600
  },
  {
    id: 'MR-5004', patientId: 'P-10237', patientName: 'Sneha Reddy',
    date: '2026-03-19', diagnosis: 'Iron Deficiency Anemia',
    treatment: 'Ferrous sulfate 200mg TDS, Vitamin C supplementation, Diet modification',
    doctor: 'Dr. Pradeep Joshi', department: 'Internal Medicine',
    blockchainHash: '0x8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    blockchainTxId: '0x012345678abc9def01234567890abcdef1234567890abcdef12345678901234',
    verified: true, blockNumber: 18942345, timestamp: 1710806400
  },
  {
    id: 'MR-5005', patientId: 'P-10238', patientName: 'Vikram Singh',
    date: '2026-03-21', diagnosis: 'Hypertension Stage 2 - Controlled',
    treatment: 'Amlodipine 10mg OD, Losartan 50mg OD, Low-sodium diet',
    doctor: 'Dr. Anil Mehta', department: 'Cardiology',
    blockchainHash: '0x0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
    blockchainTxId: '0x345678901abc2def34567890abcdef1234567890abcdef1234567890123456',
    verified: false, blockNumber: 18942890, timestamp: 1710979200
  },
  {
    id: 'MR-5006', patientId: 'P-10240', patientName: 'Karthik Nair',
    date: '2026-03-17', diagnosis: 'Chronic Kidney Disease Stage 3',
    treatment: 'ACE inhibitor, Dietary protein restriction, Phosphate binder, Erythropoietin',
    doctor: 'Dr. Ravi Shankar', department: 'Nephrology',
    blockchainHash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    blockchainTxId: '0x678901234abc5def67890abcdef1234567890abcdef1234567890abcdef12',
    verified: true, blockNumber: 18941876, timestamp: 1710633600
  },
];

// Simulated AI prediction engine
export function predictDisease(params: HealthParameters): PredictionResult[] {
  const results: PredictionResult[] = [];

  // Diabetes prediction logic
  const diabetesScore = (
    (params.glucose > 140 ? 0.3 : params.glucose > 100 ? 0.15 : 0) +
    (params.bmi > 30 ? 0.25 : params.bmi > 25 ? 0.12 : 0) +
    (params.age > 45 ? 0.15 : params.age > 35 ? 0.08 : 0) +
    (params.insulin > 166 ? 0.15 : params.insulin > 100 ? 0.08 : 0) +
    (params.diabetesPedigree > 0.5 ? 0.15 : params.diabetesPedigree > 0.3 ? 0.08 : 0)
  );
  const diabetesProb = Math.min(diabetesScore * 100, 97);
  if (diabetesProb > 10) {
    const factors: string[] = [];
    if (params.glucose > 140) factors.push('High fasting glucose (>140 mg/dL)');
    else if (params.glucose > 100) factors.push('Elevated fasting glucose (>100 mg/dL)');
    if (params.bmi > 30) factors.push('Obesity (BMI > 30)');
    else if (params.bmi > 25) factors.push('Overweight (BMI > 25)');
    if (params.age > 45) factors.push('Age above 45');
    if (params.insulin > 166) factors.push('Elevated insulin levels');
    if (params.diabetesPedigree > 0.5) factors.push('Strong family history');
    results.push({
      disease: 'Type 2 Diabetes Mellitus',
      riskLevel: diabetesProb > 70 ? 'Critical' : diabetesProb > 50 ? 'High' : diabetesProb > 30 ? 'Moderate' : 'Low',
      probability: Math.round(diabetesProb),
      factors: factors.length ? factors : ['No significant risk factors detected'],
      recommendation: diabetesProb > 50 
        ? 'Immediate consultation with endocrinologist. HbA1c test and oral glucose tolerance test recommended.'
        : 'Regular glucose monitoring recommended. Maintain healthy diet and exercise routine.'
    });
  }

  // Heart disease prediction
  const heartScore = (
    (params.bloodPressureSystolic > 140 ? 0.25 : params.bloodPressureSystolic > 120 ? 0.12 : 0) +
    (params.cholesterol > 240 ? 0.25 : params.cholesterol > 200 ? 0.12 : 0) +
    (params.age > 55 ? 0.2 : params.age > 40 ? 0.1 : 0) +
    (params.heartRate > 100 ? 0.15 : params.heartRate > 85 ? 0.08 : 0) +
    (params.bmi > 30 ? 0.15 : params.bmi > 27 ? 0.08 : 0)
  );
  const heartProb = Math.min(heartScore * 100, 95);
  if (heartProb > 10) {
    const factors: string[] = [];
    if (params.bloodPressureSystolic > 140) factors.push('Hypertension (>140 mmHg systolic)');
    else if (params.bloodPressureSystolic > 120) factors.push('Elevated blood pressure');
    if (params.cholesterol > 240) factors.push('High cholesterol (>240 mg/dL)');
    else if (params.cholesterol > 200) factors.push('Borderline high cholesterol');
    if (params.age > 55) factors.push('Age above 55');
    if (params.heartRate > 100) factors.push('Elevated resting heart rate');
    if (params.bmi > 30) factors.push('Obesity');
    results.push({
      disease: 'Cardiovascular Disease',
      riskLevel: heartProb > 70 ? 'Critical' : heartProb > 50 ? 'High' : heartProb > 30 ? 'Moderate' : 'Low',
      probability: Math.round(heartProb),
      factors: factors.length ? factors : ['No significant risk factors detected'],
      recommendation: heartProb > 50
        ? 'Urgent cardiology consultation. ECG, echocardiogram, and lipid panel required.'
        : 'Annual cardiovascular screening recommended. Consider lifestyle modifications.'
    });
  }

  // Kidney disease prediction
  const kidneyScore = (
    (params.serumCreatinine > 1.5 ? 0.35 : params.serumCreatinine > 1.2 ? 0.15 : 0) +
    (params.bloodPressureSystolic > 140 ? 0.2 : 0) +
    (params.glucose > 140 ? 0.15 : 0) +
    (params.age > 60 ? 0.15 : params.age > 45 ? 0.08 : 0) +
    (params.bmi > 30 ? 0.1 : 0)
  );
  const kidneyProb = Math.min(kidneyScore * 100, 92);
  if (kidneyProb > 10) {
    const factors: string[] = [];
    if (params.serumCreatinine > 1.5) factors.push('Elevated serum creatinine (>1.5 mg/dL)');
    else if (params.serumCreatinine > 1.2) factors.push('Borderline creatinine levels');
    if (params.bloodPressureSystolic > 140) factors.push('Hypertension');
    if (params.glucose > 140) factors.push('Diabetes comorbidity');
    if (params.age > 60) factors.push('Age above 60');
    results.push({
      disease: 'Chronic Kidney Disease',
      riskLevel: kidneyProb > 70 ? 'Critical' : kidneyProb > 50 ? 'High' : kidneyProb > 30 ? 'Moderate' : 'Low',
      probability: Math.round(kidneyProb),
      factors: factors.length ? factors : ['No significant risk factors detected'],
      recommendation: kidneyProb > 50
        ? 'Nephrology referral recommended. GFR estimation, urine albumin test, and renal ultrasound needed.'
        : 'Monitor kidney function annually. Maintain hydration and avoid nephrotoxic drugs.'
    });
  }

  if (results.length === 0) {
    results.push({
      disease: 'General Health Assessment',
      riskLevel: 'Low',
      probability: 5,
      factors: ['All parameters within normal range'],
      recommendation: 'Continue maintaining a healthy lifestyle. Annual check-up recommended.'
    });
  }

  return results.sort((a, b) => b.probability - a.probability);
}

// Dashboard statistics
export const dashboardStats = {
  totalPatients: 1247,
  predictionsToday: 89,
  recordsVerified: 4832,
  blockchainTransactions: 12456,
  accuracyRate: 94.7,
  avgResponseTime: 1.2,
};

// Monthly prediction data for charts
export const monthlyPredictions = [
  { month: 'Oct', diabetes: 34, heart: 28, kidney: 12, total: 74 },
  { month: 'Nov', diabetes: 41, heart: 32, kidney: 15, total: 88 },
  { month: 'Dec', diabetes: 38, heart: 35, kidney: 18, total: 91 },
  { month: 'Jan', diabetes: 45, heart: 30, kidney: 14, total: 89 },
  { month: 'Feb', diabetes: 52, heart: 38, kidney: 20, total: 110 },
  { month: 'Mar', diabetes: 48, heart: 41, kidney: 22, total: 111 },
];

export const riskDistribution = [
  { name: 'Low Risk', value: 42, color: '#059669' },
  { name: 'Moderate', value: 31, color: '#d97706' },
  { name: 'High Risk', value: 19, color: '#dc2626' },
  { name: 'Critical', value: 8, color: '#7c3aed' },
];
