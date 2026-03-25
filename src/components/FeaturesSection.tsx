import { motion } from 'framer-motion';
import { Brain, Shield, Database, Users, Lock, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Disease Prediction',
    description: 'Machine learning models analyze patient health parameters to predict risk of diabetes, cardiovascular disease, and chronic kidney disease with 94.7% accuracy.',
    color: 'bg-healthcare-teal/10 text-healthcare-teal',
  },
  {
    icon: Shield,
    title: 'Blockchain Verification',
    description: 'Every medical record is cryptographically hashed and stored on Ethereum blockchain via smart contracts, ensuring tamper-proof data integrity.',
    color: 'bg-blockchain-purple/10 text-blockchain-purple',
  },
  {
    icon: Database,
    title: 'Secure Record Storage',
    description: 'Patient records are securely stored with encrypted access controls. Only authorized doctors and patients can access medical histories.',
    color: 'bg-healthcare-blue/10 text-healthcare-blue',
  },
  {
    icon: Users,
    title: 'Doctor & Patient Portal',
    description: 'Intuitive interfaces for doctors to upload patient data and run AI predictions, and for patients to securely view their records and results.',
    color: 'bg-healthcare-green/10 text-healthcare-green',
  },
  {
    icon: Lock,
    title: 'Data Integrity Checks',
    description: 'Real-time verification compares current record hashes with blockchain-stored hashes to confirm authenticity and detect any tampering.',
    color: 'bg-healthcare-amber/10 text-healthcare-amber',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics tracking prediction trends, risk distributions, and system performance metrics for healthcare administrators.',
    color: 'bg-healthcare-red/10 text-healthcare-red',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Platform Capabilities</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Intelligent Healthcare, Secured by Blockchain
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Combining AI-powered disease prediction with blockchain data security for a healthcare system you can trust.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/20 gentle-animation group"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
