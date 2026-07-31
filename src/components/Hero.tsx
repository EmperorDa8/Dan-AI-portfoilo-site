import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { playClick, playTick } from '../sound';

const HERO_BW = '/hero_portrait_bw.webp';
const HERO_COLOR = '/hero_portrait_color.webp';
const FALLBACK = '/profile-pic.webp';

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * One claim, one proof, one action.
 *
 * The previous hero carried ~15 competing objects and stated the job title
 * twice — once at 11px and once as three 109px words scattered across a
 * diagonal, so the only legible version was the smallest one. Nothing
 * quantitative appeared until screen 9.5.
 */
export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 55, damping: 16 });
    const sy = useSpring(my, { stiffness: 55, damping: 16 });
    const rotateY = useTransform(sx, v => v * 6);
    const rotateX = useTransform(sy, v => v * -6);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mx.set(e.clientX / window.innerWidth - 0.5);
            my.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [mx, my]);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
    const portraitY = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

    const [dreaming, setDreaming] = useState(false);

    return (
        <section className="hero-section" ref={sectionRef}>
            <div className="hero-grid">
                <div className="hero-copy">
                    <motion.p {...rise(0.05)} className="mono-label hero-eyebrow">
                        AI Product Engineer · Lagos · Remote worldwide
                    </motion.p>

                    <motion.h1 {...rise(0.14)} className="hero-h1">
                        I turn vague business problems into <em>deployed software.</em>
                    </motion.h1>

                    <motion.p {...rise(0.24)} className="hero-sub">
                        End-to-end ownership — I scope it, direct Claude Code as the engineering team, own the database,
                        framework and deployment calls, then validate and correct until it runs in production.
                    </motion.p>

                    <motion.div {...rise(0.34)} className="hero-proof">
                        <span>
                            <strong>1 week</strong> UK e-commerce MVP
                        </span>
                        <span className="hero-proof-sep" aria-hidden />
                        <span>
                            <strong>9 days</strong> LLM risk-scoring MVP
                        </span>
                    </motion.div>

                    <motion.div {...rise(0.44)} className="hero-actions">
                        <a href="#work" className="btn btn-primary" onMouseEnter={playTick} onClick={playClick}>
                            See the work <span aria-hidden>↓</span>
                        </a>
                        <a
                            href="/Dan_Usman_CV_AI_Builder_2026.pdf"
                            download
                            className="btn btn-ghost"
                            onMouseEnter={playTick}
                            onClick={playClick}
                        >
                            Download CV
                        </a>
                    </motion.div>

                    <motion.p {...rise(0.54)} className="hero-avail mono-label">
                        <span className="pulse-dot" /> Available from Feb 2026 · open to relocation
                    </motion.p>
                </div>

                <motion.div
                    className="hero-portrait"
                    style={{ y: portraitY, rotateX, rotateY, transformPerspective: 1200 }}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => {
                        setDreaming(true);
                        playTick();
                    }}
                    onMouseLeave={() => setDreaming(false)}
                >
                    <motion.img
                        src={HERO_BW}
                        alt="Dan Usman"
                        width={1200}
                        height={1600}
                        style={{ scale: imgScale }}
                        onError={e => {
                            (e.target as HTMLImageElement).src = FALLBACK;
                        }}
                    />
                    <motion.img
                        src={HERO_COLOR}
                        alt=""
                        aria-hidden
                        width={1200}
                        height={1600}
                        className="hero-portrait-color"
                        style={{ scale: imgScale, opacity: dreaming ? 1 : 0 }}
                        onError={e => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
