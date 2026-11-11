import { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick, playTick } from '../sound';
import { Win } from './Win';

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
    viewport: { once: true, amount: 0.2 },
});

const STORE = 'https://chromewebstore.google.com/detail/veridic-plain-english-doc/bonhakihihahncfdkeckopmfeblflmak';
const SITE = 'https://extension-veridic.vercel.app/';

/* The five screens are the extension's own Web Store screenshots. */
const SCREENS = [
    { id: '1-highlight', tab: 'Highlight', alt: 'Highlighting a contract clause and reading it in plain words' },
    { id: '2-whole-page', tab: 'Whole page', alt: 'Reading a whole terms page, each finding quoted' },
    { id: '3-job-offer', tab: 'Job offer', alt: 'Reading a job offer against a fixed list of topics' },
    { id: '4-terms-changed', tab: 'Terms changed', alt: 'A watched document that was rewritten' },
    { id: '5-deadlines', tab: 'Deadlines', alt: 'Deadlines and renewals found in documents' },
];

const PHASES = [
    {
        tag: '01 / Problem',
        title: 'People sign what they cannot read.',
        body: 'Leases, offer letters and terms pages are written densely, and a generic AI summary gives you nothing to check it against. If the summary is wrong, you find out after you have signed.',
    },
    {
        tag: '02 / Approach',
        title: 'Every finding quotes the document.',
        body: 'Each point is shown with the exact wording it rests on, and those quotes are checked against the text on the server and again in the extension. An answer with no quote that checks out is withheld. Three engines, always labelled: on-device Chrome AI, Veridic’s own service, and a pattern-matching floor.',
    },
    {
        tag: '03 / Impact',
        title: 'Live on the Chrome Web Store.',
        body: 'Version 1.0.6, in 16 languages, with paid passes and accounts. It explains and never advises: medical documents are refused rather than analysed, on both client and server, and a test suite pins that boundary in both directions.',
    },
];

const STACK = ['Chrome MV3', 'Supabase Edge Functions', 'Chrome built-in AI', 'LLM structured output', 'Payments', '16 languages', 'Claude Code'];

export function VeridicCase() {
    const [screen, setScreen] = useState(0);
    const current = SCREENS[screen];

    return (
        <section id="case-veridic" className="case-section">
            <div className="section-head">
                <div>
                    <div className="case-badge live">
                        <span className="pulse-dot" /> Case Study / 02 — Live
                    </div>
                    <h2 className="section-title">
                        Veridic — <em>dense documents, in plain words.</em>
                    </h2>
                    <p className="case-lead">
                        A Chrome extension that restates contracts, policies and forms in plain English and quotes the
                        exact wording, so every point can be checked against the source. My own product, live.
                    </p>
                </div>
                <div className="case-links">
                    <a href={STORE} target="_blank" rel="noopener noreferrer" className="sim-chip" onMouseEnter={playTick}>
                        Chrome Web Store ↗
                    </a>
                    <a href={SITE} target="_blank" rel="noopener noreferrer" className="sim-chip" onMouseEnter={playTick}>
                        Site ↗
                    </a>
                </div>
            </div>

            <motion.div {...reveal(0.1)} className="case-hero is-win">
                <Win title="veridic · chrome extension" meta={`${screen + 1} / ${SCREENS.length}`}>
                    <div className="win-tabs" role="tablist" aria-label="Veridic screens">
                        {SCREENS.map((s, i) => (
                            <button
                                key={s.id}
                                type="button"
                                role="tab"
                                aria-selected={i === screen}
                                className={`win-tab${i === screen ? ' is-on' : ''}`}
                                onClick={() => {
                                    setScreen(i);
                                    playClick();
                                }}
                                onMouseEnter={playTick}
                            >
                                {s.tab}
                            </button>
                        ))}
                    </div>
                    <img
                        key={current.id}
                        className="win-shot"
                        src={`/veridic/${current.id}.webp`}
                        alt={current.alt}
                        width={1280}
                        height={800}
                        decoding="async"
                    />
                </Win>
            </motion.div>

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
                        Founder and sole builder: product, extension, backend, payments and the store listing.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
