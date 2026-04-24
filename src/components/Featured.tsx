export function Featured() {
    return (
        <section className="featured-section">
            <h2 className="feat-title">Featured<br /><em>Generations/Prototypes</em><span className="feat-reg">®</span></h2>

            <div className="projects-grid">
                <div className="proj-card">
                    <div className="proj-header">
                        <a href="https://card-clutter-clear.lovable.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 className="proj-name" style={{ marginBottom: 0 }}>/Card Clutter Clear</h3>
                        </a>
                        <p className="proj-desc">Live Prototype • Built & Shipped in &lt; 2 hrs by AI Product Engineer</p>
                    </div>
                    <a href="https://card-clutter-clear.lovable.app/" target="_blank" rel="noopener noreferrer" className="proj-img-box" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                        <img src="https://image.thum.io/get/width/1200/crop/800/https://card-clutter-clear.lovable.app/" alt="Card Clutter Clear Live App Thumbnail" style={{ border: 'var(--b-border)', minHeight: '100%', objectFit: 'cover' }} />
                    </a>
                </div>

                <div className="proj-card">
                    <div className="proj-header">
                        <div className="flex justify-between items-start mb-[0.8rem]">
                            <a href="https://you-rev.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h3 className="proj-name" style={{ marginBottom: 0 }}>/YouRev</h3>
                            </a>
                            <a href="https://github.com/EmperorDa8/YouRev" target="_blank" rel="noopener noreferrer" className="hover:text-primary-accent transition-colors" style={{ color: 'var(--text-color)', marginTop: '0.5rem' }} title="View on GitHub">
                                <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                                </svg>
                            </a>
                        </div>
                        <p className="proj-desc">YouTube Competitor Analyzer - Live Channel Intelligence</p>
                    </div>
                    <a href="https://you-rev.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-img-box" style={{ textDecoration: 'none' }}>
                        <img src="/yourev_screenshot.png" alt="YouRev UI" style={{ border: 'var(--b-border)' }} />
                    </a>
                </div>

                <div className="proj-card">
                    <div className="proj-header">
                        <a href="https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 className="proj-name">/AZer-t Studio</h3>
                        </a>
                        <p className="proj-desc">Unreal Engine 5 Aesthetics &amp; Production Quality Assets</p>
                    </div>
                    <a href="https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu" target="_blank" rel="noopener noreferrer" className="proj-img-box" style={{ textDecoration: 'none' }}>
                        <img src="/game_character.png" alt="3D Game Character" />
                    </a>
                </div>

                <div className="proj-card">
                    <div className="proj-header">
                        <a href="https://vermillion-travesseiro-d1b2de.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 className="proj-name">/AI Web App</h3>
                        </a>
                        <p className="proj-desc">Live Vibe-Coded Web Environment with Voice Interactions</p>
                    </div>
                    <a href="https://vermillion-travesseiro-d1b2de.netlify.app/" target="_blank" rel="noopener noreferrer" className="proj-img-box" style={{ textDecoration: 'none' }}>
                        <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=1000&q=80" alt="Web Agent UI" style={{ border: 'var(--b-border)', transform: 'scale(0.85)' }} />
                    </a>
                </div>
                <div className="proj-card">
                    <div className="proj-header">
                        <a href="https://drive.google.com/drive/folders/1GbHqFB70Bixpq5on7Efg1PGLLPEA0Af1?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 className="proj-name">/Ad Scale Gen</h3>
                        </a>
                        <p className="proj-desc">AI Ad Image Generation Pipeline</p>
                    </div>
                    <a href="https://drive.google.com/drive/folders/1GbHqFB70Bixpq5on7Efg1PGLLPEA0Af1?usp=sharing" target="_blank" rel="noopener noreferrer" className="proj-img-box" style={{ textDecoration: 'none' }}>
                        <img src="/ad_generator_thumbnail.png" alt="Ad Generator UI" />
                    </a>
                </div>
            </div>
        </section>
    );
}
