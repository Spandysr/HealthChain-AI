import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Activity, Clock, Users, FileText, CheckSquare, AlertCircle } from 'lucide-react';

interface AnalyticsSummary {
  totalPatients: number;
  totalPredictions: number;
  totalRecords: number;
  verifiedRecords: number;
  riskDistribution: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
}

const riskColors: { [key: string]: string } = {
  Low: 'var(--healthcare-green)',
  Medium: 'var(--healthcare-amber)',
  High: 'var(--healthcare-red)',
  Critical: 'var(--blockchain-purple)',
};

export function AnalyticsSection() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics summary');
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const riskData = summary ? Object.entries(summary.riskDistribution).map(([name, value]) => ({
    name,
    value,
    color: riskColors[name] || '#8884d8'
  })) : [];

  const stats = summary ? [
    { label: 'Total Patients', value: summary.totalPatients.toLocaleString(), icon: Users },
    { label: 'Total Predictions', value: summary.totalPredictions.toLocaleString(), icon: TrendingUp },
    { label: 'Total Records', value: summary.totalRecords.toLocaleString(), icon: FileText },
    { label: 'Records Verified', value: summary.verifiedRecords.toLocaleString(), icon: CheckSquare },
  ] : [];

  if (loading) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-background transition-colors duration-700 text-center">
        <p>Loading Analytics...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-background transition-colors duration-700 text-center text-destructive">
        <AlertCircle className="mx-auto h-12 w-12" />
        <p className="mt-4">Could not load analytics data: {error}</p>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 lg:px-12 bg-background transition-colors duration-700">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
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
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-xl p-5 transition-all duration-500 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-xl p-6 transition-colors duration-500">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Patient Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={4}>
                  {riskData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-card border border-border rounded-xl p-6 transition-colors duration-500">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">More Analytics Coming Soon</h3>
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Monthly prediction charts will be added here.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
