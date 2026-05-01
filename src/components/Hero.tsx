import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

export function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-text-wrap">
                <motion.h1
                    {...fadeUp(0.1)}
                    className="hero-title"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "8vw", letterSpacing: "-0.08em" }}
                >
                    <span style={{ color: "var(--primary-accent)" }}>&gt;_</span> AI Product
                </motion.h1>
                <motion.span {...fadeUp(0.2)} className="hero-joy" style={{ textAlign: "left", paddingLeft: "12vw", marginTop: "2vw" }}>
                    Engineer.
                </motion.span>
                <motion.p
                    {...fadeUp(0.3)}
                    style={{ textAlign: "left", paddingLeft: "12vw", marginTop: "1rem", fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--text-color)", opacity: 0.6, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                    AI Prompt Engineer / Vibe-Coder
                </motion.p>

                <svg className="ai-sparkle" viewBox="0 0 100 100" fill="none" stroke="var(--text-color)" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z" fill="var(--bg-color)" />
                </svg>
            </div>

            <motion.div {...fadeUp(0.45)} className="hero-bottom">
                <div className="hero-year" style={{ border: "var(--b-border)", padding: "0.5rem 1rem", background: "var(--primary-accent)", color: "#fff", boxShadow: "4px 4px 0px #111" }}>©2026_SYS</div>
                <img
                    src="/profile-pic.png.png"
                    alt="Dan Usman"
                    className="hero-avatar"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300'; }}
                />
                <div className="hero-since">
                    <span className="animate-pulse" style={{ display: "inline-block", width: "12px", height: "12px", background: "var(--secondary-accent)", borderRadius: "50%", marginRight: "8px" }}></span>
                    VIBE_CODER_MODE: ACTIVE
                </div>
            </motion.div>
        </section>
    );
}
