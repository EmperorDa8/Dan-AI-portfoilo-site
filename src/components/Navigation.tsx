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
    const [activeSection, setActiveSection] = useState<string>('work');
    const [scrolled, setScrolled] = useState(false);
    const [sound, setSound] = useState(isSoundEnabled());
    const time = useClock();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const sections = ['work', 'bio', 'contact'];
        const observers: IntersectionObserver[] = [];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold: 0.25 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach(o => o.disconnect());
    }, []);

    const toggleSound = () => {
        const next = !sound;
        setSound(next);
        setSoundEnabled(next);
    };

    return (
        <nav className="site-nav">
            <a href="/" className="nav-name" onMouseEnter={playTick}>
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
                                src="/profile-pic.png"
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
                            <a href="#work" className={activeSection === 'work' ? 'active' : ''} onMouseEnter={playTick} onClick={playClick}>
                                Work
                            </a>
                            <a href="#bio" className={activeSection === 'bio' ? 'active' : ''} onMouseEnter={playTick} onClick={playClick}>
                                About
                            </a>
                            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onMouseEnter={playTick} onClick={playClick}>
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
