import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCTS, type Product } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';
import { playClick, playTick } from '../sound';

const FILTERS = ['All', 'AI', 'Agents', 'Full-stack', 'Extension', 'Client'] as const;
type Filter = (typeof FILTERS)[number];

const GH_PATH =
    'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';

/**
 * Shipped products — only what the CV lists and a reviewer can open.
 * Filterable; cards tilt toward the pointer and a promo loop plays on hover
 * where one exists.
 */
export function Products() {
    const [filter, setFilter] = useState<Filter>('All');
    const list = useMemo(
        () => (filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.tags.includes(filter as Product['tags'][number]))),
        [filter]
    );

    return (
        <section className="featured-section" id="work">
            <div className="section-head">
                <div>
                    <h2 className="section-title">
                        Shipped <em>products.</em>
                    </h2>
                    <p className="case-lead">
                        Every item here is live, launched or in a public repo — open any of them. Older unverifiable
                        prototypes have been retired.
                    </p>
                </div>
                <span className="mono-label">/ {PRODUCTS.length} products · all verifiable</span>
            </div>

            <div className="stack-filters studio-filters" role="tablist" aria-label="Filter products">
                {FILTERS.map(f => {
                    const n = f === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.tags.includes(f as Product['tags'][number])).length;
                    return (
                        <button
                            key={f}
                            type="button"
                            role="tab"
                            aria-selected={filter === f}
                            className={`stack-filter${filter === f ? ' is-on' : ''}`}
                            onClick={() => {
                                setFilter(f);
                                playClick();
                            }}
                            onMouseEnter={playTick}
                        >
                            {f} <span className="stack-filter-n">{n}</span>
                        </button>
                    );
                })}
            </div>

            <motion.div layout className="product-grid">
                <AnimatePresence mode="popLayout">
                    {list.map((p, i) => (
                        <ProductCard key={p.id} p={p} i={i} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
    const frame = useRef(0);
    const vid = useRef<HTMLVideoElement>(null);
    const primary = p.href ?? p.github;

    const tilt = (e: React.PointerEvent<HTMLElement>) => {
        if (prefersReducedMotion() || e.pointerType !== 'mouse') return;
        const el = e.currentTarget;
        const { clientX: x, clientY: y } = e;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            const px = (x - r.left) / r.width;
            const py = (y - r.top) / r.height;
            el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
            el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
            el.style.setProperty('--ry', `${((px - 0.5) * 8).toFixed(2)}deg`);
            el.style.setProperty('--rx', `${((0.5 - py) * 6).toFixed(2)}deg`);
        });
    };
    const untilt = (e: React.PointerEvent<HTMLElement>) => {
        cancelAnimationFrame(frame.current);
        e.currentTarget.style.setProperty('--rx', '0deg');
        e.currentTarget.style.setProperty('--ry', '0deg');
        vid.current?.pause();
    };

    return (
        <motion.article
            layout
            className={`product-card${p.id === 'xamio' ? ' is-lead' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            onPointerMove={tilt}
            onPointerLeave={untilt}
            onMouseEnter={() => {
                playTick();
                if (vid.current && !prefersReducedMotion()) void vid.current.play().catch(() => {});
            }}
        >
            <a href={primary} target="_blank" rel="noopener noreferrer" className="product-media" tabIndex={-1} aria-hidden>
                {p.img ? (
                    <img src={p.img} alt="" loading="lazy" decoding="async" />
                ) : (
                    <div className="product-placeholder">
                        <span className="product-mono">{p.name.slice(0, 2)}</span>
                        <code>{p.stack.slice(0, 3).join(' · ')}</code>
                    </div>
                )}
                {p.video && <video ref={vid} src={p.video} muted loop playsInline preload="none" />}
                <span className="proj-sheen" aria-hidden />
            </a>

            <div className="product-body">
                <div className="product-top">
                    <span className={`status-pill is-${p.status.toLowerCase().replace(' ', '-')}`}>
                        <span className="pulse-dot" /> {p.status}
                    </span>
                    <span className="mono-label">{p.kind}</span>
                </div>
                <h3 className="product-name">
                    <a href={primary} target="_blank" rel="noopener noreferrer">
                        {p.name} <span aria-hidden>↗</span>
                    </a>
                </h3>
                <p className="product-blurb">{p.blurb}</p>
                <div className="product-stack">
                    {p.stack.map(s => (
                        <span key={s} className="case-tag">
                            {s}
                        </span>
                    ))}
                </div>
                <div className="product-links">
                    {p.href && (
                        <a href={p.href} target="_blank" rel="noopener noreferrer" onClick={playClick}>
                            Open live ↗
                        </a>
                    )}
                    {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={playClick}>
                            <svg height="14" width="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                <path d={GH_PATH} />
                            </svg>
                            Source
                        </a>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
