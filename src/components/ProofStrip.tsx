import { motion } from 'framer-motion';
import { playTick } from '../sound';

/** Hard numbers immediately after the hero — previously the first quantitative
 *  claim on the page didn't appear until screen 9.5. */
/* Ordered fastest-first: the shipping speed is the argument, and Tasker is the
   only one that cleared an external review process. The old "8+ live
   prototypes" cell was cut — the grid below evidences that rather than
   asserting it. */
const PROOF = [
    { value: '1 day', label: 'Chrome extension shipped', sub: 'Built solo, live on the Web Store' },
    { value: '1 week', label: 'UK e-commerce MVP', sub: 'Scoped, built and shipped' },
    { value: '9 days', label: 'LLM risk-scoring MVP', sub: 'Idea to live VentureScout' },
    { value: '2', label: 'Verified certifications', sub: 'Google · CodePath × Anthropic' },
];

export function ProofStrip() {
    return (
        <section className="proof-strip" aria-label="Track record">
            <div className="proof-inner">
                {PROOF.map((p, i) => (
                    <motion.div
                        key={p.label}
                        className="proof-cell"
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={playTick}
                    >
                        <div className="proof-value">{p.value}</div>
                        <div className="proof-label">{p.label}</div>
                        <div className="proof-sub">{p.sub}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
