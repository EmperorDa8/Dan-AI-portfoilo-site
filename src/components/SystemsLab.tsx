import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { playClick, playTick } from '../sound';

/**
 * Two client systems from the freelance work, shown as interactive
 * walkthroughs. Client code and documents are private, so the inputs here are
 * sample clauses and the outputs are scripted — the point is to show the
 * shape of the system: schemas at boundaries, confidence, and where a human
 * steps in.
 */
export function SystemsLab() {
    const [tab, setTab] = useState<'triage' | 'trade'>('triage');
    return (
        <section className="case-section systems-section" id="systems">
            <div className="section-head">
                <div>
                    <div className="case-badge live">
                        <span className="pulse-dot" /> Client systems · Freelance 2026
                    </div>
                    <h2 className="section-title">
                        AI that knows <em>when it's unsure.</em>
                    </h2>
                    <p className="case-lead">
                        RAG and multi-agent systems built for clients, with strict JSON at every boundary and a human in the
                        loop where the model's confidence drops. Try the walkthroughs.
                    </p>
                </div>
                <div className="systems-tabs" role="tablist">
                    <button
                        role="tab"
                        aria-selected={tab === 'triage'}
                        className={`stack-filter${tab === 'triage' ? ' is-on' : ''}`}
                        onClick={() => (setTab('triage'), playClick())}
                        onMouseEnter={playTick}
                    >
                        Contract triage · RAG
                    </button>
                    <button
                        role="tab"
                        aria-selected={tab === 'trade'}
                        className={`stack-filter${tab === 'trade' ? ' is-on' : ''}`}
                        onClick={() => (setTab('trade'), playClick())}
                        onMouseEnter={playTick}
                    >
                        Trade finance · 9 agents
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {tab === 'triage' ? <Triage /> : <TradeFlow />}
                </motion.div>
            </AnimatePresence>
            <p className="studio-footnote">
                Illustrative walkthrough with sample inputs and scripted outputs — client code and documents stay private.
            </p>
        </section>
    );
}

type Band = 'Green' | 'Amber' | 'Red';
const CLAUSES: { label: string; text: string; band: Band; conf: number; cite: string; why: string }[] = [
    {
        label: 'Payment terms',
        text: 'Invoices are payable within thirty (30) days of receipt of a valid invoice.',
        band: 'Green',
        conf: 0.94,
        cite: '§4.1 Payment',
        why: 'Standard net-30 term; matches playbook position.',
    },
    {
        label: 'Liability cap',
        text: "Supplier's aggregate liability shall not exceed the fees paid in the three (3) months preceding the claim.",
        band: 'Amber',
        conf: 0.81,
        cite: '§11.2 Limitation of liability',
        why: 'Cap below the 12-month playbook minimum.',
    },
    {
        label: 'Auto-renewal',
        text: 'This Agreement renews automatically for successive 36-month terms unless terminated with 180 days notice.',
        band: 'Red',
        conf: 0.9,
        cite: '§2.3 Term & renewal',
        why: 'Long lock-in with a notice window outside policy.',
    },
    {
        label: 'Ambiguous indemnity',
        text: 'Each party shall indemnify the other as reasonably appropriate in the circumstances.',
        band: 'Amber',
        conf: 0.46,
        cite: '§12 Indemnities',
        why: 'Scope undefined — cannot be banded reliably.',
    },
];

const STEPS = ['Chunk & embed', 'Retrieve playbook', 'Band + cite', 'Confidence gate'];

