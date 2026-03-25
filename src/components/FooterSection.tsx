import { Activity, Shield, Brain } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="bg-foreground text-background py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">HealthChain AI</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              AI-Driven Predictive Healthcare with Blockchain-Secured Medical Records. A research-based mini project by REVA University students.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <div className="space-y-2 text-sm text-background/60">
              <a href="#prediction" className="block hover:text-background">AI Prediction Engine</a>
              <a href="#records" className="block hover:text-background">Blockchain Records</a>
              <a href="#methodology" className="block hover:text-background">Methodology</a>
              <a href="#features" className="block hover:text-background">Features</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Technology</h4>
            <div className="space-y-2 text-sm text-background/60">
              <p className="flex items-center gap-2"><Brain className="w-4 h-4" /> Scikit-Learn / Python</p>
              <p className="flex items-center gap-2"><Shield className="w-4 h-4" /> Ethereum / Solidity</p>
              <p className="flex items-center gap-2"><Activity className="w-4 h-4" /> React / TypeScript</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-sm text-background/40">
          <p>© 2026 HealthChain AI — CAE REVA University, School of Computer Science and Engineering</p>
          <p className="mt-1">Mini Project (B22CI0605 / B22EI0605) — Spandana SR, Madhumitha K URS, Navya Deepthi K, Hema Sai</p>
        </div>
      </div>
    </footer>
  );
}
