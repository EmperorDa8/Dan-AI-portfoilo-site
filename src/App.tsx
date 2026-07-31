import { lazy, Suspense, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Works } from './components/Works';
import { PrototypeCarousel } from './components/PrototypeCarousel';
import { VentureScoutCase } from './components/VentureScoutCase';
import { FreelanceCase } from './components/FreelanceCase';
import { Featured } from './components/Featured';
import { HeyBio } from './components/HeyBio';
import { ToolWall } from './components/ToolWall';
import { Credentials } from './components/Credentials';
import { FooterCTA } from './components/FooterCTA';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { getLenis, useSmoothScroll } from './lib/scroll';
import { setScrollIntensity } from './sound';

/* Three.js is heavy — keep it out of the initial bundle. */
const Scene3D = lazy(() => import('./components/Scene3D').then(m => ({ default: m.Scene3D })));

function App() {
  useSmoothScroll();

  // Feed scroll velocity into the ambient sound bed.
  useEffect(() => {
    const id = window.setInterval(() => {
      const l = getLenis();
      if (l) setScrollIntensity((l as unknown as { velocity: number }).velocity ?? 0);
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
      <div className="grain-overlay" aria-hidden />
      <ScrollProgress />
      <Navigation />
      <Hero />
      <Marquee />
      <Works />
      <PrototypeCarousel />
      <VentureScoutCase />
      <FreelanceCase />
      <Featured />
      <HeyBio />
      <ToolWall />
      <Credentials />
      <FooterCTA />
      <Footer />
    </>
  );
}

export default App;
