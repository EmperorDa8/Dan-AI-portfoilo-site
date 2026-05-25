export function Experience() {
    return (
        <section id="experience" className="py-32 px-6 max-w-[1400px] mx-auto border-t border-borderDark">
            <div className="grid lg:grid-cols-12 gap-16">

                <div className="lg:col-span-4 reveal">
                    <h2 className="text-5xl font-bold tracking-tighter uppercase sticky top-32">Experience</h2>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-8">

                    {/* Job 1 */}
                    <div className="bg-cardDark border border-borderDark rounded-4xl p-8 md:p-10 reveal">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight">AI Prompt Engineer</h3>
                                <p className="text-textMuted mt-1">AZer-t (French Video Game Studio)</p>
                            </div>
                            <span className="px-4 py-2 rounded-full border border-borderDark text-sm">Sept 2025 - Present</span>
                        </div>
                        <ul className="space-y-4 text-textMuted">
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Engineered <strong className="text-white">50+ production-quality game assets</strong> (environments, UI, characters) via multi-modal prompts in Midjourney &amp; Stable Diffusion, cutting concept-to-asset turnaround by ~60%.</li>
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Designed visual prompts for immersive weapon &amp; environmental SFX, generating <strong className="text-white">30+ AI audio assets</strong> approved on first pass by the audio lead.</li>
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Built interactive voice AI agents for NPCs (ElevenLabs + LLM routing), integrating conversational mechanics into <strong className="text-white">3 core gameplay loops</strong>.</li>
                        </ul>
                    </div>

                    {/* Job 2 */}
                    <div className="bg-cardDark border border-borderDark rounded-4xl p-8 md:p-10 reveal">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight">AI Solutions Developer</h3>
                                <p className="text-textMuted mt-1">Freelance &amp; Contract</p>
                            </div>
                            <span className="px-4 py-2 rounded-full border border-borderDark text-sm">2024 - 2025</span>
                        </div>
                        <ul className="space-y-4 text-textMuted">
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Developed optimized semantic prompts for marketing, blogs, and translations across GPT-4, Claude, and Gemini &mdash; shipped to <strong className="text-white">12+ client projects</strong> with measurable copy-quality lift.</li>
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Produced end-to-end short-form UGC videos via AI pipelines, averaging <strong className="text-white">3&times; baseline engagement</strong> on tested client social channels.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}
