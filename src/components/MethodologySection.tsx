import { motion } from 'framer-motion';
import { Database, Brain, Lock, Shield, FileCheck, Monitor } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'Data Collection & Preparation',
    description: 'Collect public healthcare datasets (diabetes, heart disease). Clean data and select relevant parameters: age, glucose, blood pressure, BMI, cholesterol, insulin levels.',
    tech: 'Python, Pandas, Scikit-Learn',
  },
  {
    icon: Brain,
    title: 'AI Model Development',
    description: 'Train machine learning models (Random Forest, SVM, Neural Networks) to analyze patient parameters and predict disease risk with cross-validated accuracy.',
    tech: 'Scikit-Learn, TensorFlow',
  },
  {
    icon: Lock,
    title: 'Medical Record Storage',
    description: 'Store patient details and prediction results in a secure database. Generate SHA-256 cryptographic hash of each record for blockchain anchoring.',
    tech: 'SQLite, SHA-256 Hashing',
  },
  {
    icon: Shield,
    title: 'Blockchain Integration',
    description: 'Deploy Solidity smart contract on Ethereum. Store record hashes on-chain via Web3.py to ensure immutable, tamper-proof verification.',
    tech: 'Solidity, Ethereum, Ganache, Web3.py',
  },
  {
    icon: FileCheck,
    title: 'Record Verification',
    description: 'When records are accessed, compute current hash and compare with blockchain-stored hash. Any mismatch indicates tampering.',
    tech: 'Smart Contract Queries',
  },
  {
    icon: Monitor,
    title: 'User Interface',
    description: 'Web interface for doctors to upload patient data and run predictions. Patients can securely view records, AI predictions, and blockchain verification status.',
    tech: 'React, TypeScript, Tailwind CSS',
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="py-24 px-6 lg:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">System Architecture</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A six-step pipeline combining AI analysis with blockchain verification.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 lg:gap-8 items-start"
              >
                <div className="relative z-10 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 flex-1 hover:shadow-md gentle-animation">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">{step.tech}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
