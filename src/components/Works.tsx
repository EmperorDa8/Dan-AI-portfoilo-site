import { playTick, playSwell } from '../sound';
import { gsap, ScrollTrigger, prefersReducedMotion, revealElement, useGsapScope } from '../lib/scroll';

export function Works() {
    const scopeRef = useGsapScope<HTMLElement>(({ scope }) => {
        if (prefersReducedMotion()) return;

        // Section header pins while the list scrolls past it (Contralabs "Left Col (Sticky)").
        const head = scope.querySelector<HTMLElement>('.work-head');
        const list = scope.querySelector<HTMLElement>('.work-list');
        if (head && list && window.matchMedia('(min-width: 901px)').matches) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: scope,
                    start: 'top top+=90',
                    end: () => `+=${Math.max(list.offsetHeight - head.offsetHeight - 160, 200)}`,
                    pin: head,
                    pinSpacing: false,
                    invalidateOnRefresh: true,
                },
            });
        }

        gsap.utils.toArray<HTMLElement>('.work-row', scope).forEach(row => {
            revealElement(row, { y: 40, start: 'top 90%' });
        });

        // One low swell when the section first arrives (silent unless sound is on).
        ScrollTrigger.create({
            trigger: scope,
            start: 'top 70%',
            once: true,
            onEnter: () => playSwell(),
        });
    }, []);

    return (
        <section className="work-section" id="work" ref={scopeRef}>
            <div className="section-head work-head">
                <h2 className="section-title">
                    Repositories &amp; <em>Worlds</em>
                </h2>
                <span className="mono-label">/ selected output</span>
            </div>

            <div className="work-list">
                <a href="https://github.com/EmperorDa8/generativeAI" target="_blank" className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">Gen-AI Repo</div>
                    <div className="w-col-tags">Prompt Engineering / Text, Image &amp; Video Generative Models</div>
                    <div className="w-col-type"><span>GitHub</span></div>
                    <img src="/game_character.png" alt="Generative AI" className="preview-flyout" />
                </a>

                <a href="https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu" target="_blank" className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">Media Engine</div>
                    <div className="w-col-tags">Sora / VEO 3 / Runway / Highly-detailed Midjourney Visuals</div>
                    <div className="w-col-type"><span>Portfolio</span></div>
                    <img src="/generative_media_studio.png" alt="Generative Media" className="preview-flyout" />
                </a>

                <div className="work-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
                        <div className="w-col-name">Marble AI Worlds</div>
                        <div className="w-col-tags" style={{ flex: 1 }}>Interactive Generative 3D Environments</div>
                        <div className="w-col-type"><span>WorldLabs</span></div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1.6rem' }}>
                        {[
                            "0007ca41-6e04-47a7-b3cf-f4c2c9f372d5",
                            "c79cfa02-265e-4aad-8c2e-bfae9fd8a22e",
                            "eaf7a6be-601c-4cf2-9af2-388bfad7271e",
                            "0a6c848f-6a23-4f41-811e-e00c12ab9b97",
                            "00eee396-d19b-4063-afd2-8abe74de30cc",
                            "4846b76b-f426-4380-863d-c8479a8277aa",
                            "11db85f7-ed8f-4a23-81ab-189c3f872a9b"
                        ].map((id, idx) => (
                            <a key={id} href={`https://marble.worldlabs.ai/world/${id}`} target="_blank" className="sim-chip" onMouseEnter={playTick}>
                                SIMULATION_0{idx + 1} ↗
                            </a>
                        ))}
                    </div>
                </div>

                <a href="https://vermillion-travesseiro-d1b2de.netlify.app/" target="_blank" className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">Enterprise Banking</div>
                    <div className="w-col-tags">Voice-Enabled Care / ElevenLabs API / n8n Background Automation</div>
                    <div className="w-col-type"><span>Voice Bot</span></div>
                    <img src="/ai_web_app_ui.png" alt="Dashboard" className="preview-flyout" />
                </a>

                <a href="https://github.com/EmperorDa8/pdf-platf" target="_blank" className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">PDF Gallery</div>
                    <div className="w-col-tags">Vibe-Coding / Next.js / MVP / Netflix-style UI</div>
                    <div className="w-col-type"><span>GitHub</span></div>
                    <img src="/subkit.png" alt="PDF Gallery App" className="preview-flyout" />
                </a>

                <a href="https://venuturescout.lovable.app/" target="_blank" className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">VentureScout</div>
                    <div className="w-col-tags">AI Investment Scout / Local Business Risk Scoring / Portfolio Management</div>
                    <div className="w-col-type"><span>Prototype</span></div>
                    <img src="/venturescout_thumbnail.png" alt="VentureScout AI Asset Manager" className="preview-flyout" />
                </a>

                <a href="https://galaxyflow.lovable.app" target="_blank" className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">Galaxyflow</div>
                    <div className="w-col-tags">Audio-to-Music Art / Lovable / AI Generated Concepts</div>
                    <div className="w-col-type"><span>Prototype</span></div>
                    <img src="/galaxyflow_thumbnail.png" alt="Galaxyflow Cover Gen" className="preview-flyout" />
                </a>

                <a href="https://github.com/EmperorDa8/agentic-x-bot" target="_blank" className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">Agent X-Bot</div>
                    <div className="w-col-tags">Agentic AI / X (Twitter) Automation / Autonomous Social Agent</div>
                    <div className="w-col-type"><span>GitHub</span></div>
                    <img src="/ad_generator_thumbnail.png" alt="Agent X-Bot" className="preview-flyout" />
                </a>

                <div className="work-row" onMouseEnter={playTick}>
                    <div className="w-col-name">MCP Analytics App</div>
                    <div className="w-col-tags">Google Antigravity Framework / Edge AI Integration / Model Context Protocol</div>
                    <div className="w-col-type"><span>In Dev</span></div>
                    <img src="/mcp_analytics_app.png" alt="MCP Analytics App" className="preview-flyout" />
                </div>
            </div>
        </section>
    );
}
