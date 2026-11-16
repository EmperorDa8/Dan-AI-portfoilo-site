import { useEffect, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Reel } from './components/Reel';
import { Desk } from './components/Desk';
import { Dock } from './components/Dock';
import { Ascii } from './components/Ascii';
import { ProofStrip } from './components/ProofStrip';
import { TechStack } from './components/TechStack';
import { VeridicCase } from './components/VeridicCase';
import { PromptSystemsCase } from './components/PromptSystemsCase';
import { XamioCase } from './components/XamioCase';
import { Products } from './components/Products';
import { SystemsLab } from './components/SystemsLab';
import { Studio } from './components/Studio';
import { Music } from './components/Music';
import { CommandPalette } from './components/CommandPalette';
import { HeyBio } from './components/HeyBio';
import { Credentials } from './components/Credentials';
import { FooterCTA } from './components/FooterCTA';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { getLenis, gsap, installRevealSafetyNet, prefersReducedMotion, useSmoothScroll } from './lib/scroll';
import { splitWords } from './lib/scrollFx';
import { registerVelocitySource } from './sound';


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
  '.section-title .word',
  // Switched from `animate` to `whileInView` so tiles resolve as they arrive;
  // that made 41 tiles — most of the creative evidence — observer-dependent.
  '.studio-tile',
];

function App() {
  useSmoothScroll();

  /* Section titles rise word by word out of a mask. Split is done over text
     nodes only, so the <em> that carries the serif accent survives. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('.section-title').forEach(title => {
        splitWords(title);
        const words = title.querySelectorAll('.word');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { yPercent: 118, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            stagger: 0.04,
            scrollTrigger: { trigger: title, start: 'top 88%', once: true },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  /* The nav sits over whatever is behind it, so it has to know when the dark
     chapter is under it. Watch only the strip of viewport the nav occupies. */
  const screeningRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = screeningRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => document.documentElement.toggleAttribute('data-chapter-dark', e.isIntersecting),
      { rootMargin: '0px 0px -92% 0px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      document.documentElement.removeAttribute('data-chapter-dark');
    };
  }, []);

  useEffect(() => {
    installRevealSafetyNet(WHILE_IN_VIEW);
    // Polled only while sound is enabled, not for the life of the page.
    registerVelocitySource(() => (getLenis() as unknown as { velocity?: number })?.velocity ?? 0);
  }, []);

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <ScrollProgress />
      <Navigation />

      {/* Claim → proof → evidence → person → contact */}
      <Hero />
      <Reel />

      {/* A single sentence on its own, between the reel and the numbers: the
          argument for the whole page. */}
      <section className="statement" aria-label="Positioning">
        <p className="statement-line">
          Most people build the product <em>or</em> make the ad.
        </p>
        <p className="statement-line is-answer">
          I do both, and <em>ship them together.</em>
        </p>
      </section>

      <ProofStrip />

      {/* The argument for holding three titles, made once, before the evidence. */}
      <Desk />

      {/* Evidence first: everything here is live, launched or in a public repo. */}
      <Products />
      <XamioCase />
      <VeridicCase />
      <PromptSystemsCase />
      <SystemsLab />

      <section className="band">
        <Ascii />
        <div className="band-inner">
          <h2 className="band-title">
            Unfamiliar domain on Monday, <em>deployed by Friday.</em>
          </h2>
          <p className="band-note">
            Trade finance, contract review, legal fine print, exam scheduling, game asset pipelines — the pattern is the
            same: learn the domain fast enough to make the right architectural calls, then ship.
          </p>
        </div>
      </section>

      {/* Lights down: the creative half is shown on charcoal, where video
          reads properly. The wrapper only redefines the colour tokens, so the
          sections inside adapt without knowing they are on dark. */}
      <div className="screening" ref={screeningRef}>
        <Studio />
        <Music />
      </div>
      <TechStack />

      <HeyBio />
      <Credentials />

      <FooterCTA />
      <Footer />
      <CommandPalette />
      <Dock />
    </>
  );
}

export default App;
