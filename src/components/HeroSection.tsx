import { motion } from 'framer-motion';
import { Activity, Shield, Brain, ArrowRight } from 'lucide-react';
import { dashboardStats } from '@/data/healthData';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-secondary" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blockchain-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Blockchain-Secured Healthcare
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              AI-Driven{' '}
              <span className="gradient-text">Predictive Healthcare</span>{' '}
              Without Limits
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Early disease detection powered by machine learning, with blockchain-secured 
              medical records ensuring tamper-proof data integrity for every patient.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#prediction" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:opacity-90 gentle-animation text-base">
                <Brain className="w-5 h-5" />
                Run AI Prediction
              </a>
              <a href="#methodology" className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-8 py-4 rounded-xl hover:bg-muted gentle-animation text-base">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right - Stats Cards */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="grid grid-cols-2 gap-4">
            {[
              { label: 'Patients Monitored', value: dashboardStats.totalPatients.toLocaleString(), icon: Activity, color: 'text-healthcare-teal' },
              { label: 'AI Predictions Today', value: dashboardStats.predictionsToday.toString(), icon: Brain, color: 'text-healthcare-blue' },
              { label: 'Records Verified', value: dashboardStats.recordsVerified.toLocaleString(), icon: Shield, color: 'text-healthcare-green' },
              { label: 'Model Accuracy', value: `${dashboardStats.accuracyRate}%`, icon: Activity, color: 'text-blockchain-purple' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="glass-card rounded-xl p-6 hover:shadow-lg gentle-animation"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <p className="text-3xl font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
