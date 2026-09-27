import { motion } from 'framer-motion';
import { playTick } from '../sound';
import { AmbientVideo } from './AmbientVideo';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const EXPERIENCE = [
    {
        period: 'Feb 2026 — Present',
        role: 'Freelance AI Product Engineer',
        org: 'Remote · clients in the UK, US and Nigeria',
        note: 'Mo2Production e-commerce platform live in under two weeks; Claude-API RAG contract triage with human review; 9-agent trade finance prototype. Documented repos and handover notes on milestone agreements.',
    },
    {
        period: 'Launched 2026',
        role: 'Founder · Xamio',
        org: 'Product Hunt launch · xamio.app',
        note: 'Solo-built AI exam-timetable extraction and Google Calendar sync. Owned UX, pipeline, OAuth, launch and user support.',
    },
    {
        period: 'Sep 2025 — Jan 2026',
        role: 'AI Prompt Engineer Intern',
        org: 'AZER-T — game studio, France · Remote',
        note: 'Prompt-driven pipelines for game art, marketing assets and 3D models: ~30% lower per-asset outsourcing cost, ~40% faster iteration. ElevenLabs voices for 3 NPCs; 10+ marketing assets on deadline.',
    },
    {
        period: '2021 — 2024',
        role: 'B.Sc. Computer Science',
        org: 'National Open University of Nigeria (NOUN)',
        note: 'Plus Google IT Automation with Python and Google Generative AI Studio.',
    },
];

export function Credentials() {
    return (
        <section className="cred-section has-ambient" id="credentials">
            <AmbientVideo name="schoolroom" opacity={0.12} />
            <div className="section-head">
                <h2 className="section-title">
                    Certified <em>&amp; proven.</em>
                </h2>
                <span className="mono-label">/ credentials &amp; experience</span>
            </div>

            <div className="cred-grid">
                <div className="cred-certs">
                    <motion.a
                        {...reveal(0.05)}
                        className="cert-card"
                        href="/cert_google_prompting_essentials.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playTick}
                    >
                        <div className="cert-chip">
                            <span className="cert-check" aria-hidden>✓</span>
                            Certified AI Prompt Engineer
                        </div>
                        <h3 className="cert-name">Google Prompting Essentials</h3>
                        <p className="cert-meta">
                            Google Career Certificates · Coursera Specialization · Jul 2025
                        </p>
                        <div className="cert-links">
                            <span className="cert-view">View certificate ↗</span>
                        </div>
                    </motion.a>

                    {/* Sibling, not nested: an interactive element inside an <a> is
                        invalid and breaks assistive tech on the best trust signal here. */}
                    <a
                        className="cert-verify-link"
                        href="https://coursera.org/verify/specialization/CYHKREZ8JAA1"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playTick}
                    >
                        Verify this credential on Coursera ↗
                    </a>

                    <motion.a
                        {...reveal(0.15)}
                        className="cert-card"
                        href="/cert_ai_builder.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playTick}
                    >
                        <div className="cert-chip">
                            <span className="cert-check" aria-hidden>✓</span>
                            Certified AI Builder
                        </div>
                        <h3 className="cert-name">AI Fluency for Builders</h3>
                        <p className="cert-meta">CodePath.org × Anthropic · Certificate of Completion</p>
                        <div className="cert-links">
                            <span className="cert-view">View certificate ↗</span>
                        </div>
                    </motion.a>
                </div>

                <div className="cred-timeline">
                    {EXPERIENCE.map((item, i) => (
                        <motion.div {...reveal(0.1 + i * 0.1)} className="tl-entry" key={item.period} onMouseEnter={playTick}>
                            <div className="tl-period mono-label">{item.period}</div>
                            <div className="tl-role">{item.role}</div>
                            <div className="tl-org">{item.org}</div>
                            <p className="tl-note">{item.note}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
