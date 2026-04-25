import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, CheckCircle, Info, Loader2, MessageSquare } from 'lucide-react';
import { predictDisease, type HealthParameters, type PredictionResult } from '@/data/healthData';
import aiPredictionImage from '@/assets/ai-prediction.jpg';

const defaultParams: HealthParameters = {
  glucose: 110,
  bloodPressureSystolic: 130,
  bloodPressureDiastolic: 85,
  bmi: 27.5,
  insulin: 120,
  age: 48,
  skinThickness: 29,
  pregnancies: 0,
  diabetesPedigree: 0.45,
  cholesterol: 215,
  heartRate: 78,
  serumCreatinine: 1.1,
};

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

export function PredictionSection() {
  const [params, setParams] = useState<HealthParameters>(defaultParams);
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 1800));
    const res = predictDisease(params);
    setResults(res);
    setLoading(false);
  };

  const handleShareWhatsApp = () => {
    if (!results) return;
    
    const summary = results.map(r => 
      `*${r.disease}*: ${r.riskLevel} Risk (${r.probability}%)\n- Factors: ${r.factors.join(', ')}\n- Recommendation: ${r.recommendation}`
    ).join('\n\n');
    
    const text = encodeURIComponent(`*HealthChain-AI Analysis Report*\n\n${summary}\n\n_Generated via HealthChain-AI_`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const updateParam = (key: keyof HealthParameters, value: string) => {
    setParams(p => ({ ...p, [key]: parseFloat(value) || 0 }));
  };

  const fields: { key: keyof HealthParameters; label: string; unit: string; min: number; max: number; step: number }[] = [
    { key: 'age', label: 'Age', unit: 'years', min: 1, max: 120, step: 1 },
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

  return (
    <section id="prediction" className="py-24 px-6 lg:px-12 bg-muted/30 transition-colors duration-700">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">AI-Powered Analysis</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Disease Risk Prediction Engine
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Enter patient health parameters to generate AI-driven risk assessments for diabetes, cardiovascular disease, and chronic kidney disease.
          </p>
        </motion.div>

        {/* AI Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden mb-12 shadow-lg"
        >
          <img src={aiPredictionImage} alt="AI neural network and ECG heartbeat visualization for disease prediction" loading="lazy" width={800} height={600} className="w-full h-32 sm:h-44 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-healthcare-teal/80 to-healthcare-blue/60 flex items-center justify-center">
            <div className="text-center text-white">
              <Brain className="w-10 h-10 mx-auto mb-2 opacity-90" />
              <p className="font-display font-bold text-xl sm:text-2xl">Machine Learning Prediction Engine</p>
              <p className="text-sm opacity-80">Random Forest • SVM • Neural Networks</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="lg:col-span-2 bg-card border border-border rounded-xl p-6 transition-colors duration-500">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Health Parameters
            </h3>

            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
              {fields.map(f => (
                <div key={f.key} className="group">
                  <label className="text-sm font-medium text-foreground flex justify-between">
                    {f.label}
                    <span className="text-muted-foreground font-normal tabular-nums">{params[f.key]} {f.unit}</span>
                  </label>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={params[f.key]}
                    onChange={e => updateParam(f.key, e.target.value)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-1 transition-all duration-300"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{f.min}</span>
                    <span>{f.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              onClick={handlePredict}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Parameters...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Run AI Prediction
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px] transition-colors duration-500">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Brain className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-foreground font-semibold mt-6">Analyzing Health Parameters...</p>
                  <p className="text-muted-foreground text-sm mt-2">Running ML model inference</p>
                </motion.div>
              ) : results ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-4">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.disease}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-500"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-display text-lg font-semibold text-foreground">{r.disease}</h4>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mt-2 ${riskColors[r.riskLevel]}`}>
                            {r.riskLevel === 'Low' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            {r.riskLevel} Risk
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold font-display text-foreground">{r.probability}%</p>
                          <p className="text-xs text-muted-foreground">Risk Probability</p>
                        </div>
                      </div>

                      <div className="w-full h-2.5 bg-muted rounded-full mb-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.probability}%` }}
                          transition={{ duration: 1.2, delay: i * 0.15 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className={`h-full rounded-full ${riskBarColors[r.riskLevel]}`}
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1.5">Risk Factors:</p>
                          <div className="flex flex-wrap gap-2">
                            {r.factors.map(f => (
                              <span key={f} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-md transition-colors duration-300">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-accent/50 p-3 rounded-lg transition-colors duration-300">
                          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm text-foreground">{r.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleShareWhatsApp}
                    className="w-full bg-[#25D366] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md mt-6"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Share Results to WhatsApp
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px] text-center transition-colors duration-500">
                  <Brain className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h4 className="font-display text-xl font-semibold text-foreground mb-2">Ready for Analysis</h4>
                  <p className="text-muted-foreground max-w-sm">
                    Adjust the health parameters on the left and click "Run AI Prediction" to generate risk assessments.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
