import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Works } from './components/Works';
import { CaseStudy } from './components/CaseStudy';
import { Featured } from './components/Featured';
import { HeyBio } from './components/HeyBio';
import { FooterCTA } from './components/FooterCTA';

function App() {
  // Add active class toggling for the Works list
  useEffect(() => {
    const workRows = document.querySelectorAll('.work-row');
    workRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        workRows.forEach(r => r.classList.remove('active'));
        row.classList.add('active');
      });
    });
  }, []);

  return (
    <>
      <Navigation />
      <Hero />
      <Works />
      <CaseStudy />
      <Featured />
      <HeyBio />
      <FooterCTA />
    </>
  );
}

export default App;
