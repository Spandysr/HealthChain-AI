import { motion } from 'framer-motion';
import { Activity, Shield, Brain, ArrowRight } from 'lucide-react';
import { dashboardStats } from '@/data/healthData';
import heroImage from '@/assets/hero-healthcare.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-secondary transition-colors duration-700" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blockchain-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              Blockchain-Secured Healthcare
            </motion.div>

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
              <motion.a
                href="#prediction"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(8, 145, 178, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base"
              >
                <Brain className="w-5 h-5" />
                Run AI Prediction
              </motion.a>
              <motion.a
                href="#methodology"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-8 py-4 rounded-xl hover:bg-muted transition-all duration-300 text-base"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right - Hero Image + Stats */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={heroImage} alt="AI Healthcare Dashboard showing brain scan, DNA helix and health monitoring" width={1280} height={720} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-card rounded-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 bg-healthcare-green rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-foreground">AI Model Active — Processing {dashboardStats.predictionsToday} predictions today</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Patients', value: dashboardStats.totalPatients.toLocaleString(), icon: Activity, color: 'text-healthcare-teal' },
                { label: 'Predictions', value: dashboardStats.predictionsToday.toString(), icon: Brain, color: 'text-healthcare-blue' },
                { label: 'Verified', value: dashboardStats.recordsVerified.toLocaleString(), icon: Shield, color: 'text-healthcare-green' },
                { label: 'Accuracy', value: `${dashboardStats.accuracyRate}%`, icon: Activity, color: 'text-blockchain-purple' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                  className="glass-card rounded-xl p-4 transition-all duration-300 cursor-default"
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-xl font-bold font-display text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
