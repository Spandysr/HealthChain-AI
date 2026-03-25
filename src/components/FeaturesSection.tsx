import { motion } from 'framer-motion';
import { Brain, Shield, Database, Users, Lock, BarChart3 } from 'lucide-react';
import blockchainImage from '@/assets/blockchain-network.jpg';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 lg:px-12 bg-background transition-colors duration-700">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Platform Capabilities</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Intelligent Healthcare, Secured by Blockchain
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Combining AI-powered disease prediction with blockchain data security for a healthcare system you can trust.
          </p>
        </motion.div>

        {/* Blockchain image banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden mb-16 shadow-xl"
        >
          <img src={blockchainImage} alt="Blockchain network securing medical data with interconnected nodes and digital locks" loading="lazy" width={1280} height={720} className="w-full h-48 sm:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent flex items-center">
            <div className="px-8 sm:px-12 max-w-lg">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Secured by Ethereum</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Every medical record hash stored on-chain via smart contracts for immutable verification.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              className="bg-card border border-border rounded-xl p-8 hover:border-primary/20 transition-all duration-500 group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5`}
              >
                <f.icon className="w-6 h-6" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
