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
        title: 'The timetable is fourteen pages.',
        body: 'Exam timetables arrive as PDFs, phone photos, spreadsheets and Word files — every faculty formats them differently, and a student only needs their own handful of rows.',
    },
    {
        tag: '02 / Approach',
        title: 'Read, match, sync.',
        body: 'An AI extraction pipeline reads any format into structured exams, matches them against the student’s registered courses, then writes them to Google Calendar with email reminders via Google OAuth.',
    },
    {
        tag: '03 / Impact',
        title: 'Launched publicly on Product Hunt.',
        body: 'Owned the whole product as founder and solo builder — UX, extraction pipeline, OAuth, launch and user support. Live at xamio.app.',
    },
];

const STACK = ['React', 'FastAPI', 'Supabase', 'Google OAuth', 'Google Calendar API', 'LLM extraction', 'Claude Code'];

export function XamioCase() {
    return (
        <section id="case-xamio" className="case-section">
            <div className="section-head">
                <div>
                    <div className="case-badge live">
                        <span className="pulse-dot" /> Case Study / 01 — Launched
                    </div>
                    <h2 className="section-title">
                        Xamio — <em>never miss an exam.</em>
                    </h2>
                    <p className="case-lead">
                        Upload any exam timetable; AI finds your exams and puts them in your calendar. My own product, from
                        idea to a public Product Hunt launch.
                    </p>
                </div>
                <div className="case-links">
                    <a href="https://xamio.app" target="_blank" rel="noopener noreferrer" className="sim-chip" onMouseEnter={playTick}>
                        xamio.app ↗
                    </a>
                    <a
                        href="https://www.producthunt.com/products/xamio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sim-chip"
                        onMouseEnter={playTick}
                    >
                        Product Hunt ↗
                    </a>
                </div>
            </div>

            <motion.a
                {...reveal(0.1)}
                href="https://xamio.app"
                target="_blank"
                rel="noopener noreferrer"
                className="case-hero"
                onMouseEnter={playTick}
            >
                <img src="/xamio_thumbnail.webp" alt="Xamio landing page: Never miss an exam again" loading="lazy" decoding="async" width={1200} height={750} />
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
                            <span key={t} className="case-tag">
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>
                <motion.div {...reveal(0.12)} className="case-panel">
                    <div className="mono-label">My_Role</div>
                    <p className="case-phase-body" style={{ marginTop: '1rem' }}>
                        Founder and solo builder: product, UX, extraction pipeline, auth, launch and support.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
