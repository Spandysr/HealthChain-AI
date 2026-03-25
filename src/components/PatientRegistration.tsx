import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Brain, FileText, CheckCircle, AlertTriangle, Info, Loader2, X, User, Phone, Droplets, Calendar } from 'lucide-react';
import { predictDisease, type HealthParameters, type PredictionResult, type Patient } from '@/data/healthData';

interface PatientFormData {
  name: string;
  age: string;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  contact: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const riskColors: Record<string, string> = {
  Low: 'bg-healthcare-green/10 text-healthcare-green border-healthcare-green/30',
  Moderate: 'bg-healthcare-amber/10 text-healthcare-amber border-healthcare-amber/30',
  High: 'bg-healthcare-red/10 text-healthcare-red border-healthcare-red/30',
  Critical: 'bg-blockchain-purple/10 text-blockchain-purple border-blockchain-purple/30',
};

const riskBarColors: Record<string, string> = {
  Low: 'bg-healthcare-green',
  Moderate: 'bg-healthcare-amber',
  High: 'bg-healthcare-red',
  Critical: 'bg-blockchain-purple',
};

const defaultHealth: HealthParameters = {
  glucose: 100, bloodPressureSystolic: 120, bloodPressureDiastolic: 80,
  bmi: 24, insulin: 80, age: 30, skinThickness: 25,
  pregnancies: 0, diabetesPedigree: 0.3, cholesterol: 190, heartRate: 72, serumCreatinine: 0.9,
};

const healthFields: { key: keyof HealthParameters; label: string; unit: string; min: number; max: number; step: number }[] = [
  { key: 'glucose', label: 'Fasting Glucose', unit: 'mg/dL', min: 40, max: 300, step: 1 },
  { key: 'bloodPressureSystolic', label: 'BP (Systolic)', unit: 'mmHg', min: 60, max: 250, step: 1 },
  { key: 'bloodPressureDiastolic', label: 'BP (Diastolic)', unit: 'mmHg', min: 40, max: 150, step: 1 },
  { key: 'cholesterol', label: 'Total Cholesterol', unit: 'mg/dL', min: 100, max: 400, step: 1 },
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', min: 10, max: 60, step: 0.1 },
  { key: 'insulin', label: 'Insulin', unit: 'μU/mL', min: 0, max: 800, step: 1 },
  { key: 'heartRate', label: 'Resting Heart Rate', unit: 'bpm', min: 40, max: 200, step: 1 },
  { key: 'serumCreatinine', label: 'Serum Creatinine', unit: 'mg/dL', min: 0.1, max: 10, step: 0.1 },
  { key: 'diabetesPedigree', label: 'Diabetes Pedigree', unit: '', min: 0, max: 2.5, step: 0.01 },
  { key: 'skinThickness', label: 'Skin Thickness', unit: 'mm', min: 0, max: 100, step: 1 },
];

type Step = 'form' | 'health' | 'results';

export function PatientRegistration() {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<PatientFormData>({ name: '', age: '', gender: 'Male', bloodGroup: 'O+', contact: '' });
  const [healthParams, setHealthParams] = useState<HealthParameters>(defaultHealth);
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredPatients, setRegisteredPatients] = useState<(Patient & { predictions?: PredictionResult[] })[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Patient name is required';
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) errs.age = 'Valid age (1-120) is required';
    if (!formData.contact.trim() || formData.contact.replace(/\D/g, '').length < 10) errs.contact = 'Valid phone number required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 'form') {
      if (!validateForm()) return;
      setHealthParams(p => ({ ...p, age: parseInt(formData.age) || 30 }));
      setStep('health');
    }
  };

  const handleRunPrediction = async () => {
    setLoading(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 2000));
    const res = predictDisease(healthParams);
    setResults(res);
    setLoading(false);
    setStep('results');
  };

  const handleSavePatient = () => {
    const newPatient: Patient & { predictions?: PredictionResult[] } = {
      id: `P-${10242 + registeredPatients.length}`,
      name: formData.name.trim(),
      age: parseInt(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      contact: formData.contact.trim(),
      lastVisit: new Date().toISOString().split('T')[0],
      status: results?.some(r => r.riskLevel === 'Critical') ? 'Critical' : 'Active',
      predictions: results || undefined,
    };
    setRegisteredPatients(prev => [newPatient, ...prev]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', age: '', gender: 'Male', bloodGroup: 'O+', contact: '' });
    setHealthParams(defaultHealth);
    setResults(null);
    setErrors({});
    setStep('form');
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-8">
      {(['form', 'health', 'results'] as Step[]).map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            animate={{ scale: step === s ? 1.15 : 1 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500 ${
              step === s ? 'bg-primary text-primary-foreground' :
              (['form', 'health', 'results'].indexOf(step) > i) ? 'bg-primary/20 text-primary' :
              'bg-muted text-muted-foreground'
            }`}
          >
            {i + 1}
          </motion.div>
          {i < 2 && <div className={`w-12 h-0.5 transition-colors duration-500 ${['form', 'health', 'results'].indexOf(step) > i ? 'bg-primary/40' : 'bg-muted'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <section id="register" className="py-24 px-6 lg:px-12 transition-colors duration-700">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Patient Management</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Register Patient & Run Prediction</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Enter patient demographics and health parameters, then generate AI-powered disease risk predictions.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8 transition-colors duration-500">
              {stepIndicator}

              <AnimatePresence mode="wait">
                {step === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-primary" /> Patient Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Enter patient full name"
                          className={`w-full bg-background border ${errors.name ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Age</label>
                        <input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} placeholder="Age" min={1} max={120}
                          className={`w-full bg-background border ${errors.age ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                        {errors.age && <p className="text-xs text-destructive mt-1">{errors.age}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5">Gender</label>
                        <div className="flex gap-3">
                          {(['Male', 'Female'] as const).map(g => (
                            <button key={g} onClick={() => setFormData(p => ({ ...p, gender: g }))}
                              className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all duration-300 ${formData.gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground hover:border-primary/40'}`}>
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-muted-foreground" /> Blood Group</label>
                        <select value={formData.bloodGroup} onChange={e => setFormData(p => ({ ...p, bloodGroup: e.target.value }))}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300">
                          {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> Contact Number</label>
                        <input type="tel" value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))} placeholder="+91 XXXXX XXXXX"
                          className={`w-full bg-background border ${errors.contact ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                        {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
                      </div>
                    </div>
                    <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                      Continue to Health Parameters <span>→</span>
                    </motion.button>
                  </motion.div>
                )}

                {step === 'health' && (
                  <motion.div key="health" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" /> Health Parameters
                      </h3>
                      <button onClick={() => setStep('form')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      Entering parameters for <span className="font-semibold text-foreground">{formData.name}</span>, age {formData.age}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 max-h-[420px] overflow-y-auto pr-2">
                      {healthFields.map(f => (
                        <div key={f.key}>
                          <label className="text-sm font-medium text-foreground flex justify-between">
                            {f.label}
                            <span className="text-muted-foreground font-normal tabular-nums">{healthParams[f.key]} {f.unit}</span>
                          </label>
                          <input type="range" min={f.min} max={f.max} step={f.step} value={healthParams[f.key]}
                            onChange={e => setHealthParams(p => ({ ...p, [f.key]: parseFloat(e.target.value) || 0 }))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-1 transition-all duration-300" />
                          <div className="flex justify-between text-xs text-muted-foreground"><span>{f.min}</span><span>{f.max}</span></div>
                        </div>
                      ))}
                    </div>
                    <motion.button onClick={handleRunPrediction} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Run AI Prediction</>}
                    </motion.button>
                  </motion.div>
                )}

                {step === 'results' && results && (
                  <motion.div key="results" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Prediction Results
                      </h3>
                      <span className="text-sm text-muted-foreground">Patient: <span className="font-semibold text-foreground">{formData.name}</span></span>
                    </div>

                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                      {results.map((r, i) => (
                        <motion.div key={r.disease} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.4 }}
                          className="bg-background border border-border rounded-lg p-5 hover:shadow-md transition-all duration-500">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-display font-semibold text-foreground">{r.disease}</h4>
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border mt-1.5 ${riskColors[r.riskLevel]}`}>
                                {r.riskLevel === 'Low' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                {r.riskLevel} Risk
                              </span>
                            </div>
                            <p className="text-2xl font-bold font-display text-foreground">{r.probability}%</p>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full mb-3 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${r.probability}%` }} transition={{ duration: 1, delay: i * 0.12 + 0.2 }}
                              className={`h-full rounded-full ${riskBarColors[r.riskLevel]}`} />
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {r.factors.map(f => <span key={f} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded transition-colors duration-300">{f}</span>)}
                          </div>
                          <div className="flex items-start gap-2 bg-accent/50 p-2.5 rounded-md transition-colors duration-300">
                            <Info className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <p className="text-xs text-foreground">{r.recommendation}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-8">
                      <motion.button onClick={handleSavePatient} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Save Patient Record
                      </motion.button>
                      <motion.button onClick={resetForm} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="px-6 border border-border text-foreground font-semibold py-3.5 rounded-xl hover:bg-muted transition-all duration-300 flex items-center justify-center gap-2">
                        <X className="w-5 h-5" /> Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Registered Patients Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
            <div className="bg-card border border-border rounded-xl p-6 transition-colors duration-500 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Recent Registrations
              </h3>
              {registeredPatients.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No patients registered yet.<br />Complete the form to add one.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {registeredPatients.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-background border border-border rounded-lg p-4 hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-sm text-foreground">{p.name}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === 'Critical' ? 'bg-healthcare-red/10 text-healthcare-red' : 'bg-healthcare-green/10 text-healthcare-green'}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{p.id}</span>
                        <span>{p.age}y, {p.gender}</span>
                        <span>{p.bloodGroup}</span>
                      </div>
                      {p.predictions && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.predictions.slice(0, 2).map(pred => (
                            <span key={pred.disease} className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${riskColors[pred.riskLevel]}`}>
                              {pred.disease.split(' ')[0]} {pred.probability}%
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
