import { motion } from 'framer-motion';
import { playTick } from '../sound';

const TOOLS = [
    'Claude Code',
    'Cursor IDE',
    'Lovable / Bolt',
    'MCP Architecture',
    'Multi-Agent Orchestration',
    'n8n Workflow',
    'React / Next.js',
    'FastAPI / Node.js',
    'PostgreSQL / Supabase',
    'Python / TypeScript',
    'Midjourney / VEO 3',
    'ElevenLabs Voice AI',
];

export function HeyBio() {
    return (
        <section className="hey-section" id="bio">
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
                        Vibe-coded by <em>Dan Usman</em> — <strong>AI Product Engineer, AI Builder &amp; Full-Stack AI
                        Delivery</strong>. Business problem → deployed product, end-to-end ownership, directing Claude Code as
                        the engineering team.
                    </p>

                    <div className="mono-label tool-grid-label">Core_Competencies</div>
                    <div className="tool-grid">
                        {TOOLS.map(tool => (
                            <div className="tool-cell" key={tool} onMouseEnter={playTick}>
                                {tool}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    viewport={{ once: true }}
                    className="hey-col-2"
                >
                    <img
                        src="/hero_portrait_color.jpg"
                        alt="Dan Usman"
                        onError={e => {
                            (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';
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
                        I turn loosely defined business problems — "we need an ERP," a client portal, an internal dashboard —
                        into <strong>working, deployed applications end-to-end</strong>, directing AI coding tools (primarily{' '}
                        <strong>Claude Code</strong>) as the engineering team. I own the database, framework, and deployment
                        calls, and validate, test, and correct AI output until the software runs in production.
                    </p>
                    <p>
                        Currently a <strong>freelance / self-directed AI Product Engineer</strong> (Feb 2026 – present): shipped
                        a UK photo &amp; print e-commerce MVP in one week and an LLM risk-scoring MVP in nine days. Before that,
                        a remote contract as <strong>AI Prompt Engineer</strong> for <strong>AZer-t</strong>, a French mobile
                        game studio. I'm a <strong>certified AI Prompt Engineer</strong> (Google Prompting Essentials) and{' '}
                        <strong>certified AI Builder</strong> (CodePath × Anthropic). Based in <strong>Lagos, Nigeria</strong>,
                        working <strong>remote worldwide</strong>, and <strong>open to relocation</strong>.
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
