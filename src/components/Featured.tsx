export function Featured() {
    return (
        <section className="featured-section">
            <h2 className="feat-title">Featured<br /><em>Generations</em><span className="feat-reg">®</span></h2>

            <div className="projects-grid">
                <a href="https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu" target="_blank" className="proj-card" style={{ textDecoration: 'none' }}>
                    <div className="proj-header">
                        <h3 className="proj-name">/AZer-t Studio</h3>
                        <p className="proj-desc">Unreal Engine 5 Aesthetics &amp; Production Quality Assets</p>
                    </div>
                    <div className="proj-img-box">
                        <img src="/game_character.png" alt="3D Game Character" />
                    </div>
                </a>
                <a href="https://vermillion-travesseiro-d1b2de.netlify.app/" target="_blank" className="proj-card" style={{ textDecoration: 'none' }}>
                    <div className="proj-header">
                        <h3 className="proj-name">/AI Web App</h3>
                        <p className="proj-desc">Live Vibe-Coded Web Environment with Voice Interactions</p>
                    </div>
                    <div className="proj-img-box">
                        <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=1000&q=80" alt="Web Agent UI" style={{ border: 'var(--b-border)', transform: 'scale(0.85)' }} />
                    </div>
                </a>
            </div>
        </section>
    );
}
