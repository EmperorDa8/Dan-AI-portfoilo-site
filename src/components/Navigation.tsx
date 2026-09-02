import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isSoundEnabled, playClick, playTick, setSoundEnabled } from '../sound';

function useClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const tick = () =>
            setTime(
                new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                })
            );
        tick();
        const id = setInterval(tick, 30_000);
        return () => clearInterval(id);
    }, []);
    return time;
}

export function Navigation() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [sound, setSound] = useState(isSoundEnabled());
    const time = useClock();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* One observer over all three sections, tracking which are on screen. The
       previous version only ever set the active id and never cleared it, so the
       pill kept highlighting a section the reader had already scrolled away
       from — including while the hero, above all of them, was in view. */
    useEffect(() => {
        const sections = ['work', 'bio', 'contact'];
        const onScreen = new Set<string>();

        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const id = entry.target.id;
                    if (entry.isIntersecting) onScreen.add(id);
                    else onScreen.delete(id);
                });
                // Furthest-down wins, so the deepest visible section is named.
                const active = [...sections].reverse().find(id => onScreen.has(id)) ?? null;
                setActiveSection(active);
            },
            { threshold: 0.25 }
        );

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, []);

    const toggleSound = () => {
        const next = !sound;
        setSound(next);
        setSoundEnabled(next);
    };

    return (
        <nav className="site-nav" aria-label="Primary">
            <a href="#top" className="nav-name" onMouseEnter={playTick}>
                DAN USMAN
            </a>

            <div className="nav-pill">
                <AnimatePresence mode="wait" initial={false}>
                    {scrolled ? (
                        <motion.a
                            key="cta"
                            href="#contact"
                            className="nav-cta"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            onMouseEnter={playTick}
                            onClick={playClick}
                        >
                            <img
                                src="/profile-pic.webp"
                                alt=""
                                onError={e => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            Let&apos;s partner up
                            <span aria-hidden>→</span>
                        </motion.a>
                    ) : (
                        <motion.div
                            key="links"
                            className="nav-pill-links"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            <a
                                href="#work"
                                className={activeSection === 'work' ? 'active' : ''}
                                aria-current={activeSection === 'work' ? 'true' : undefined}
                                onMouseEnter={playTick}
                                onClick={playClick}
                            >
                                Work
                            </a>
                            <a
                                href="#bio"
                                className={activeSection === 'bio' ? 'active' : ''}
                                aria-current={activeSection === 'bio' ? 'true' : undefined}
                                onMouseEnter={playTick}
                                onClick={playClick}
                            >
                                About
                            </a>
                            <a
                                href="#contact"
                                className={activeSection === 'contact' ? 'active' : ''}
                                aria-current={activeSection === 'contact' ? 'true' : undefined}
                                onMouseEnter={playTick}
                                onClick={playClick}
                            >
                                Contact
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="nav-meta">
                <span className="nav-loc">Lagos, NG · Remote</span>
                <span className="nav-clock">{time}</span>
                <a href="/Dan_Usman_CV_AI_Builder_2026.pdf" download onMouseEnter={playTick} onClick={playClick}>
                    ↓ Resume
                </a>
                <button
                    type="button"
                    className="sound-toggle"
                    onClick={toggleSound}
                    onMouseEnter={playTick}
                    aria-label={sound ? 'Turn UI sound off' : 'Turn UI sound on'}
                >
                    {sound ? 'SND:ON' : 'SND:OFF'}
                </button>
            </div>
        </nav>
    );
}
