import { motion } from 'framer-motion';
import { playTick } from '../sound';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
    viewport: { once: true, amount: 0.2 },
});

const PHASES = [
    {
        tag: '01 / Problem',
        title: 'A storefront, and one week to have it.',
        body: 'A UK photo & print business needed a working e-commerce MVP — catalogue, configurable print options, checkout — on a fixed timeline with no engineering team behind it.',
    },
    {
        tag: '02 / Approach',
        title: 'Spec first, then direct the build.',
        body: 'PRD-first scoping to separate what had to be right on day one from what could wait. Claude Code as the engineering team against a structured repo and CLAUDE.md context, with me owning the data model, framework and deployment calls.',
    },
    {
        tag: '03 / Impact',
        title: 'Live and taking orders in seven days.',
        body: 'Shipped end-to-end inside the week — catalogue through checkout, deployed and handed over. The constraint held because the scope was cut deliberately, not because the work was rushed.',
    },
];

const STACK = ['Claude Code', 'TypeScript', 'React', 'Node.js', 'Stripe', 'Tailwind CSS', 'PRD-first scoping'];

export function MoTwoCase() {
    return (
        <section id="case-ecommerce" className="case-section">
            <div className="section-head">
                <div>
                    <div className="case-badge live">
                        <span className="pulse-dot" /> Case Study / 01 — Delivered
                    </div>
                    <h2 className="section-title">
                        UK e-commerce <em>in one week</em>
                    </h2>
                    <p className="case-lead">
                        A photo &amp; print storefront taken from brief to live checkout in seven days — the clearest test
                        of scoping under a hard deadline.
                    </p>
                </div>
                <div className="case-meta-block mono-label" onMouseEnter={playTick}>
                    <span>Engagement</span>
                    <strong>Freelance · fixed scope</strong>
                    <span>Timeline</span>
                    <strong>7 days, brief to live</strong>
                </div>
            </div>

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
                            <span key={t} className="case-tag">
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>
                <motion.div {...reveal(0.12)} className="case-panel">
                    <div className="mono-label">My_Role</div>
                    <p className="case-phase-body" style={{ marginTop: '1rem' }}>
                        Sole engineer. Scoping, data model, build direction, deployment and handover.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
