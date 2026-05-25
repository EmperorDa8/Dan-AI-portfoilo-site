import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Works } from './components/Works';
import { CaseStudy } from './components/CaseStudy';
import { Featured } from './components/Featured';
import { VentureScoutCase } from './components/VentureScoutCase';
import { Experience } from './components/Experience';
import { Expertise } from './components/Expertise';
import { HeyBio } from './components/HeyBio';
import { FooterCTA } from './components/FooterCTA';
import { Footer } from './components/Footer';

function App() {
  useEffect(() => {
    const workRows = document.querySelectorAll('.work-row');
    const handlers: Array<[Element, () => void]> = [];

    workRows.forEach(row => {
      const handler = () => {
        workRows.forEach(r => r.classList.remove('active'));
        row.classList.add('active');
      };
      row.addEventListener('mouseenter', handler);
      handlers.push([row, handler]);
    });

    return () => {
      handlers.forEach(([row, handler]) => row.removeEventListener('mouseenter', handler));
    };
  }, []);

  return (
    <>
      <Navigation />
      <Hero />
      <Marquee />
      <Works />
      <CaseStudy />
      <VentureScoutCase />
      <Featured />
      <Experience />
      <Expertise />
      <HeyBio />
      <FooterCTA />
      <Footer />
    </>
  );
}

export default App;
