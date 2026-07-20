import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Works } from './components/Works';
import { Featured } from './components/Featured';
import { HeyBio } from './components/HeyBio';
import { FooterCTA } from './components/FooterCTA';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Navigation />
      <Hero />
      <Marquee />
      <Works />
      <Featured />
      <HeyBio />
      <FooterCTA />
      <Footer />
    </>
  );
}

export default App;
