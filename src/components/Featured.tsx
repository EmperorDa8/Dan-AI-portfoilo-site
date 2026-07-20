import { motion } from 'framer-motion';
import { playTick } from '../sound';

const cardReveal = (i: number) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, delay: (i % 2) * 0.12, ease: [0.22, 1, 0.36, 1] as const },
});

const PROJECTS = [
    {
        name: '/VentureScout',
        desc: 'Live Prototype - AI Scout & Asset Manager for Local Investments',
        href: 'https://venuturescout.lovable.app/',
        img: '/venturescout_thumbnail.png',
        alt: 'VentureScout Live App Thumbnail',
    },
    {
        name: '/Galaxyflow',
        desc: 'Live Prototype - Audio mood to Album Art',
        href: 'https://galaxyflow.lovable.app/',
        img: '/galaxyflow_thumbnail.png',
        alt: 'Galaxyflow Live App Thumbnail',
    },
    {
        name: '/subkit',
        desc: 'Live Prototype',
        href: 'https://card-clutter-clear.lovable.app/',
        img: '/subkit.png',
        alt: 'Subkit Live App Thumbnail',
    },
    {
        name: '/YouRev',
        desc: 'YouTube Competitor Analyzer - Live Channel Intelligence',
        href: 'https://you-rev.vercel.app/',
        img: '/yourev_screenshot.png',
        alt: 'YouRev UI',
        github: 'https://github.com/EmperorDa8/YouRev',
    },
    {
        name: '/AZer-t Studio',
        desc: 'Unreal Engine 5 Aesthetics & Production Quality Assets',
        href: 'https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu',
        img: '/game_character.png',
        alt: '3D Game Character',
    },
    {
        name: '/AI Web App',
        desc: 'Live Vibe-Coded Web Environment with Voice Interactions',
        href: 'https://vermillion-travesseiro-d1b2de.netlify.app/',
        img: '/ai_web_app_ui.png',
        alt: 'Web Agent UI',
    },
    {
        name: '/Ad Scale Gen',
        desc: 'AI Ad Image Generation Pipeline',
        href: 'https://drive.google.com/drive/folders/1GbHqFB70Bixpq5on7Efg1PGLLPEA0Af1?usp=sharing',
        img: '/ad_generator_thumbnail.png',
        alt: 'Ad Generator UI',
    },
];

export function Featured() {
    return (
        <section className="featured-section">
            <div className="section-head">
                <h2 className="section-title">
                    Featured <em>Generations&#8203;/Prototypes</em>
                    <sup style={{ fontSize: '0.35em', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>®</sup>
                </h2>
                <span className="mono-label">/ live &amp; shipped</span>
            </div>

            <div className="projects-grid">
                {PROJECTS.map((p, i) => (
                    <motion.div {...cardReveal(i)} className="proj-card" key={p.name} onMouseEnter={playTick}>
                        <div className="proj-header">
                            <div>
                                <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 className="proj-name">{p.name}</h3>
                                </a>
                                <p className="proj-desc">{p.desc}</p>
                            </div>
                            {p.github && (
                                <a href={p.github} target="_blank" rel="noopener noreferrer" className="proj-gh" title="View on GitHub">
                                    <svg height="26" width="26" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                        <a href={p.href} target="_blank" rel="noopener noreferrer" className="proj-img-box" style={{ textDecoration: 'none' }}>
                            <img src={p.img} alt={p.alt} />
                        </a>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
