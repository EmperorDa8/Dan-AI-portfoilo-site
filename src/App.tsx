import { lazy, Suspense, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ProofStrip } from './components/ProofStrip';
import { TechStack } from './components/TechStack';
import { Marquee } from './components/Marquee';
import { MoTwoCase } from './components/MoTwoCase';
import { VentureScoutCase } from './components/VentureScoutCase';
import { Featured } from './components/Featured';
import { Works } from './components/Works';
import { HeyBio } from './components/HeyBio';
import { Credentials } from './components/Credentials';
import { FooterCTA } from './components/FooterCTA';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { getLenis, installRevealSafetyNet, useSmoothScroll } from './lib/scroll';
import { registerVelocitySource } from './sound';

/* Three.js is heavy — keep it out of the initial bundle. */
const Scene3D = lazy(() => import('./components/Scene3D').then(m => ({ default: m.Scene3D })));

/* framer-motion's whileInView ships no fallback of its own; without this the
   case studies and credentials render blank if its observer never delivers. */
const WHILE_IN_VIEW = [
  '.case-phase',
  '.case-panel',
  '.case-hero',
  '.cert-card',
  '.tl-entry',
  '.proof-cell',
  '.hey-title',
  '.hey-col-1',
  '.hey-col-2',
  '.hey-col-3',
  '.cta-title',
];

function App() {
  useSmoothScroll();

  useEffect(() => {
    installRevealSafetyNet(WHILE_IN_VIEW);
    // Polled only while sound is enabled, not for the life of the page.
    registerVelocitySource(() => (getLenis() as unknown as { velocity?: number })?.velocity ?? 0);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
      <div className="grain-overlay" aria-hidden />
      <ScrollProgress />
      <Navigation />

      {/* Claim → proof → evidence → person → contact */}
      <Hero />
      <ProofStrip />
      <Marquee />

      {/* Early: recruiters scan for tooling keywords before they read prose. */}
      <TechStack />

      <MoTwoCase />
      <VentureScoutCase />

      <section className="band">
        <div className="band-inner">
          <h2 className="band-title">
            Unfamiliar domain on Monday, <em>deployed by Friday.</em>
          </h2>
          <p className="band-note">
            Fintech trade finance, cybersecurity tooling, game asset pipelines — the pattern is the same: learn the
            domain fast enough to make the right architectural calls, then ship.
          </p>
        </div>
      </section>

      <Featured />
      <Works />

      <HeyBio />
      <Credentials />

      <FooterCTA />
      <Footer />
    </>
  );
}

export default App;
