import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Shield, Activity } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#prediction', label: 'AI Prediction' },
  { href: '#records', label: 'Records' },
  { href: '#methodology', label: 'Methodology' },
  { href: '#team', label: 'Team' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileOpen]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className={`w-full px-6 lg:px-12 py-4 gentle-animation ${
        isScrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <a href="#" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Health<span className="text-primary">Chain</span> AI
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground gentle-animation">
                {l.label}
              </a>
            ))}
            <a href="#prediction" className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 gentle-animation">
              Try Prediction
            </a>
          </div>

          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden p-2 rounded-lg text-foreground">
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" onClick={() => setIsMobileOpen(false)} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 right-0 h-full w-72 bg-background border-l border-border z-50 p-6 pt-20">
            <div className="flex flex-col gap-4">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setIsMobileOpen(false)} className="text-lg font-medium text-foreground px-4 py-3 rounded-lg hover:bg-muted gentle-animation">
                  {l.label}
                </a>
              ))}
              <a href="#prediction" onClick={() => setIsMobileOpen(false)} className="bg-primary text-primary-foreground font-semibold px-4 py-3 rounded-lg text-center mt-4">
                Try Prediction
              </a>
            </div>
          </motion.div>
        </>
      )}
    </motion.nav>
  );
}
