import { motion } from 'framer-motion';
import { AmbientVideo } from './AmbientVideo';

export function HeyBio() {
    return (
        <section className="hey-section has-ambient" id="bio">
            <AmbientVideo name="library" opacity={0.14} />
            <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="hey-title"
            >
                Hey!
            </motion.h2>

            <div className="hey-grid">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    viewport={{ once: true }}
                    className="hey-col-1"
                >
                    <p>
                        <em>Dan Usman</em> — <strong>AI Product Engineer, AI Video &amp; Content Creator and AI Creative</strong>. I ship software and
                        generate the video and imagery around it. Idea → live release, end-to-end ownership, with Claude Code and
                        Cursor as my core development workflow.
                    </p>
                    <p style={{ marginTop: '1.4rem' }}>
                        I scope ruthlessly to what's good enough now versus what must be robust on day one, and validate, test,
                        and correct AI output until the software runs in production.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    viewport={{ once: true }}
                    className="hey-col-2"
                >
                    <img
                        src="/hero_portrait_color.webp" loading="lazy" decoding="async" width={800} height={1000}
                        alt="Dan Usman"
                        onError={e => {
                            // Hide, never substitute: the old fallback loaded a stock
                            // photo of someone else under alt="Dan Usman".
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <svg className="overlay-icon" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" />
                        <line x1="50" y1="50" x2="50" y2="90" />
                        <line x1="50" y1="50" x2="10" y2="30" />
                        <line x1="50" y1="50" x2="90" y2="30" />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    viewport={{ once: true }}
                    className="hey-col-3"
                >
                    <div className="hey-num">(AI)</div>
                    <p>
                        I build on the <strong>Claude, OpenAI and Gemini APIs</strong> — tool calling, multi-agent
                        orchestration, MCP, RAG, structured JSON outputs with guardrails and human review. A background in{' '}
                        <strong>IT automation and Linux</strong> means I care about reliability, cost, security and what
                        happens when the model is wrong.
                    </p>
                    <p>
                        Currently a <strong>freelance AI Product Engineer</strong> (Feb 2026 – present) for clients in the
                        UK, US and Nigeria, and founder of <strong>Xamio</strong>, launched on Product Hunt. Before that,{' '}
                        <strong>AI Prompt Engineer Intern at AZER-T</strong>, a French game studio. Based in{' '}
                        <strong>Lagos, Nigeria</strong> and open to <strong>fully remote, hybrid, onsite or
                        relocation</strong>.
                    </p>
                    <div className="hey-quote">
                        "PRD-first specs, CLAUDE.md context files, ruthless scoping — the workflow discipline that makes
                        AI-assisted development actually ship."
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
