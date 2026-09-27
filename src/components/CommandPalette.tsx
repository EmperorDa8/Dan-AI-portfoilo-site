import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CV_URL, EMAIL, GITHUB, LINKEDIN, PRODUCTS } from '../data/profile';
import { getLenis } from '../lib/scroll';
import { OPEN_PALETTE } from '../lib/palette';
import { playClick, playTick } from '../sound';

type Cmd = { id: string; label: string; group: string; hint?: string; run: () => void };

const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -40 });
    else el.scrollIntoView({ behavior: 'smooth' });
};

/** ⌘K / Ctrl+K — jump anywhere, open any product, grab the CV or email. */
export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const [sel, setSel] = useState(0);
    const [toast, setToast] = useState('');
    const input = useRef<HTMLInputElement>(null);
    const openRef = useRef(open);
    useEffect(() => {
        openRef.current = open;
    }, [open]);

    const cmds: Cmd[] = useMemo(
        () => [
            { id: 's-work', group: 'Go to', label: 'Shipped products', run: () => jump('work') },
            { id: 's-systems', group: 'Go to', label: 'Client AI systems — try the demos', run: () => jump('systems') },
            { id: 's-studio', group: 'Go to', label: 'AI Studio — images & video', run: () => jump('studio') },
            { id: 's-stack', group: 'Go to', label: 'Tech stack', run: () => jump('stack') },
            { id: 's-exp', group: 'Go to', label: 'Experience & credentials', run: () => jump('credentials') },
            { id: 's-contact', group: 'Go to', label: 'Contact / hire me', run: () => jump('contact') },
            ...PRODUCTS.map(p => ({
                id: `p-${p.id}`,
                group: 'Open product',
                label: p.name,
                hint: p.kind,
                run: () => window.open(p.href ?? p.github, '_blank', 'noopener'),
            })),
            {
                id: 'a-cv',
                group: 'Actions',
                label: 'Download CV (PDF)',
                run: () => {
                    const a = document.createElement('a');
                    a.href = CV_URL;
                    a.download = '';
                    a.click();
                },
            },
            {
                id: 'a-email',
                group: 'Actions',
                label: 'Copy email address',
                hint: EMAIL,
                run: () => {
                    void navigator.clipboard?.writeText(EMAIL).then(() => {
                        setToast('Email copied');
                        window.setTimeout(() => setToast(''), 1800);
                    });
                },
            },
            { id: 'a-gh', group: 'Actions', label: 'GitHub', run: () => window.open(GITHUB, '_blank', 'noopener') },
            { id: 'a-li', group: 'Actions', label: 'LinkedIn', run: () => window.open(LINKEDIN, '_blank', 'noopener') },
        ],
        []
    );

    const results = useMemo(() => {
        const t = q.trim().toLowerCase();
        if (!t) return cmds;
        return cmds.filter(c => `${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase().includes(t));
    }, [q, cmds]);

    useEffect(() => {
        // Reset the query as part of opening, not in a follow-up effect.
        const show = () => {
            setQ('');
            setSel(0);
            setOpen(true);
            playTick();
        };
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (openRef.current) setOpen(false);
                else show();
            } else if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener(OPEN_PALETTE, show);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener(OPEN_PALETTE, show);
        };
    }, []);

    useEffect(() => {
        if (open) requestAnimationFrame(() => input.current?.focus());
    }, [open]);

    const exec = (c: Cmd | undefined) => {
        if (!c) return;
        playClick();
        setOpen(false);
        c.run();
    };

    let lastGroup = '';

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="cmdk-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        data-lenis-prevent
                    >
                        <motion.div
                            className="cmdk"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Command menu"
                            initial={{ opacity: 0, y: -16, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            onClick={e => e.stopPropagation()}
                        >
                            <input
                                ref={input}
                                className="cmdk-input"
                                placeholder="Search products, sections, actions…"
                                value={q}
                                onChange={e => {
                                    setQ(e.target.value);
                                    setSel(0);
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setSel(s => Math.min(s + 1, results.length - 1));
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setSel(s => Math.max(s - 1, 0));
                                    } else if (e.key === 'Enter') exec(results[sel]);
                                }}
                                role="combobox"
                                aria-expanded="true"
                                aria-controls="cmdk-list"
                                aria-activedescendant={results[sel] ? `cmdk-${results[sel].id}` : undefined}
                            />
                            <ul className="cmdk-list" id="cmdk-list" role="listbox">
                                {results.length === 0 && <li className="cmdk-empty">No matches.</li>}
                                {results.map((c, i) => {
                                    const head = c.group !== lastGroup ? c.group : null;
                                    lastGroup = c.group;
                                    return (
                                        <li key={c.id} role="presentation">
                                            {head && <div className="cmdk-group mono-label">{head}</div>}
                                            <div
                                                id={`cmdk-${c.id}`}
                                                role="option"
                                                aria-selected={i === sel}
                                                className={`cmdk-item${i === sel ? ' is-sel' : ''}`}
                                                onMouseMove={() => setSel(i)}
                                                onClick={() => exec(c)}
                                            >
                                                <span>{c.label}</span>
                                                {c.hint && <span className="cmdk-hint">{c.hint}</span>}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="cmdk-foot mono-label">
                                <span>↑↓ move</span>
                                <span>↵ open</span>
                                <span>esc close</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {toast && (
                    <motion.div className="toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
