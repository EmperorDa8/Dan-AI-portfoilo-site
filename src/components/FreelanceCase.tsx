import { motion } from 'framer-motion';
import { playTick } from '../sound';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
    viewport: { once: true, amount: 0.2 },
});

type Tech = { name: string; slug: string; color: string };

const STACK: Tech[] = [
    { name: 'Claude Code', slug: 'anthropic', color: 'D97757' },
    { name: 'GitHub', slug: 'github', color: '181717' },
    { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
    { name: 'Node.js', slug: 'nodedotjs', color: '5FA04E' },
    { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4' },
    { name: 'Vite', slug: 'vite', color: '646CFF' },
    { name: 'Markdown', slug: 'markdown', color: '000000' },
];

const PHASES = [
    { tag: '01 / Problem', accent: '#d1495b', title: 'Need tangible proof, fast.', body: 'Client needed a credible, public AI artefact to demonstrate hands-on capability — understandable to non-technical reviewers, on a fixed budget, with no room for rework.' },
    { tag: '02 / Approach', accent: '#c07f00', title: 'Scope down. Ship one thing well.', body: 'Resisted the urge to overbuild. Chose a single-purpose MVP with clean docs, a runnable demo, and sensible defaults — built using AI-assisted scaffolding plus manual polish.' },
    { tag: '03 / Outcome', accent: '#1f9d55', title: 'Live on GitHub in 24h.', body: 'Built end-to-end and shipped to a public open-source repo in a single day. Client signed off same-day — the first deliverable set the bar for the rest of the engagement.' },
];

const METRICS = [
    { label: 'Delivery', value: '1 day', sub: 'idea → live repo' },
    { label: 'Sign-off', value: 'Same day', sub: 'first-pass approval' },
    { label: 'Output', value: 'Public', sub: 'open-source on GitHub' },
    { label: 'Scope', value: 'MVP', sub: 'one job, done well' },
];

export function FreelanceCase() {
    return (
        <section id="case-freelance" className="case-section">
            <div className="section-head">
                <div>
                    <div className="case-badge delivered">
                        <span className="pulse-dot amber" /> Case Study / 02 — Delivered
                    </div>
                    <h2 className="section-title">
                        Private <em>Client — AI MVP</em>
                    </h2>
                    <p className="case-lead">
                        Freelance engagement — built and shipped an <strong>LLM-powered developer tool MVP</strong>,
                        open-sourced on GitHub, for an independent client entering a digital-technology role.
                    </p>
                </div>
                <div className="case-meta-block mono-label" onMouseEnter={playTick}>
                    <span>Engagement</span>
                    <strong>May 2026 · 1-day delivery</strong>
                    <span>Fee type</span>
                    <strong>Freelance / Fixed scope</strong>
                </div>
            </div>

            <div className="case-phase-grid">
                {PHASES.map((p, i) => (
                    <motion.div {...reveal(i * 0.1)} className="case-phase" key={p.tag} onMouseEnter={playTick}>
                        <div className="case-phase-tag" style={{ color: p.accent }}>{p.tag}</div>
                        <h3 className="case-phase-title">{p.title}</h3>
                        <p className="case-phase-body">{p.body}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div {...reveal(0)} className="case-panel wide" style={{ marginBottom: '1.4rem' }}>
                <div className="case-panel-head">
                    <div className="mono-label">Build_Stack</div>
                    <div className="mono-label">{STACK.length} tools</div>
                </div>
                <div className="case-stack">
                    {STACK.map(t => (
                        <div key={t.slug} className="case-tag logo" onMouseEnter={playTick}>
                            <img
                                src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
                                alt={`${t.name} logo`}
                                width={18}
                                height={18}
                                loading="lazy"
                            />
                            <span>{t.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="case-metric-grid">
                {METRICS.map((m, i) => (
                    <motion.div {...reveal(i * 0.05)} className="case-metric" key={m.label}>
                        <div className="mono-label">{m.label}</div>
                        <div className="case-metric-value">{m.value}</div>
                        <div className="case-metric-sub">{m.sub}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
