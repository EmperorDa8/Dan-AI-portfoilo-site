import { motion } from 'framer-motion';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
    viewport: { once: true, amount: 0.2 },
});

export function VentureScoutCase() {
    return (
        <section id="case-venturescout" className="py-32 px-6 max-w-[1400px] mx-auto border-t border-borderDark">

            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <motion.div {...reveal(0)}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-borderDark bg-[#0a0a0a] text-xs font-medium mb-6 text-[#7cf29c]" style={{ fontFamily: 'var(--font-mono)' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#7cf29c' }}></span>
                        CASE_STUDY / 01 — LIVE
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.95]">
                        Venture<span className="text-textMuted">Scout</span>
                    </h2>
                    <p className="text-textMuted mt-4 max-w-lg">AI Investment Scout for local-business risk scoring &amp; portfolio management.</p>
                </motion.div>

                <motion.a
                    {...reveal(0.1)}
                    href="https://venuturescout.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 border border-borderDark rounded-full hover:bg-white hover:text-black transition-colors text-sm"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    VIEW LIVE BUILD
                    <i className="ph ph-arrow-up-right text-lg"></i>
                </motion.a>
            </div>

            {/* Hero image */}
            <motion.div {...reveal(0.15)} className="w-full aspect-[16/9] rounded-4xl overflow-hidden border border-borderDark mb-20 relative bg-[#0a0a0a]">
                <img src="/venturescout_thumbnail.png" alt="VentureScout dashboard" className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>

            {/* Problem / Approach / Impact grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">

                <motion.div {...reveal(0)} className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8">
                    <div className="text-xs mb-4 text-[#ff6b6b]" style={{ fontFamily: 'var(--font-mono)' }}>01 / PROBLEM</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">Local investors fly blind.</h3>
                    <p className="text-textMuted text-sm leading-relaxed">
                        Angel investors and family offices evaluating local SMBs lack structured risk signals.
                        Decisions rely on gut feel, sparse spreadsheets, and slow human due-diligence.
                    </p>
                </motion.div>

                <motion.div {...reveal(0.1)} className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8">
                    <div className="text-xs mb-4 text-[#ffaa00]" style={{ fontFamily: 'var(--font-mono)' }}>02 / APPROACH</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">Score, surface, decide.</h3>
                    <p className="text-textMuted text-sm leading-relaxed">
                        Built an LLM-powered scoring pipeline that ingests business signals, weights them against
                        a tunable risk model, and renders a portfolio dashboard with explainable verdicts.
                    </p>
                </motion.div>

                <motion.div {...reveal(0.2)} className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8">
                    <div className="text-xs mb-4 text-[#7cf29c]" style={{ fontFamily: 'var(--font-mono)' }}>03 / IMPACT</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">Idea → MVP in 9 days.</h3>
                    <p className="text-textMuted text-sm leading-relaxed">
                        Shipped a live, shareable prototype that turns a 2&ndash;3 week diligence cycle into a
                        same-day scan. Demoed to early users for qualitative feedback &amp; iteration.
                    </p>
                </motion.div>

            </div>

            {/* Stack + role split */}
            <div className="grid md:grid-cols-12 gap-6">

                <motion.div {...reveal(0)} className="md:col-span-7 bg-cardDark border border-borderDark rounded-4xl p-10">
                    <div className="text-xs mb-6 text-textMuted" style={{ fontFamily: 'var(--font-mono)' }}>BUILD_STACK</div>
                    <div className="flex flex-wrap gap-3">
                        {['Lovable', 'Claude Code', 'GPT-4o', 'Supabase', 'TypeScript', 'TailwindCSS', 'Prompt Engineering', 'Risk Modeling'].map((t, i) => (
                            <span key={i} className="px-4 py-2 text-sm border border-borderDark rounded-full bg-[#0a0a0a] text-white">{t}</span>
                        ))}
                    </div>
                </motion.div>

                <motion.div {...reveal(0.15)} className="md:col-span-5 bg-cardDark border border-borderDark rounded-4xl p-10">
                    <div className="text-xs mb-6 text-textMuted" style={{ fontFamily: 'var(--font-mono)' }}>MY_ROLE</div>
                    <p className="text-textMuted text-sm leading-relaxed">
                        End-to-end: problem framing, prompt architecture, UX flows, deployment.
                        Solo build &mdash; from blank canvas to live URL.
                    </p>
                </motion.div>

            </div>

        </section>
    );
}
