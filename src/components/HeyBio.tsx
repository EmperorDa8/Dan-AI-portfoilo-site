export function HeyBio() {
    return (
        <section className="hey-section" id="bio">
            <div className="hey-header">
                <h2 className="hey-title">Hey!</h2>
                <svg className="vibe-svg" viewBox="0 0 100 100" fill="none" stroke="var(--primary-accent)" strokeWidth="3">
                    <circle cx="50" cy="50" r="40" strokeDasharray="10 15" />
                    <circle cx="50" cy="50" r="25" stroke="var(--secondary-accent)" />
                    <circle cx="50" cy="50" r="5" fill="var(--text-color)" />
                    <path d="M50 10 L50 25 M50 75 L50 90 M10 50 L25 50 M75 50 L90 50" />
                </svg>
            </div>

            <div className="hey-grid">
                <div className="hey-col-1" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p>Vibe-coded by <em>Dan Usman</em>, an AI Prompt Engineer &amp; Vibe Coder based remotely, engineering production-ready assets.</p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', borderBottom: '2px solid #111', paddingBottom: '0.5rem', width: '100%' }}>CORE_COMPETENCIES</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Advanced Prompting', 'Sora / VEO 3', 'Midjourney', 'Voice AI Agents', 'Cursor IDE', 'n8n Workflow', 'Google Antigravity'].map((skill, i) => (
                            <span key={i} style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'var(--b-border)', boxShadow: '2px 2px 0px #111', borderRadius: '0', fontFamily: 'var(--font-mono)', fontWeight: 'bold', background: '#fff' }}>{skill}</span>
                        ))}
                    </div>
                </div>

                <div className="hey-col-2">
                    <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" alt="Cyber Vibe Environment" />
                    <svg className="overlay-icon" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" />
                        <line x1="50" y1="50" x2="50" y2="90" />
                        <line x1="50" y1="50" x2="10" y2="30" />
                        <line x1="50" y1="50" x2="90" y2="30" />
                    </svg>
                </div>

                <div className="hey-col-3">
                    <div className="hey-num">(AI)</div>
                    <p>I am an innovative AI Prompt Engineer specializing in multi-modal generative AI, advanced constraint optimization, and full-stack integrations. I craft production-ready prompts for text-to-video (Sora, VEO 3), text-to-image (Midjourney, DALL-E 3), and voice systems.</p>
                    <p>My recent work focuses on <strong>AZer-t (French Video Game Studio)</strong>, where I engineer production-quality game assets (characters, environments, weapons) using advanced multi-modal prompts. I also build interactive voice AI agents for in-game NPCs, integrating conversational AI into gameplay mechanics.</p>
                    <div style={{ borderLeft: '2px solid var(--secondary-accent)', paddingLeft: '1rem', marginTop: '2rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        "Focusing on highly-detailed visuals and vibe-coding full-stack applications with modern IDEs and automation protocols."
                    </div>
                </div>
            </div>
        </section>
    );
}
