import { motion } from 'framer-motion';

const stack = [
  { component: 'AI / ML', tech: 'Python (Scikit-Learn)', description: 'Disease prediction models' },
  { component: 'Blockchain', tech: 'Ethereum / Ganache', description: 'Decentralized record storage' },
  { component: 'Smart Contract', tech: 'Solidity', description: 'On-chain hash verification' },
  { component: 'Backend API', tech: 'Python Flask', description: 'REST API endpoints' },
  { component: 'Frontend', tech: 'React + TypeScript', description: 'Interactive web interface' },
  { component: 'Database', tech: 'SQLite', description: 'Local patient data storage' },
  { component: 'Blockchain API', tech: 'Web3.py', description: 'Smart contract interaction' },
];

export function TechStack() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-background transition-colors duration-700">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Technology</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Technology Stack</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="bg-card border border-border rounded-xl overflow-hidden transition-colors duration-500">
          <div className="grid grid-cols-3 bg-muted px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border transition-colors duration-500">
            <span>Component</span>
            <span>Technology</span>
            <span>Purpose</span>
          </div>
          {stack.map((item, i) => (
            <motion.div
              key={item.component}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ backgroundColor: 'var(--muted)', x: 4 }}
              className={`grid grid-cols-3 px-6 py-4 text-sm transition-all duration-300 ${i < stack.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="font-semibold text-foreground">{item.component}</span>
              <span className="text-primary font-medium font-mono text-xs">{item.tech}</span>
              <span className="text-muted-foreground">{item.description}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
