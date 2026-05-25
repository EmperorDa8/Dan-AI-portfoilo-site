import { motion } from 'framer-motion';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
    viewport: { once: true, amount: 0.2 },
});

type Tech = { name: string; slug: string; color: string };

const stack: Tech[] = [
    { name: 'Claude Code',  slug: 'anthropic',  color: 'D97757' },
    { name: 'GitHub',       slug: 'github',     color: 'ffffff' },
    { name: 'TypeScript',   slug: 'typescript', color: '3178C6' },
    { name: 'Node.js',      slug: 'nodedotjs',  color: '5FA04E' },
    { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4' },
    { name: 'Vite',         slug: 'vite',       color: '646CFF' },
    { name: 'Markdown',     slug: 'markdown',   color: 'ffffff' },
];

export function FreelanceCase() {
    return (
        <section id="case-freelance" className="py-32 px-6 max-w-[1400px] mx-auto border-t border-borderDark">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <motion.div {...reveal(0)}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-borderDark bg-[#0a0a0a] text-xs font-medium mb-6 text-[#ffaa00]" style={{ fontFamily: 'var(--font-mono)' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ffaa00' }}></span>
                        CASE_STUDY / 02 &mdash; DELIVERED
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.95]">
                        Private<br/><span className="text-textMuted">Client &mdash; AI MVP</span>
                    </h2>
                    <p className="text-textMuted mt-4 max-w-lg">
                        Freelance engagement &mdash; built and shipped an <strong className="text-white">LLM-powered developer tool MVP</strong>, open-sourced on GitHub, for an independent client entering a digital-technology role.
                    </p>
                </motion.div>

                <motion.div {...reveal(0.1)} className="flex flex-col items-start md:items-end gap-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    <div className="text-textMuted">ENGAGEMENT</div>
                    <div className="text-white text-base">May 2026 &middot; 1-day delivery</div>
                    <div className="text-textMuted">FEE TYPE</div>
                    <div className="text-white text-base">Freelance / Fixed scope</div>
                </motion.div>
            </div>

            {/* Problem / Approach / Impact */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">

                <motion.div {...reveal(0)} className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8">
                    <div className="text-xs mb-4 text-[#ff6b6b]" style={{ fontFamily: 'var(--font-mono)' }}>01 / PROBLEM</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">Need tangible proof, fast.</h3>
                    <p className="text-textMuted text-sm leading-relaxed">
                        Client needed a credible, public AI artefact to demonstrate hands-on capability &mdash;
                        understandable to non-technical reviewers, on a fixed budget, with no room for rework.
                    </p>
                </motion.div>

                <motion.div {...reveal(0.1)} className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8">
                    <div className="text-xs mb-4 text-[#ffaa00]" style={{ fontFamily: 'var(--font-mono)' }}>02 / APPROACH</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">Scope down. Ship one thing well.</h3>
                    <p className="text-textMuted text-sm leading-relaxed">
                        Resisted the urge to overbuild. Chose a single-purpose MVP with clean docs, runnable demo,
                        and sensible defaults &mdash; built using AI-assisted scaffolding plus manual polish.
                    </p>
                </motion.div>

                <motion.div {...reveal(0.2)} className="bg-[#0a0a0a] border border-borderDark rounded-4xl p-8">
                    <div className="text-xs mb-4 text-[#7cf29c]" style={{ fontFamily: 'var(--font-mono)' }}>03 / OUTCOME</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">Live on GitHub in 24h.</h3>
                    <p className="text-textMuted text-sm leading-relaxed">
                        Built end-to-end and shipped to a public open-source repo in a single day.
                        Client signed off same-day &mdash; first deliverable set the bar for the rest of the engagement.
                    </p>
                </motion.div>

            </div>

            {/* Tech stack with real logos */}
            <motion.div {...reveal(0)} className="bg-cardDark border border-borderDark rounded-4xl p-10 mb-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-xs text-textMuted" style={{ fontFamily: 'var(--font-mono)' }}>BUILD_STACK</div>
                    <div className="text-xs text-textMuted" style={{ fontFamily: 'var(--font-mono)' }}>{stack.length} tools</div>
                </div>
                <div className="flex flex-wrap gap-3">
                    {stack.map((t) => (
                        <div
                            key={t.slug}
                            className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#0a0a0a] border border-borderDark rounded-full text-white text-sm hover:border-white transition-colors"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            <img
                                src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
                                alt={`${t.name} logo`}
                                width={18}
                                height={18}
                                loading="lazy"
                                style={{ display: 'block' }}
                            />
                            <span>{t.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Metrics row */}
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { label: 'DELIVERY', value: '1 day', sub: 'idea → live repo' },
                    { label: 'SIGN-OFF', value: 'Same day', sub: 'first-pass approval' },
                    { label: 'OUTPUT', value: 'Public', sub: 'open-source on GitHub' },
                    { label: 'SCOPE', value: 'MVP', sub: 'one job, done well' },
                ].map((m, i) => (
                    <motion.div key={m.label} {...reveal(0.05 * i)} className="bg-cardDark border border-borderDark rounded-4xl p-6">
                        <div className="text-xs mb-3 text-textMuted" style={{ fontFamily: 'var(--font-mono)' }}>{m.label}</div>
                        <div className="text-3xl font-bold text-white tracking-tight mb-1">{m.value}</div>
                        <div className="text-xs text-textMuted">{m.sub}</div>
                    </motion.div>
                ))}
            </div>

        </section>
    );
}
