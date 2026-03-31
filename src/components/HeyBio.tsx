import { motion } from "framer-motion";

export function HeyBio() {
    return (
        <section className="hey-section" id="bio">
            <div className="hey-header">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="hey-title"
                >
                    Hey!
                </motion.h2>
                <svg className="vibe-svg" viewBox="0 0 100 100" fill="none" stroke="var(--primary-accent)" strokeWidth="3">
                    <circle cx="50" cy="50" r="40" strokeDasharray="10 15" />
                    <circle cx="50" cy="50" r="25" stroke="var(--secondary-accent)" />
                    <circle cx="50" cy="50" r="5" fill="var(--text-color)" />
                    <path d="M50 10 L50 25 M50 75 L50 90 M10 50 L25 50 M75 50 L90 50" />
                </svg>
            </div>

            <div className="hey-grid">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="hey-col-1" style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                    <p>Vibe-coded by <em>Dan Usman</em>, an AI Product Engineer &amp; Vibe Coder based remotely, engineering production-ready assets and environments.</p>

                    <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', borderBottom: '2px solid #111', paddingBottom: '0.5rem', width: '100%' }}>CORE_COMPETENCIES</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Advanced Prompting', 'Sora / VEO 3', 'Midjourney', 'Voice AI Agents', 'Cursor IDE', 'n8n Workflow', 'Google Antigravity'].map((skill, i) => (
                            <span key={i} style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'var(--b-border)', boxShadow: '2px 2px 0px #111', borderRadius: '0', fontFamily: 'var(--font-mono)', fontWeight: 'bold', background: '#fff' }}>{skill}</span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="hey-col-2"
                >
                    <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" alt="Cyber Vibe Environment" />
                    <svg className="overlay-icon" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" />
                        <line x1="50" y1="50" x2="50" y2="90" />
                        <line x1="50" y1="50" x2="10" y2="30" />
                        <line x1="50" y1="50" x2="90" y2="30" />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="hey-col-3"
                >
                    <div className="hey-num">(AI)</div>
                    <p>I am an innovative <strong>AI Product Engineer</strong>, <strong>AI Prompt Engineer</strong>, and <strong>Vibe-Coder</strong> specializing in fast prototyping, building MVPs, and shipping them to production. The projects listed here demonstrate my experience taking ideas from concept to fully deployed systems.</p>
                    <p>While some of my projects are currently live, others are waiting to be deployed due to hosting costs, as I am currently unemployed. I have recently finished my contract at <strong>AZer-t</strong>, and I am actively <strong>open to work</strong> for both fully remote roles or onsite positions (open to relocation).</p>
                    <div style={{ borderLeft: '2px solid var(--secondary-accent)', paddingLeft: '1rem', marginTop: '2rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        "Focusing on highly-detailed visuals, rapid MVPs, and vibe-coding full-stack applications with modern IDEs and automation protocols."
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
