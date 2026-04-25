import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Brain, FileText, CheckCircle, AlertTriangle, Info, Loader2, X, User, Phone, Droplets, Calendar } from 'lucide-react';

// Updated interfaces to match backend
interface PatientData {
  name: string;
  age: number;
  sex: 'Male' | 'Female';
  bloodPressure: number;
  cholesterol: number;
  glucose: number;
  bmi: number;
}

interface Prediction {
  probability: number;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface PredictionResult {
  id: number;
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

interface PatientFormData {
  name: string;
  age: string;
  gender: 'Male' | 'Female';
  contact: string;
  bloodPressure: string;
  cholesterol: string;
  glucose: string;
  bmi: string;
}

const riskColors: Record<string, string> = {
  Low: 'bg-healthcare-green/10 text-healthcare-green border-healthcare-green/30',
  Medium: 'bg-healthcare-amber/10 text-healthcare-amber border-healthcare-amber/30',
  High: 'bg-healthcare-red/10 text-healthcare-red border-healthcare-red/30',
  Critical: 'bg-blockchain-purple/10 text-blockchain-purple border-blockchain-purple/30',
};

const riskBarColors: Record<string, string> = {
  Low: 'bg-healthcare-green',
  Medium: 'bg-healthcare-amber',
  High: 'bg-healthcare-red',
  Critical: 'bg-blockchain-purple',
};

type RegistrationStep = 'form' | 'results' | 'saved';

export function PatientRegistration() {
  const [step, setStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState<PatientFormData>({ 
    name: '', age: '', gender: 'Male', contact: '',
    bloodPressure: '120', cholesterol: '190', glucose: '100', bmi: '24'
  });
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedPatientName, setSavedPatientName] = useState('');

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Patient name is required';
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) errs.age = 'Valid age (1-120) is required';
    if (!formData.contact.trim() || formData.contact.replace(/\D/g, '').length < 10) errs.contact = 'Valid phone number required';
    if (!formData.bloodPressure || +formData.bloodPressure <= 0) errs.bloodPressure = "Required";
    if (!formData.cholesterol || +formData.cholesterol <= 0) errs.cholesterol = "Required";
    if (!formData.glucose || +formData.glucose <= 0) errs.glucose = "Required";
    if (!formData.bmi || +formData.bmi <= 0) errs.bmi = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRunPrediction = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    
    const patientData: PatientData = {
        name: formData.name,
        age: parseInt(formData.age),
        sex: formData.gender,
        bloodPressure: parseInt(formData.bloodPressure),
        cholesterol: parseInt(formData.cholesterol),
        glucose: parseInt(formData.glucose),
        bmi: parseFloat(formData.bmi)
    };

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        let message = `Failed to get prediction from the server (HTTP ${response.status}).`;
        try {
          const errorPayload = await response.json();
          if (errorPayload?.message && typeof errorPayload.message === 'string') {
            message = errorPayload.message;
          }
        } catch {
          // Keep default message when response body is not JSON.
        }
        throw new Error(message);
      }

