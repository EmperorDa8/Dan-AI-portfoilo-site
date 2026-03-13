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
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Engineer production-quality game assets (environments, UI, characters) via multi-modal prompts in Midjourney &amp; Stable Diffusion.</li>
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Design visual prompts for immersive weapon/environmental sounds, generating precise AI audio.</li>
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Build interactive voice AI agents for NPCs, integrating conversational AI mechanics into core gameplay.</li>
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
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Developed optimized semantic prompts for marketing, blogs, and translations using GPT-4, Claude, and Gemini.</li>
                            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-white mt-1"></i> Generated end-to-end short-form UGC videos via AI optimized for high social media engagement metrics.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}
