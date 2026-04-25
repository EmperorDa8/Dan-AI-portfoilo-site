export function Works() {
    return (
        <section className="work-section" id="work">
            <h2 className="work-title">Repositories &amp; Worlds</h2>
            <div className="work-list">
                <a href="https://github.com/EmperorDa8/generativeAI" target="_blank" className="work-row active">
                    <div className="w-col-name">Gen-AI Repo</div>
                    <div className="w-col-tags">Prompt Engineering / Text, Image &amp; Video Generative Models</div>
                    <div className="w-col-type">GitHub</div>
                    <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80" alt="Generative AI" className="preview-flyout" />
                </a>

                <a href="https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu" target="_blank" className="work-row">
                    <div className="w-col-name">Media Engine</div>
                    <div className="w-col-tags">Sora / VEO 3 / Runway / Highly-detailed Midjourney Visuals</div>
                    <div className="w-col-type">Portfolio</div>
                    <img src="https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80" alt="Generative Media" className="preview-flyout" />
                </a>

                <div className="work-row" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '4rem 2rem' }}>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div className="w-col-name">Marble AI Worlds</div>
                        <div className="w-col-tags" style={{ flex: 1 }}>Interactive Generative 3D Environments</div>
                        <div className="w-col-type">WorldLabs</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
                        {[
                            "0007ca41-6e04-47a7-b3cf-f4c2c9f372d5",
                            "c79cfa02-265e-4aad-8c2e-bfae9fd8a22e",
                            "eaf7a6be-601c-4cf2-9af2-388bfad7271e",
                            "0a6c848f-6a23-4f41-811e-e00c12ab9b97",
                            "00eee396-d19b-4063-afd2-8abe74de30cc",
                            "4846b76b-f426-4380-863d-c8479a8277aa",
                            "11db85f7-ed8f-4a23-81ab-189c3f872a9b"
                        ].map((id, idx) => (
                            <a key={id} href={`https://marble.worldlabs.ai/world/${id}`} target="_blank" style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', padding: '8px 16px', border: 'var(--b-border)', boxShadow: '4px 4px 0px #111', background: '#fff', textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                                SIMULATION_0{idx + 1} ↗
                            </a>
                        ))}
                    </div>
                </div>

                <a href="https://vermillion-travesseiro-d1b2de.netlify.app/" target="_blank" className="work-row">
                    <div className="w-col-name">Enterprise Banking</div>
                    <div className="w-col-tags">Voice-Enabled Care / ElevenLabs API / n8n Background Automation</div>
                    <div className="w-col-type">Voice Bot</div>
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard" className="preview-flyout" />
                </a>

                <a href="https://github.com/EmperorDa8/pdf-platf" target="_blank" className="work-row">
                    <div className="w-col-name">PDF Gallery</div>
                    <div className="w-col-tags">Vibe-Coding / Next.js / MVP / Netflix-style UI</div>
                    <div className="w-col-type">GitHub</div>
                    <img src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80" alt="PDF Gallery App" className="preview-flyout" />
                </a>

                <a href="https://galaxyflow.lovable.app" target="_blank" className="work-row">
                    <div className="w-col-name">Galaxyflow</div>
                    <div className="w-col-tags">Audio-to-Music Art / Lovable / AI Generated Concepts</div>
                    <div className="w-col-type">Prototype</div>
                    <img src="/galaxyflow_thumbnail.png" alt="Galaxyflow Cover Gen" className="preview-flyout" />
                </a>

                <a href="https://github.com/EmperorDa8/agentic-x-bot" target="_blank" className="work-row">
                    <div className="w-col-name">Agent X-Bot</div>
                    <div className="w-col-tags">Agentic AI / X (Twitter) Automation / Autonomous Social Agent</div>
                    <div className="w-col-type">GitHub</div>
                    <img src="https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=80" alt="Agent X-Bot" className="preview-flyout" />
                </a>

                <div className="work-row">
                    <div className="w-col-name">MCP Analytics App</div>
                    <div className="w-col-tags">Google Antigravity Framework / Edge AI Integration / Model Context Protocol</div>
                    <div className="w-col-type">In Dev</div>
                    <img src="/mcp_analytics_app.png" alt="MCP Analytics App" className="preview-flyout" />
                </div>
            </div>
        </section>
    );
}
