import { motion } from 'framer-motion';
import { GraduationCap, Code2 } from 'lucide-react';

const team = [
  { name: 'Spandana SR', srn: 'R23EI042', role: 'AI Model Development', focus: 'ML model training, data preprocessing, and prediction engine' },
  { name: 'Madhumitha K URS', srn: 'R23EI020', role: 'Blockchain Integration', focus: 'Smart contract development, Ethereum integration, Web3.py' },
  { name: 'Navya Deepthi K', srn: 'R23EI057', role: 'Backend Development', focus: 'Flask API, database design, record hashing system' },
  { name: 'Hema Sai', srn: 'R23EI058', role: 'Frontend & UI/UX', focus: 'User interface design, patient/doctor portals' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function TeamSection() {
  return (
    <section id="team" className="py-24 px-6 lg:px-12 bg-muted/30 transition-colors duration-700">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Project Team</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Built by REVA University Students</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">School of Computer Science and Engineering — Mini Project (B22CI0605)</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {team.map((member) => (
            <motion.div
              key={member.srn}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/20 transition-all duration-500 group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl font-bold text-primary font-display">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </motion.div>
              <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">{member.srn}</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-medium text-primary">{member.role}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{member.focus}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-card border border-border rounded-xl p-8 text-center transition-colors duration-500">
          <GraduationCap className="w-8 h-8 text-primary mx-auto mb-3" />
          <h4 className="font-display text-lg font-semibold text-foreground mb-1">CAE REVA University</h4>
          <p className="text-muted-foreground">Department of Computer Science and Engineering</p>
          <p className="text-sm text-muted-foreground mt-1">Course: Mini Project – Research Based (B22CI0605 / B22EI0605)</p>
        </motion.div>
      </div>
    </section>
  );
}
