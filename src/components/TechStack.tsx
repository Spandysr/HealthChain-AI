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
    <section className="py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Technology</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Technology Stack
          </h2>
        </motion.div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            <span>Component</span>
            <span>Technology</span>
            <span>Purpose</span>
          </div>
          {stack.map((item, i) => (
            <motion.div
              key={item.component}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-3 px-6 py-4 text-sm ${i < stack.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 gentle-animation`}
            >
              <span className="font-semibold text-foreground">{item.component}</span>
              <span className="text-primary font-medium font-mono text-xs">{item.tech}</span>
              <span className="text-muted-foreground">{item.description}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
