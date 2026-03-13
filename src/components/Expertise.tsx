export function Expertise() {
    return (
        <section id="expertise" className="py-32 px-6 max-w-[1400px] mx-auto border-t border-borderDark">
            <div className="text-center mb-16 reveal">
                <h2 className="text-5xl font-bold tracking-tighter uppercase mb-4">Core Expertise</h2>
                <p className="text-textMuted">The technical stacks and methodologies driving my developments.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8 hover:bg-cardDark transition-colors reveal">
                    <i className="ph-fill ph-brain text-4xl mb-6 text-white"></i>
                    <h3 className="text-xl font-bold mb-4 uppercase">Prompt Engineering</h3>
                    <p className="text-textMuted text-sm leading-relaxed mb-6">Advanced Visual &amp; Multi-Modal Prompting, A/B Testing, Zero-Shot &amp; Few-Shot Learning execution.</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">ChatGPT-4o</span>
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">Claude Sonnet</span>
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">Gemini</span>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8 hover:bg-cardDark transition-colors reveal" style={{ transitionDelay: '0.1s' }}>
                    <i className="ph-fill ph-video-camera text-4xl mb-6 text-white"></i>
                    <h3 className="text-xl font-bold mb-4 uppercase">Generative Media</h3>
                    <p className="text-textMuted text-sm leading-relaxed mb-6">Text-to-Video kinematics, Text-to-Image synthesis, 3D Assets, Avatar creation, and Sound Design.</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">Sora / VEO 3</span>
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">Midjourney</span>
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">Stable Diffusion</span>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8 hover:bg-cardDark transition-colors reveal" style={{ transitionDelay: '0.2s' }}>
                    <i className="ph-fill ph-code text-4xl mb-6 text-white"></i>
                    <h3 className="text-xl font-bold mb-4 uppercase">Vibe Coding</h3>
                    <p className="text-textMuted text-sm leading-relaxed mb-6">Rapid app logic deployment, NLP &amp; Machine learning scripting, and advanced API workflow routing.</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">Cursor App</span>
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">Python / Node.js</span>
                        <span className="px-3 py-1 border border-borderDark rounded-full text-xs">n8n Automation</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