function Triage() {
    const [pick, setPick] = useState(1);
    const [step, setStep] = useState(STEPS.length);
    const timer = useRef<number[]>([]);
    const c = CLAUSES[pick];
    const toHuman = c.conf < 0.6;

    const run = (i: number) => {
        playClick();
        setPick(i);
        setStep(0);
        timer.current.forEach(clearTimeout);
        timer.current = STEPS.map((_, s) => window.setTimeout(() => setStep(s + 1), 380 * (s + 1)));
    };
    useEffect(() => () => timer.current.forEach(clearTimeout), []);
    const done = step >= STEPS.length;

    return (
        <div className="lab-grid">
            <div className="lab-col">
                <div className="mono-label">1 · Pick a clause</div>
                <div className="lab-clauses">
                    {CLAUSES.map((cl, i) => (
                        <button
                            key={cl.label}
                            type="button"
                            className={`lab-clause${pick === i ? ' is-on' : ''}`}
                            onClick={() => run(i)}
                            onMouseEnter={playTick}
                        >
                            <strong>{cl.label}</strong>
                            <span>{cl.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="lab-col">
                <div className="mono-label">2 · Pipeline</div>
                <ol className="lab-steps">
                    {STEPS.map((s, i) => (
                        <li key={s} className={step > i ? 'is-done' : step === i ? 'is-live' : ''}>
                            <span className="lab-step-dot" />
                            {s}
                        </li>
                    ))}
                </ol>

                <div className="mono-label" style={{ marginTop: '1.4rem' }}>
                    3 · Output
                </div>
                <div className={`lab-out band-${c.band.toLowerCase()}${done ? ' is-ready' : ''}`}>
                    {done ? (
                        <>
                            <div className="lab-band">
                                <span className="lab-band-dot" /> {c.band}
                                <span className="lab-conf">confidence {c.conf.toFixed(2)}</span>
                            </div>
                            <pre>{`{
  "band": "${c.band.toLowerCase()}",
  "citation": "${c.cite}",
  "reason": "${c.why}",
  "confidence": ${c.conf},
  "route": "${toHuman ? 'human_review' : 'auto'}"
}`}</pre>
                            {toHuman && (
                                <div className="lab-human">
                                    ⚑ Below 0.60 — routed to a human reviewer instead of failing silently.
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="lab-wait mono-label">running…</div>
                    )}
                </div>
            </div>
        </div>
    );
}

const PHASES = [
    { name: 'Intake', fn: 'Documents in' },
    { name: 'Extraction', fn: 'Fields → JSON' },
    { name: 'Classification', fn: 'Deal & doc types' },
    { name: 'Rule validation', fn: 'Business rules' },
    { name: 'Summarise', fn: 'Brief for approver' },
];

function TradeFlow() {
    const [at, setAt] = useState(-1); // phase index the deal is in
    const [gate, setGate] = useState(false); // waiting at a human approval gate
    const t = useRef<number>(0);

    useEffect(() => () => clearTimeout(t.current), []);

    const advance = (from: number) => {
        const next = from + 1;
        if (next >= PHASES.length) return;
        setAt(next);
        playTick();
        // Human approval gates after validation and before release.
        if (next === 3) {
            t.current = window.setTimeout(() => setGate(true), 700);
            return;
        }
        t.current = window.setTimeout(() => advance(next), 750);
    };

    const start = () => {
        playClick();
        clearTimeout(t.current);
        setGate(false);
        setAt(-1);
        t.current = window.setTimeout(() => advance(-1), 150);
    };

    const approve = () => {
        playClick();
        setGate(false);
        t.current = window.setTimeout(() => advance(3), 300);
    };

    const finished = at === PHASES.length - 1;

    return (
        <div className="trade">
            <div className="trade-track">
                {PHASES.map((p, i) => (
                    <div key={p.name} className="trade-cell">
                        <div className={`trade-phase${at === i ? ' is-live' : at > i ? ' is-done' : ''}`}>
                            <span className="mono-label">0{i + 1}</span>
                            <strong>{p.name}</strong>
                            <span>{p.fn}</span>
                        </div>
                        {i < PHASES.length - 1 && (
                            <div className={`trade-edge${at > i ? ' is-done' : ''}`}>
                                <span className="mono-label trade-schema" title="Strict JSON schema check at this boundary">
                                    {at > i ? '✓' : '{ }'}
                                </span>
                                {i === 2 && <span className="trade-gate-mark" title="Human approval gate">⚑</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="trade-controls">
                <button type="button" className="btn btn-primary" onClick={start} onMouseEnter={playTick}>
                    {at < 0 ? 'Run a sample deal' : 'Run again'} <span aria-hidden>▶</span>
                </button>
                <AnimatePresence>
                    {gate && (
                        <motion.div
                            className="trade-gate"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <span>⚑ Human approval gate — rules passed, awaiting sign-off.</span>
                            <button type="button" className="btn btn-ghost" onClick={approve}>
                                Approve
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {finished && <span className="mono-label trade-done">✓ Summary delivered to approver</span>}
            </div>

            <p className="case-phase-body trade-note">
                Prototype: 9 agents across a 5-phase trade-deal lifecycle, each boundary a strict JSON schema, with human
                approval gates. I learned the domain from scratch and demoed it to the client.
            </p>
        </div>
    );
}
