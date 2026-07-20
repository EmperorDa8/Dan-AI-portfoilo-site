import { motion } from 'framer-motion';
import { playTick } from '../sound';

const TOOLS = [
    { name: 'Claude Code', slug: 'anthropic' },
    { name: 'OpenAI', slug: 'openai' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextdotjs' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Python', slug: 'python' },
    { name: 'Node.js', slug: 'nodedotjs' },
    { name: 'Supabase', slug: 'supabase' },
    { name: 'Tailwind', slug: 'tailwindcss' },
    { name: 'Vite', slug: 'vite' },
    { name: 'n8n', slug: 'n8n' },
    { name: 'GitHub', slug: 'github' },
    { name: 'Vercel', slug: 'vercel' },
    { name: 'Framer', slug: 'framer' },
];

export function ToolWall() {
    return (
        <section className="tool-wall-section" aria-label="Tools and stack">
            <div className="section-head">
                <h2 className="section-title">
                    The <em>stack.</em>
                </h2>
                <span className="mono-label">/ tools i build with</span>
            </div>
            <div className="tool-wall">
                {TOOLS.map((t, i) => (
                    <motion.div
                        className="tool-wall-cell"
                        key={t.name}
                        onMouseEnter={playTick}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4, delay: (i % 7) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <img
                            src={`https://cdn.simpleicons.org/${t.slug}/10141a`}
                            alt=""
                            aria-hidden
                            width={26}
                            height={26}
                            loading="lazy"
                        />
                        <span>{t.name}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
