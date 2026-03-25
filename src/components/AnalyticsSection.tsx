import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { monthlyPredictions, riskDistribution, dashboardStats } from '@/data/healthData';
import { TrendingUp, Activity, Clock } from 'lucide-react';

export function AnalyticsSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">System Analytics</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Platform Performance Metrics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real-time analytics tracking disease predictions, risk distributions, and blockchain transaction volumes.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Blockchain Txns', value: dashboardStats.blockchainTransactions.toLocaleString(), icon: Activity, change: '+12.5%' },
            { label: 'Avg Response Time', value: `${dashboardStats.avgResponseTime}s`, icon: Clock, change: '-0.3s' },
            { label: 'Prediction Accuracy', value: `${dashboardStats.accuracyRate}%`, icon: TrendingUp, change: '+1.2%' },
            { label: 'Records Verified', value: dashboardStats.recordsVerified.toLocaleString(), icon: Activity, change: '+8.3%' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-healthcare-green">{s.change}</span>
              </div>
              <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart - Monthly Predictions */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Monthly Predictions by Disease</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPredictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                <Bar dataKey="diabetes" name="Diabetes" fill="var(--healthcare-teal)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="heart" name="Heart Disease" fill="var(--healthcare-red)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="kidney" name="Kidney Disease" fill="var(--blockchain-purple)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart - Risk Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Patient Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={4}>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
