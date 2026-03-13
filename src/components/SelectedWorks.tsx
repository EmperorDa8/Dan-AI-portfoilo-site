export function SelectedWorks() {
    return (
        <section id="work" className="py-32 px-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase">Selected<br /><span className="text-textMuted">Works</span></h2>
                <p className="text-textMuted max-w-sm text-sm mt-4 md:mt-0">A curated collection of intelligent applications, generative media, and automated AI pipelines.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Project 1 */}
                <a href="https://vermillion-travesseiro-d1b2de.netlify.app/" target="_blank" rel="noopener noreferrer" className="group reveal block">
                    <div className="w-full aspect-[4/3] rounded-4xl img-placeholder border border-borderDark mb-6 transition-transform duration-500 group-hover:scale-[0.98]">
                        <span>Project Image 1</span>
                        {/* <img src="proj1.jpg" className="absolute inset-0 w-full h-full object-cover"> */}
                    </div>
                    <div className="flex justify-between items-start px-2">
                        <div>
                            <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">AI-Integrated Web App</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 text-xs border border-borderDark rounded-full text-textMuted">Vibe Coding</span>
                                <span className="px-3 py-1 text-xs border border-borderDark rounded-full text-textMuted">ElevenLabs</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-cardDark border border-borderDark flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            <i className="ph ph-arrow-up-right text-lg"></i>
                        </div>
                    </div>
                </a>

                {/* Project 2 */}
                <a href="https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu" target="_blank" rel="noopener noreferrer" className="group reveal block" style={{ transitionDelay: '0.1s' }}>
                    <div className="w-full aspect-[4/3] rounded-4xl img-placeholder border border-borderDark mb-6 transition-transform duration-500 group-hover:scale-[0.98]">
                        <span>Project Image 2</span>
                    </div>
                    <div className="flex justify-between items-start px-2">
                        <div>
                            <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">Generative Media Engine</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 text-xs border border-borderDark rounded-full text-textMuted">Sora / Runway</span>
                                <span className="px-3 py-1 text-xs border border-borderDark rounded-full text-textMuted">Audio Design</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-cardDark border border-borderDark flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            <i className="ph ph-arrow-up-right text-lg"></i>
                        </div>
                    </div>
                </a>

                {/* Project 3 (In Dev) */}
                <div className="group reveal block md:col-span-2 mt-8">
                    <div className="bg-cardDark border border-borderDark rounded-4xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-borderDark bg-[#0a0a0a] text-xs font-medium mb-6 text-[#ffaa00]">
                                <i className="ph-fill ph-clock"></i> In Development
                            </div>
                            <h3 className="text-3xl font-bold mb-4 uppercase tracking-tight">Enterprise &amp; Edge AI Architectures</h3>
                            <p className="text-textMuted leading-relaxed">Currently engineering a Voice-enabled banking customer care agent (ElevenLabs + n8n automation) alongside a localized mobile app utilizing the Antigravity Framework with MCP servers.</p>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <span className="px-5 py-3 text-sm border border-borderDark rounded-full bg-[#0a0a0a] text-center">n8n Workflow Automation</span>
                            <span className="px-5 py-3 text-sm border border-borderDark rounded-full bg-[#0a0a0a] text-center">Python Backend Scripts</span>
                            <span className="px-5 py-3 text-sm border border-borderDark rounded-full bg-[#0a0a0a] text-center">GCP Machine Learning</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
