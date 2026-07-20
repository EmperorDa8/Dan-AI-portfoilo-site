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

function App() {
  return (
    <>
      <div className="grain-overlay" aria-hidden />
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
