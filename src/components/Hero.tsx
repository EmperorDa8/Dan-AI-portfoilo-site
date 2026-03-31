export function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-text-wrap">
                <h1 className="hero-title" style={{ fontFamily: "var(--font-mono)", fontSize: "8vw", letterSpacing: "-0.08em" }}>
                    <span style={{ color: "var(--primary-accent)" }}>&gt;_</span> AI Product
                </h1>
                <span className="hero-joy" style={{ textAlign: "left", paddingLeft: "12vw", marginTop: "2vw" }}>Engineer.</span>
                <p style={{ textAlign: "left", paddingLeft: "12vw", marginTop: "1rem", fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: "var(--text-color)", opacity: 0.8 }}>
                    AI Prompt Engineer / Vibe-Coder
                </p>

                <svg className="ai-sparkle" viewBox="0 0 100 100" fill="none" stroke="var(--text-color)" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z" fill="var(--bg-color)" />
                </svg>
            </div>

            <div className="hero-bottom">
                <div className="hero-year" style={{ border: "var(--b-border)", padding: "0.5rem 1rem", background: "var(--primary-accent)", color: "#fff", boxShadow: "4px 4px 0px #111" }}>©2026_SYS</div>
                <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300" alt="Avatar Abstract" className="hero-avatar" />
                <div className="hero-since">
                    <span className="animate-pulse" style={{ display: "inline-block", width: "12px", height: "12px", background: "var(--secondary-accent)", borderRadius: "50%", marginRight: "8px" }}></span>
                    VIBE_CODER_MODE: ACTIVE
                </div>
            </div>
        </section>
    );
}
