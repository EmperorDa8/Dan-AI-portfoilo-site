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
        title: 'AI video models forget.',
        body: 'Across ten clips, the same woman changed outfit and the bedroom changed with her. Motion graphics made by an agent drift the same way, just in the other direction: every new video starts to look like the last one.',
    },
    {
        tag: '02 / System',
        title: 'Two specs that enforce consistency.',
        body: 'One agent spec for generated footage and one for brand motion graphics. Both replace "please keep it consistent" with mechanics: fixed output formats, locked reference files, and a check that runs before any work is accepted.',
    },
    {
        tag: '03 / What I learned',
        title: 'Consistency is mechanical, not verbal.',
        body: 'Recreating a 30-second mattress ad in Flow, I generated ten clips and reviewed them against the reference: five outfits, six rooms. Text-only prompts invent a new room every time. The fix was locking reference images — character, room, mattress — and using Frames to Video, not writing longer prompts.',
    },
];

const STACK = ['Google Flow', 'Veo', 'Remotion', 'Claude', 'ffmpeg'];

export function PromptSystemsCase() {
    return (
        <section id="case-prompt-systems" className="case-section">
            <div className="section-head">
                <div>
                    <div className="case-badge live">
                        <span className="pulse-dot" /> Case Study / 03 — Agent specs
                    </div>
                    <h2 className="section-title">
                        Prompts as <em>production systems</em>
                    </h2>
                    <p className="case-lead">
                        Two agent specs I wrote so AI video and motion graphics hold up across many shots, instead of
                        looking different every time.
                    </p>
                </div>
                <div className="case-meta-block mono-label" onMouseEnter={playTick}>
                    <span>Artefact</span>
                    <strong>2 system prompts</strong>
                    <span>Applies to</span>
                    <strong>Flow / Veo · Remotion</strong>
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

            {/* The two specs carry the detail, so they get equal weight rather
                than being compressed into the phase above. */}
            <div className="case-split">
                <motion.div {...reveal(0)} className="case-panel" onMouseEnter={playTick}>
                    <div className="mono-label">The_Director · Flow / Veo</div>
                    <p className="case-phase-body" style={{ marginTop: '1rem' }}>
                        A system prompt in 13 sections. Every shot prompt has a fixed output format. Camera moves are
                        tied to how a real rig behaves, and lighting needs named sources and ratios. There is a physics
                        checklist, a standing negative-prompt block, and a check that runs before any shot is emitted.
                        Character looks are copied word for word from a bible, so faces and wardrobe cannot drift.
                    </p>
                </motion.div>
                <motion.div {...reveal(0.12)} className="case-panel" onMouseEnter={playTick}>
                    <div className="mono-label">ATELIER · Remotion</div>
                    <p className="case-phase-body" style={{ marginTop: '1rem' }}>
                        A spec for an agent that makes brand motion graphics. Each brand compiles to one locked file of
                        colour, type, grid and motion rules, so no scene hardcodes a value. A ledger records every
                        delivery, and a new piece has to differ from the last ten on three of five points. The agent
                        renders stills, looks at them, scores them on a nine-point rubric, and only passes work at 7/10
                        or better.
                    </p>
                </motion.div>
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
                        Directed both specs with Claude, generated the clips, and reviewed them against the reference
                        myself.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
