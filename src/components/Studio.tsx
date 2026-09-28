import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DRIVE_FOLDER, MARBLE_WORLDS, STUDIO, type StudioCat, type StudioItem } from '../data/studio';
import { playClick, playTick } from '../sound';
import { getLenis, prefersReducedMotion } from '../lib/scroll';

const FILTERS: ('All' | StudioCat)[] = ['All', 'Spec ads', 'Cinematic', 'Characters', 'Product', 'Images'];

const poster = (it: StudioItem) => `/studio/${it.id}.webp`;
const clip = (it: StudioItem) => `/studio/${it.id}.mp4`;

/**
 * AI content studio. Tiles show a still until hovered (or scrolled into the
 * middle of the screen on touch), then play a muted loop; clicking opens a
 * lightbox with sound. Videos are never fetched until they are asked for.
 */
export function Studio() {
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
    const [open, setOpen] = useState<number | null>(null);

    const items = useMemo(() => (filter === 'All' ? STUDIO : STUDIO.filter(s => s.cat === filter)), [filter]);
    const counts = useMemo(() => {
        const c: Record<string, number> = { All: STUDIO.length };
        STUDIO.forEach(s => (c[s.cat] = (c[s.cat] ?? 0) + 1));
        return c;
    }, []);
    const videoCount = STUDIO.filter(s => s.kind === 'video').length;

    return (
        <section className="studio-section" id="studio">
            <div className="section-head">
                <div>
                    <h2 className="section-title">
                        AI Video Creator — <em>images &amp; video.</em>
                    </h2>
                    <p className="case-lead">
                        {videoCount} generated videos and a set of image work: spec ads, cinematic shots and consistent
                        characters. Same discipline as the software — structured prompts, reference frames, iterate until it
                        holds up.
                    </p>
                </div>
                <div className="case-meta-block mono-label">
                    <span>Models</span>
                    <strong>Veo 3 · Kling · Nano Banana</strong>
                    <span>Also</span>
                    <strong>ElevenLabs · Higgsfield · Marble</strong>
                </div>
            </div>

            <div className="stack-filters studio-filters" role="tablist" aria-label="Filter studio work">
                {FILTERS.map(f => (
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
                        {f} <span className="stack-filter-n">{counts[f] ?? 0}</span>
                    </button>
                ))}
            </div>

            <motion.div layout className="studio-grid">
                <AnimatePresence mode="popLayout">
                    {items.map((it, i) => (
                        <StudioTile key={it.id} item={it} onOpen={() => setOpen(i)} />
                    ))}
                </AnimatePresence>
            </motion.div>

            <BeforeAfter />

            <div className="studio-worlds">
                <div>
                    <div className="mono-label">3D · World Labs Marble</div>
                    <p className="studio-worlds-copy">
                        {MARBLE_WORLDS.length} explorable generated worlds — walk around inside them in the browser.
                    </p>
                </div>
                <div className="work-row-chips">
                    {MARBLE_WORLDS.map((id, idx) => (
                        <a
                            key={id}
                            href={`https://marble.worldlabs.ai/world/${id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sim-chip"
                            onMouseEnter={playTick}
                        >
                            WORLD_0{idx + 1} ↗
                        </a>
                    ))}
                </div>
            </div>

            <p className="studio-footnote">
                Brand-style pieces are self-initiated spec work, not commissioned by or affiliated with those brands.{' '}
                <a href={DRIVE_FOLDER} target="_blank" rel="noopener noreferrer">
                    Full-resolution originals on Drive ↗
                </a>
            </p>

            <AnimatePresence>
                {open !== null && (
                    <Lightbox items={items} index={open} setIndex={setOpen} onClose={() => setOpen(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}

function StudioTile({ item, onOpen }: { item: StudioItem; onOpen: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [armed, setArmed] = useState(false); // src attached only once wanted
    const [want, setWant] = useState(false);
    const [playing, setPlaying] = useState(false);

    const play = useCallback(() => {
        if (item.kind !== 'video' || prefersReducedMotion()) return;
        setArmed(true);
        setWant(true);
    }, [item.kind]);

    const stop = useCallback(() => setWant(false), []);

    // Runs after commit, so the <video> exists by the time we call play().
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        if (want) void v.play().catch(() => {});
        else v.pause();
    }, [want, armed]);

    /* Touch screens have no hover: play whichever tile sits in the middle band. */
    useEffect(() => {
        if (item.kind !== 'video' || window.matchMedia('(hover: hover)').matches) return;
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), {
            rootMargin: '-40% 0px -40% 0px',
        });
        io.observe(el);
        return () => io.disconnect();
    }, [item.kind, play, stop]);

    return (
        <motion.button
            layout
            ref={ref}
            type="button"
            className={`studio-tile is-${item.shape}${playing ? ' is-playing' : ''}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => {
                playTick();
                play();
            }}
            onMouseLeave={stop}
            onFocus={play}
            onBlur={stop}
            onClick={() => {
                playClick();
                onOpen();
            }}
            aria-label={`${item.title} — ${item.model}. Open ${item.kind}.`}
        >
            <img src={poster(item)} alt="" loading="lazy" decoding="async" />
            {item.kind === 'video' && armed && (
                <video
                    ref={videoRef}
                    src={clip(item)}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden
                    onPlaying={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                />
            )}
            <span className="studio-badge mono-label">{item.model}</span>
            {item.kind === 'video' && (
                <span className="studio-play" aria-hidden>
                    {playing ? '■' : '▶'}
                </span>
            )}
            <span className="studio-cap">
                <span className="studio-title">{item.title}</span>
                <span className="studio-cat mono-label">{item.cat}</span>
            </span>
        </motion.button>
    );
}

function Lightbox({
    items,
    index,
    setIndex,
    onClose,
}: {
    items: StudioItem[];
    index: number;
    setIndex: (i: number) => void;
    onClose: () => void;
}) {
    const it = items[index];
    const closeRef = useRef<HTMLButtonElement>(null);
    const go = useCallback(
        (d: number) => {
            playTick();
            setIndex((index + d + items.length) % items.length);
        },
        [index, items.length, setIndex]
    );

    useEffect(() => {
        const prev = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowRight') go(1);
            else if (e.key === 'ArrowLeft') go(-1);
        };
        window.addEventListener('keydown', onKey);
        getLenis()?.stop();
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            getLenis()?.start();
            document.body.style.overflow = '';
            prev?.focus?.();
        };
    }, [go, onClose]);

    return (
        <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={it.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-lenis-prevent
        >
            <motion.figure
                key={it.id}
                className={`lightbox-figure is-${it.shape}`}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
            >
                {it.kind === 'video' ? (
                    <video src={clip(it)} poster={poster(it)} controls autoPlay playsInline loop />
                ) : (
                    <img src={poster(it)} alt={it.title} />
                )}
                <figcaption>
                    <div>
                        <div className="lightbox-title">{it.title}</div>
                        <p className="lightbox-note">{it.note}</p>
                    </div>
                    <div className="lightbox-meta mono-label">
                        <span>{it.model}</span>
                        <span>{it.cat}</span>
                        <span>
                            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                        </span>
                    </div>
                </figcaption>
            </motion.figure>

            <button type="button" className="lightbox-btn is-prev" onClick={e => (e.stopPropagation(), go(-1))} aria-label="Previous">
                ←
            </button>
            <button type="button" className="lightbox-btn is-next" onClick={e => (e.stopPropagation(), go(1))} aria-label="Next">
                →
            </button>
            <button ref={closeRef} type="button" className="lightbox-btn is-close" onClick={onClose} aria-label="Close">
                ✕
            </button>
        </motion.div>
    );
}

/** Drag to compare: a plain product photo, and the AI-generated infographic made from it. */
function BeforeAfter() {
    const [pos, setPos] = useState(50);
    return (
        <div className="ba-wrap">
            <div className="ba-copy">
                <div className="mono-label">Before → after · drag</div>
                <h3 className="case-phase-title">One product photo in, a listing-ready infographic out.</h3>
                <p className="case-phase-body">
                    E-commerce asset test: a single 500px supplier shot turned into a set-up guide infographic with the
                    product kept pixel-faithful — the kind of image a seller would otherwise commission.
                </p>
            </div>
            <div className="ba-stage" style={{ '--ba': `${pos}%` } as React.CSSProperties}>
                <img src="/studio/after1.webp" alt="AI-generated webcam setup infographic" loading="lazy" />
                <div className="ba-before">
                    <img src="/studio/before.webp" alt="Original plain webcam product photo" loading="lazy" />
                </div>
                <span className="ba-line" aria-hidden />
                <span className="ba-tag is-l mono-label">Before</span>
                <span className="ba-tag is-r mono-label">After</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={pos}
                    onChange={e => setPos(Number(e.target.value))}
                    aria-label="Compare before and after"
                />
            </div>
        </div>
    );
}
