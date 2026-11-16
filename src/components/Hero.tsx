import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { playClick, playTick } from '../sound';
import { prefersReducedMotion } from '../lib/scroll';
import { CV_URL } from '../data/profile';

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
    return (
        <section className="hero-section" id="top">
            <HeroBackdrop />

            <div className="hero-grid">
                <div className="hero-copy">
                    {/* Identity anchor: a face early, at a scale that supports the
                        claim rather than competing with it. */}
                    <motion.div {...rise(0.05)} className="hero-id">
                        <img
                            src="/profile-pic.webp"
                            alt="Dan Usman"
                            width={52}
                            height={52}
                            className="hero-id-avatar"
                        />
                        <span className="hero-id-text">
                            <span className="hero-id-name">Dan Usman</span>
                            <span className="hero-id-role mono-label">
                                AI Product Engineer &amp; AI Creative Specialist
                            </span>
                        </span>
                    </motion.div>

                    {/* One claim, three lines, big. The engineer half and the
                        creative half in a single sentence, so the three titles
                        read as one person rather than three portfolios. */}
                    <motion.h1 {...rise(0.14)} className="hero-h1 hero-claim">
                        <span className="hero-claim-line">I build it,</span>
                        <span className="hero-claim-line is-indent">then I make</span>
                        <span className="hero-claim-line">
                            it <em>move.</em>
                        </span>
                    </motion.h1>

                    <motion.p {...rise(0.24)} className="hero-sub">
                        AI products shipped end to end, and the video, motion and music that sell them. Self-taught, based
                        in Lagos, working remote worldwide.
                    </motion.p>

                    <motion.div {...rise(0.34)} className="hero-recog" aria-label="Shipped and trusted">
                        <span className="hero-recog-label">Shipped &amp; trusted</span>
                        <ul>
                            <li>
                                <b>Product Hunt</b> Xamio
                            </li>
                            <li>
                                <b>Chrome Web Store</b> Veridic · Tasker
                            </li>
                            <li>
                                <b>Client</b> Ziafam
                            </li>
                            <li>
                                <b>Contract</b> AZER-T, France
                            </li>
                            <li>
                                <b>Certified</b> Google · CodePath × Anthropic
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div {...rise(0.46)} className="hero-actions">
                        <a href="#work" className="btn btn-primary" onMouseEnter={playTick} onClick={playClick}>
                            See the work <span aria-hidden>↓</span>
                        </a>
                        <a
                            href={CV_URL}
                            download
                            className="btn btn-ghost"
                            onMouseEnter={playTick}
                            onClick={playClick}
                        >
                            Download CV
                        </a>
                    </motion.div>

                    <motion.p {...rise(0.56)} className="hero-avail mono-label">
                        <span className="pulse-dot" /> Open to work · fully remote, hybrid, onsite or relocation
                    </motion.p>
                </div>

            </div>
        </section>
    );
}

/**
 * Hero backdrop: the period-craft-at-a-laptop loop, anchored right at close to
 * native scale so it stays sharp (the source is 720x1280 — stretching it across
 * a 1440px hero would visibly soften it). A cream scrim feathers left-to-right
 * so the copy keeps its contrast while the footage stays plainly visible.
 */
export function HeroBackdrop() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [ready, setReady] = useState(false);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 45, damping: 18 });
    const sy = useSpring(my, { stiffness: 45, damping: 18 });
    const driftX = useTransform(sx, v => v * -18);
    const driftY = useTransform(sy, v => v * -12);

    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end start'] });
    const scrollY = useTransform(scrollYProgress, [0, 1], [0, 90]);
    const driftAndScrollY = useTransform([driftY, scrollY], ([a, b]: number[]) => a + b);
    const scrimFade = useTransform(scrollYProgress, [0, 0.7], [1, 0.55]);

    useEffect(() => {
        if (prefersReducedMotion()) return;
        const onMove = (e: MouseEvent) => {
            mx.set(e.clientX / window.innerWidth - 0.5);
            my.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [mx, my]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        if (prefersReducedMotion()) return; // poster frame only

        // The hero is in view at load by definition — start it directly rather
        // than waiting on an observer callback that may be delayed.
        void v.play().catch(() => {});

        // Then hand off to the observer so it pauses once scrolled past.
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) void v.play().catch(() => {});
                else v.pause();
            },
            { threshold: 0.05 }
        );
        io.observe(v);
        return () => io.disconnect();
    }, []);

    return (
        <div className="hero-backdrop" aria-hidden ref={wrapRef}>
            <motion.video
                style={{ x: driftX, y: driftAndScrollY }}
                ref={videoRef}
                className={`hero-backdrop-media${ready ? ' is-ready' : ''}`}
                muted
                loop
                playsInline
                preload="metadata"
                poster="/ambient/coder-poster.webp"
                onLoadedData={() => setReady(true)}
            >
                <source src="/ambient/coder.webm" type="video/webm" />
                <source src="/ambient/coder.mp4" type="video/mp4" />
            </motion.video>
            <motion.div className="hero-backdrop-scrim" style={{ opacity: scrimFade }} />
        </div>
    );
}
