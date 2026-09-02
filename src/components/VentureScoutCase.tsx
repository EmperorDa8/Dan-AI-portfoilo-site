import { motion } from 'framer-motion';
import { playTick } from '../sound';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
    viewport: { once: true, amount: 0.2 },
});

const PHASES = [
    { tag: '01 / Problem', title: 'Local investors fly blind.', body: 'Angel investors and family offices evaluating local SMBs lack structured risk signals. Decisions rely on gut feel, sparse spreadsheets, and slow human due-diligence.' },
    { tag: '02 / Approach', title: 'Score, surface, decide.', body: 'Built an LLM-powered scoring pipeline that ingests business signals, weights them against a tunable risk model, and renders a portfolio dashboard with explainable verdicts.' },
    { tag: '03 / Impact', title: 'Idea → MVP in 9 days.', body: 'Shipped a live, shareable prototype that turns a 2–3 week diligence cycle into a same-day scan. Demoed to early users for qualitative feedback and iteration.' },
];

const STACK = ['Lovable', 'Claude Code', 'GPT-4o', 'Supabase', 'TypeScript', 'TailwindCSS', 'Prompt Engineering', 'Risk Modeling'];

export function VentureScoutCase() {
    return (
        <section id="case-venturescout" className="case-section">
            <div className="section-head">
                <div>
                    <div className="case-badge live">
                        <span className="pulse-dot" /> Case Study / 02 — Live
                    </div>
                    <h2 className="section-title">
                        Venture<em>Scout</em>
                    </h2>
                    <p className="case-lead">AI Investment Scout for local-business risk scoring &amp; portfolio management.</p>
                </div>
                <a
                    href="https://venuturescout.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sim-chip"
                    onMouseEnter={playTick}
                >
                    View live build ↗
                </a>
            </div>

            <motion.a
                {...reveal(0.1)}
                href="https://venuturescout.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="case-hero"
                onMouseEnter={playTick}
            >
                <img src="/venturescout_thumbnail.webp" alt="VentureScout dashboard" loading="lazy" decoding="async" width={1200} height={675} />
            </motion.a>

            <div className="case-phase-grid">
                {PHASES.map((p, i) => (
                    <motion.div {...reveal(i * 0.1)} className="case-phase" key={p.tag} onMouseEnter={playTick}>
                        <div className="case-phase-tag">{p.tag}</div>
                        <h3 className="case-phase-title">{p.title}</h3>
                        <p className="case-phase-body">{p.body}</p>
                    </motion.div>
                ))}
            </div>

            <div className="case-split">
                <motion.div {...reveal(0)} className="case-panel wide">
                    <div className="mono-label">Build_Stack</div>
                    <div className="case-stack">
                        {STACK.map(t => (
                            <span key={t} className="case-tag">{t}</span>
                        ))}
                    </div>
                </motion.div>
                <motion.div {...reveal(0.12)} className="case-panel">
                    <div className="mono-label">My_Role</div>
                    <p className="case-phase-body" style={{ marginTop: '1rem' }}>
                        End-to-end: problem framing, prompt architecture, UX flows, deployment. Solo build — from blank
                        canvas to live URL.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
