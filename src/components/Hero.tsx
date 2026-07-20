import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { playTick } from '../sound';

/* Drop your two portraits into public/ with these exact names —
   the hero picks them up automatically, no code change needed. */
const HERO_BW = '/hero_portrait_bw.jpg';
const HERO_COLOR = '/hero_portrait_color.jpg';
const FALLBACK = '/profile-pic.png.png';

const CAROUSEL = [
    { src: '/venturescout_thumbnail.png', label: 'VentureScout' },
    { src: '/galaxyflow_thumbnail.png', label: 'Galaxyflow' },
    { src: '/subkit.png', label: 'Subkit' },
    { src: '/yourev_screenshot.png', label: 'YouRev' },
    { src: '/game_character.png', label: 'AZer-t Studio' },
    { src: '/ad_generator_thumbnail.png', label: 'Ad Scale Gen' },
    { src: '/mcp_analytics_app.png', label: 'MCP Analytics' },
    { src: '/generative_media_studio.png', label: 'Media Engine' },
];

const wordReveal = (delay: number) => ({
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);

    // Cursor → 3D tilt on the portrait circle (template 2 depth)
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 55, damping: 16 });
    const sy = useSpring(my, { stiffness: 55, damping: 16 });
    const rotateY = useTransform(sx, v => v * 10);
    const rotateX = useTransform(sy, v => v * -10);
    const noteX = useTransform(sx, v => v * -26);
    const noteY = useTransform(sy, v => v * -26);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mx.set(e.clientX / window.innerWidth - 0.5);
            my.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [mx, my]);

    // Scroll → cinematic zoom: portrait swells, words drift apart (template 2 motion)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
    const circleY = useTransform(scrollYProgress, [0, 1], [0, 90]);
    const w1Y = useTransform(scrollYProgress, [0, 1], [0, -160]);
    const w3Y = useTransform(scrollYProgress, [0, 1], [0, 160]);
    const strapOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // B&W → color crossfade on hover ("between reality & dream")
    const [dreaming, setDreaming] = useState(false);

    // Drag constraints for the carousel
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragLimit, setDragLimit] = useState(0);
    const [dragged, setDragged] = useState(false);

    useEffect(() => {
        const measure = () => {
            const track = trackRef.current;
            if (!track) return;
            setDragLimit(Math.max(0, track.scrollWidth - window.innerWidth));
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    return (
        <section className="hero-section" ref={sectionRef}>
            <motion.div {...wordReveal(0.05)} className="hero-badges">
                <a
                    href="https://github.com/EmperorDa8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-badge"
                    aria-label="GitHub"
                    onMouseEnter={playTick}
                >
                    <svg height="22" width="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                </a>
                <div className="hero-badge avatar">
                    <img
                        src="/profile-pic.png.png"
                        alt="Dan Usman"
                        onError={e => {
                            (e.target as HTMLImageElement).src = FALLBACK;
                        }}
                    />
                </div>
                <a
                    href="https://www.linkedin.com/in/dan-usman/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-badge"
                    aria-label="LinkedIn"
                    onMouseEnter={playTick}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-3.37-4-3.11-4 0v5.6h-3v-11h3v1.77c1.4-2.59 7-2.78 7 2.48v6.75z" />
                    </svg>
                </a>
                <div className="hero-badge tag">
                    <span className="pulse-dot" />
                    OPEN TO WORK
                </div>
            </motion.div>

            <motion.p {...wordReveal(0.15)} className="mono-label hero-kicker">
                AI Product Engineer / AI Builder / Full-Stack AI Delivery
            </motion.p>

            {/* Cinematic stage — staggered words orbiting the portrait circle */}
            <div className="hero-cinema">
                <motion.div
                    className="hero-circle-wrap"
                    style={{ y: circleY, rotateX, rotateY, transformPerspective: 1200 }}
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.3, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => {
                        setDreaming(true);
                        playTick();
                    }}
                    onMouseLeave={() => setDreaming(false)}
                >
                    <div className="hero-circle">
                        <motion.img
                            src={HERO_BW}
                            alt="Dan Usman portrait"
                            style={{ scale: imgScale }}
                            onError={e => {
                                (e.target as HTMLImageElement).src = FALLBACK;
                            }}
                        />
                        <motion.img
                            src={HERO_COLOR}
                            alt=""
                            aria-hidden
                            className="hero-circle-color"
                            style={{ scale: imgScale, opacity: dreaming ? 1 : 0 }}
                            onError={e => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                </motion.div>

                <motion.span className="hero-word w1" style={{ y: w1Y }} {...wordReveal(0.5)}>
                    AI Product
                </motion.span>
                <motion.span className="hero-word w2" {...wordReveal(0.7)}>
                    Engineer
                </motion.span>
                <motion.span className="hero-word w3" style={{ y: w3Y }} {...wordReveal(0.9)}>
                    &amp; <span className="serif-it">Builder.</span>
                </motion.span>

                <motion.div style={{ x: noteX, y: noteY, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div className="hero-note n1">
                        <span className="note-glyph" aria-hidden>⌁</span> claude code as the eng team
                    </div>
                    <div className="hero-note n4">
                        <span className="note-glyph" aria-hidden>✦</span> agents &amp; generative media
                    </div>
                </motion.div>

                <motion.p className="hero-strap" style={{ opacity: strapOpacity }} {...wordReveal(1.1)}>
                    Business problem&nbsp;&nbsp;→&nbsp;&nbsp;Deployed product&nbsp;&nbsp;·&nbsp;&nbsp;End-to-end ownership
                </motion.p>

                <div className="hero-year-chip">©2026_SYS</div>
            </div>

            <div className="hero-scroll-cue">Scroll</div>

            <motion.div {...wordReveal(1.25)} className="hero-carousel">
                {!dragged && <div className="drag-me">← Drag me →</div>}
                <motion.div
                    ref={trackRef}
                    className="hero-carousel-track"
                    drag="x"
                    dragConstraints={{ left: -dragLimit, right: 0 }}
                    dragElastic={0.08}
                    onDragStart={() => setDragged(true)}
                >
                    {CAROUSEL.map(item => (
                        <div className="hero-card" key={item.label} onMouseEnter={playTick}>
                            <img src={item.src} alt={item.label} draggable={false} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
