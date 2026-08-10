import { useRef, useState } from 'react';
import { gsap, prefersReducedMotion, revealElement, useGsapScope } from '../lib/scroll';
import { playTick } from '../sound';

const PROJECTS = [
    {
        name: '/Tasker',
        desc: 'Chrome extension — local-first activity tracking with Google Drive sync. Built and shipped to the Web Store in one day.',
        href: 'https://chromewebstore.google.com/detail/tasker-activity-tracker-g/nfdjclnanladapnhofbmnhclkhlndeak',
        img: '/tasker_thumbnail.webp',
        alt: 'Tasker Chrome extension popup showing focus time and logged accomplishments',
        github: 'https://github.com/EmperorDa8/tasker-extension',
    },
    {
        name: '/PricePal',
        desc: 'Live Prototype - AI Grocery Basket & Price Comparison (UK & Nigeria)',
        href: 'https://savvy-shelf-scout.lovable.app/',
        img: '/pricepal_thumbnail.webp',
        alt: 'PricePal AI Grocery Price Comparison Thumbnail',
    },
    {
        name: '/VentureScout',
        desc: 'Live Prototype - AI Scout & Asset Manager for Local Investments',
        href: 'https://venuturescout.lovable.app/',
        img: '/venturescout_thumbnail.webp',
        alt: 'VentureScout Live App Thumbnail',
    },
    {
        name: '/Galaxyflow',
        desc: 'Live Prototype - Audio mood to Album Art',
        href: 'https://galaxyflow.lovable.app/',
        img: '/galaxyflow_thumbnail.webp',
        alt: 'Galaxyflow Live App Thumbnail',
    },
    {
        name: '/subkit',
        desc: 'Live Prototype',
        href: 'https://card-clutter-clear.lovable.app/',
        img: '/subkit.webp',
        alt: 'Subkit Live App Thumbnail',
    },
    {
        name: '/YouRev',
        desc: 'YouTube Competitor Analyzer - Live Channel Intelligence',
        href: 'https://you-rev.vercel.app/',
        img: '/yourev_screenshot.webp',
        alt: 'YouRev UI',
        github: 'https://github.com/EmperorDa8/YouRev',
    },
    {
        name: '/AZer-t Studio',
        desc: 'Unreal Engine 5 Aesthetics & Production Quality Assets',
        href: 'https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu',
        img: '/game_character.webp',
        alt: '3D Game Character',
    },
    {
        name: '/AI Web App',
        desc: 'Live web environment with voice interactions',
        href: 'https://vermillion-travesseiro-d1b2de.netlify.app/',
        img: '/ai_web_app_ui.webp',
        alt: 'Web Agent UI',
    },
    {
        name: '/Ad Scale Gen',
        desc: 'AI Ad Image Generation Pipeline',
        href: 'https://drive.google.com/drive/folders/1GbHqFB70Bixpq5on7Efg1PGLLPEA0Af1?usp=sharing',
        img: '/ad_generator_thumbnail.webp',
        alt: 'Ad Generator UI',
    },
];

export function Featured() {
    const [active, setActive] = useState<number | null>(null);

    const scopeRef = useGsapScope<HTMLElement>(({ scope }) => {
        const cards = gsap.utils.toArray<HTMLElement>('.proj-card', scope);
        if (prefersReducedMotion()) {
            gsap.set(cards, { opacity: 1, y: 0 });
            return;
        }

        cards.forEach((card, i) => {
            // The reveal owns .proj-card's opacity/y. The 3D transforms live on
            // an inner wrapper so the two never fight over `transform` — that
            // collision is what stranded the Works rows invisible earlier.
            revealElement(card, { y: 70 });

            const plane = card.querySelector<HTMLElement>('.proj-card-3d');
            if (plane) {
                // Each card swings through a plane as it crosses the viewport:
                // tipped back on entry, flat at centre, tipping away on exit.
                // Odd/even columns lean from opposite sides so the grid weaves.
                const lean = i % 2 === 0 ? 1 : -1;
                gsap
                    .timeline({
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 0.6,
                        },
                    })
                    .fromTo(
                        plane,
                        { rotateX: 13, rotateY: 9 * lean, z: -150 },
                        { rotateX: 0, rotateY: 0, z: 0, duration: 0.5, ease: 'power2.out' }
                    )
                    .to(plane, { rotateX: -7, rotateY: -5 * lean, z: -80, duration: 0.5, ease: 'power2.in' });
            }

            // Slow inner drift so the grid feels alive as it passes.
            const img = card.querySelector('img');
            if (img) {
                gsap.fromTo(
                    img,
                    { yPercent: -5 },
                    {
                        yPercent: 5,
                        ease: 'none',
                        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
                    }
                );
            }
        });
    }, []);

    /* Pointer tilt + travelling sheen. Writes CSS variables only, batched into
       a frame, so hovering never triggers layout. */
    const frame = useRef(0);
    const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
        if (prefersReducedMotion()) return;
        const el = e.currentTarget;
        const x = e.clientX;
        const y = e.clientY;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            const px = (x - r.left) / r.width;
            const py = (y - r.top) / r.height;
            el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
            el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
            el.style.setProperty('--ry', `${((px - 0.5) * 13).toFixed(2)}deg`);
            el.style.setProperty('--rx', `${((0.5 - py) * 9).toFixed(2)}deg`);
        });
    };

    const untilt = (e: React.PointerEvent<HTMLDivElement>) => {
        cancelAnimationFrame(frame.current);
        const el = e.currentTarget;
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        setActive(null);
    };

    return (
        <section className="featured-section" ref={scopeRef}>
            <div className="section-head">
                <h2 className="section-title">
                    Featured <em>Generations&#8203;/Prototypes</em>
                </h2>
                <span className="mono-label">/ live &amp; shipped</span>
            </div>

            <div className={`projects-grid${active !== null ? ' has-active' : ''}`}>
                {PROJECTS.map((p, i) => (
                    <div
                        className={`proj-card${active === i ? ' is-active' : ''}`}
                        key={p.name}
                        onMouseEnter={() => {
                            setActive(i);
                            playTick();
                        }}
                        onPointerMove={tilt}
                        onPointerLeave={untilt}
                    >
                        <div className="proj-card-3d">
                          <div className="proj-card-face">
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
                                <img src={p.img} alt={p.alt} loading="lazy" decoding="async" width={640} height={440} />
                                <span className="proj-sheen" aria-hidden />
                                <span className="proj-view mono-label">View ↗</span>
                                <span className="proj-index mono-label" aria-hidden>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                            </a>
                          </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
