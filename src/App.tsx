import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PredictionSection } from './components/PredictionSection';
import { BlockchainRecords } from './components/BlockchainRecords';
import { AnalyticsSection } from './components/AnalyticsSection';
import { MethodologySection } from './components/MethodologySection';
import { TechStack } from './components/TechStack';

import { FooterSection } from './components/FooterSection';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PredictionSection />
        <BlockchainRecords />
        <AnalyticsSection />
        <MethodologySection />
        <TechStack />
        
      </main>
      <FooterSection />
    </div>
  );
}
