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
                        <em>Dan Usman</em> — <strong>AI Product Engineer, AI Video &amp; Content Creator and AI Creative Specialist</strong>. I ship software and
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
                        I'm <strong>self-taught</strong>. I started out writing prompts — an{' '}
                        <strong>AI Prompt Engineer contract at AZER-T</strong>, a French game studio — and kept going
                        until I was shipping the whole product, not just the prompt. A computer science degree gave me
                        the fundamentals. The rest I learned by building.
                    </p>
                    <p>
                        I work across the <strong>Claude, OpenAI and Gemini APIs</strong> — tool-calling agents,
                        retrieval over a client's own documents, and strict JSON at every boundary with a human check
                        where the model is unsure. A background in <strong>IT automation</strong> is why I care about
                        reliability, cost and security, and about what happens when the model is wrong.
                    </p>
                    <p>
                        <strong>Freelance AI Product Engineer</strong> since February 2026, for clients in the UK, US
                        and Nigeria, and founder of <strong>Xamio</strong>, launched on Product Hunt. Based in{' '}
                        <strong>Lagos, Nigeria</strong>, open to <strong>remote, hybrid, onsite or relocation</strong>.
                    </p>
                    <div className="hey-quote">
                        "Write the spec first, give the model the context it needs, and cut scope without mercy — that's
                        what makes AI-assisted work actually ship."
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