      const data: PredictionResult = await response.json();
      setResults(data);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', age: '', gender: 'Male', contact: '',
      bloodPressure: '120', cholesterol: '190', glucose: '100', bmi: '24'
    });
    setResults(null);
    setErrors({});
    setError(null);
    setSaving(false);
    setSavedPatientName('');
    setStep('form');
  };

  const handleSavePatientRecord = async () => {
    setSaving(true);
    try {
      setSavedPatientName(formData.name);
      setStep('saved');
      window.dispatchEvent(new CustomEvent('healthchain-record-saved', {
        detail: {
          patientName: formData.name,
          predictionId: results?.id ?? null,
        }
      }));
    } finally {
      setSaving(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-8">
      {(['form', 'results', 'saved'] as RegistrationStep[]).map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            animate={{ scale: step === s ? 1.15 : 1 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500 ${
              step === s ? 'bg-primary text-primary-foreground' :
              (['form', 'results', 'saved'].indexOf(step) > i) ? 'bg-primary/20 text-primary' :
              'bg-muted text-muted-foreground'
            }`}
          >
            {i + 1}
          </motion.div>
          {i < 2 && <div className={`w-12 h-0.5 transition-colors duration-500 ${['form', 'results', 'saved'].indexOf(step) > i ? 'bg-primary/40' : 'bg-muted'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <section id="register" className="py-24 px-6 lg:px-12 transition-colors duration-700">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Patient Management</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Register Patient & Run Prediction</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Enter patient demographics and health parameters, then generate AI-powered disease risk predictions.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8 transition-colors duration-500">
              {stepIndicator}

              <AnimatePresence mode="wait">
                {step === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-primary" /> Patient Details & Health Parameters
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Patient Details */}
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
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> Contact Number</label>
                        <input type="tel" value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))} placeholder="+91 XXXXX XXXXX"
                          className={`w-full bg-background border ${errors.contact ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                        {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
                      </div>
                      <div></div>
                      {/* Health Parameters */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-muted-foreground" /> Glucose</label>
                        <input type="number" value={formData.glucose} onChange={e => setFormData(p => ({ ...p, glucose: e.target.value }))} placeholder="mg/dL"
                          className={`w-full bg-background border ${errors.glucose ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-muted-foreground" /> Blood Pressure</label>
                        <input type="number" value={formData.bloodPressure} onChange={e => setFormData(p => ({ ...p, bloodPressure: e.target.value }))} placeholder="mmHg"
                          className={`w-full bg-background border ${errors.bloodPressure ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                      </div>
                       <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-muted-foreground" /> Cholesterol</label>
                        <input type="number" value={formData.cholesterol} onChange={e => setFormData(p => ({ ...p, cholesterol: e.target.value }))} placeholder="mg/dL"
                          className={`w-full bg-background border ${errors.cholesterol ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                      </div>
                       <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-muted-foreground" /> BMI</label>
                        <input type="number" value={formData.bmi} onChange={e => setFormData(p => ({ ...p, bmi: e.target.value }))} placeholder="kg/m²"
                          className={`w-full bg-background border ${errors.bmi ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`} />
                      </div>
                    </div>
                    <motion.button onClick={handleRunPrediction} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Run AI Prediction</>}
                    </motion.button>
                    {error && <p className="text-sm text-destructive mt-4 text-center">{error}</p>}
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
                      {Object.entries(results).filter(([key]) => ['diabetes', 'cardiovascularDisease', 'chronicKidneyDisease'].includes(key)).map(([disease, prediction], i) => (
                        <motion.div key={disease} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.4 }}
                          className="bg-background border border-border rounded-lg p-5 hover:shadow-md transition-all duration-500">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-display font-semibold text-foreground">{disease.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border mt-1.5 ${riskColors[(prediction as Prediction).risk]}`}>
                                {(prediction as Prediction).risk === 'Low' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                {(prediction as Prediction).risk} Risk
                              </span>
                            </div>
                            <p className="text-2xl font-bold font-display text-foreground">{((prediction as Prediction).probability * 100).toFixed(1)}%</p>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full mb-3 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(prediction as Prediction).probability * 100}%` }} transition={{ duration: 1, delay: i * 0.12 + 0.2 }}
                              className={`h-full rounded-full ${riskBarColors[(prediction as Prediction).risk]}`} />
                          </div>
                        </motion.div>
                      ))}
                       <div className="bg-accent/50 p-4 rounded-md">
                            <h4 className="font-semibold text-foreground mb-2">Recommendations</h4>
                            <p className="text-sm text-foreground mb-2"><span className="font-medium">Next Actions:</span> {results.recommendations.nextActions}</p>
                            <p className="text-sm text-foreground mb-2"><span className="font-medium">Dietary Advice:</span> {results.recommendations.dietaryAdvice}</p>
                            <p className="text-sm text-foreground"><span className="font-medium">Doctor Visit:</span> {results.recommendations.doctorVisit}</p>
                        </div>
                        <div className="bg-accent/50 p-4 rounded-md">
                            <h4 className="font-semibold text-foreground mb-2">Patient Summary</h4>
                            <p className="text-sm text-foreground">{results.patientSummary}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <motion.button
                        onClick={handleSavePatientRecord}
                        disabled={saving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} Save Patient Record
                      </motion.button>
                      <motion.button
                        onClick={resetForm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 bg-background border border-border text-foreground font-semibold py-3.5 rounded-xl hover:bg-muted transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 'saved' && (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.35 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-healthcare-green/15 text-healthcare-green flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-9 h-9" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">Patient Record Saved</h3>
                    <p className="text-muted-foreground mb-2">Registration completed successfully for:</p>
                    <p className="text-lg font-semibold text-primary mb-8">{savedPatientName || formData.name}</p>

                    <div className="bg-accent/50 rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm text-foreground"><span className="font-medium">Status:</span> Record added to blockchain records feed.</p>
                      <p className="text-sm text-foreground mt-1"><span className="font-medium">Next:</span> Scroll to Records section to see the new entry with patient name.</p>
                    </div>

                    <div className="flex gap-3">
                      <motion.a
                        href="#records"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FileText className="w-5 h-5" /> View Blockchain Records
                      </motion.a>
                      <motion.button
                        onClick={resetForm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-background border border-border text-foreground font-semibold py-3.5 rounded-xl hover:bg-muted transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-5 h-5" /> Register Another Patient
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
      </div>
    </section>
  );
}
