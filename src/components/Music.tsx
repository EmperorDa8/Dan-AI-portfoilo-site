import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ARTIST, MUSIC_MODEL, TRACKS, type Track } from '../data/music';
import { isSoundEnabled, playClick, playTick, setSoundEnabled } from '../sound';
import { prefersReducedMotion } from '../lib/scroll';

const SRC = (id: string) => `/music/${id}.mp3`;

const clock = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s - m * 60)).padStart(2, '0')}`;
};

/* ------------------------------------------------------------------ *
 * Playback engine
 *
 * One <audio> element owns playback for the whole section, so two tracks
 * can never overlap. The analyser is best-effort: if WebAudio is blocked or
 * createMediaElementSource throws, `analyser` stays null and the canvas falls
 * back to a static bar pattern — the audio itself must never depend on it.
 * ------------------------------------------------------------------ */

type Engine = {
    currentId: string | null;
    playing: boolean;
    time: number;
    duration: number;
    loading: boolean;
    error: string | null;
    analyserRef: React.RefObject<AnalyserNode | null>;
    play: (id: string) => void;
    toggle: () => void;
    seek: (seconds: number) => void;
};

function useAudioEngine(): Engine {
    /* The element is created inside an effect and held in a ref, not in state:
       it is a mutable DOM object, and WebAudio can only ever take one
       MediaElementSource from a given element — so it must be built exactly
       once and never replaced. */
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ctxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const wiredRef = useRef(false);

    const [currentId, setCurrentId] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const el = new Audio();
        el.preload = 'none'; // ~3.5MB a track — nothing is fetched until asked for
        el.crossOrigin = 'anonymous';
        audioRef.current = el;

        const onTime = () => setTime(el.currentTime);
        const onMeta = () => setDuration(el.duration);
        const onPlay = () => {
            setPlaying(true);
            setLoading(false);
        };
        const onPause = () => setPlaying(false);
        const onEnded = () => {
            setPlaying(false);
            setTime(0);
        };
        const onWaiting = () => setLoading(true);
        const onPlaying = () => setLoading(false);
        const onError = () => {
            setLoading(false);
            setPlaying(false);
            setError('That track could not be loaded. Try another, or reload the page.');
        };

        el.addEventListener('timeupdate', onTime);
        el.addEventListener('loadedmetadata', onMeta);
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        el.addEventListener('ended', onEnded);
        el.addEventListener('waiting', onWaiting);
        el.addEventListener('playing', onPlaying);
        el.addEventListener('error', onError);

        return () => {
            el.removeEventListener('timeupdate', onTime);
            el.removeEventListener('loadedmetadata', onMeta);
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onPause);
            el.removeEventListener('ended', onEnded);
            el.removeEventListener('waiting', onWaiting);
            el.removeEventListener('playing', onPlaying);
            el.removeEventListener('error', onError);
            el.pause();
            el.src = '';
            audioRef.current = null;
            void ctxRef.current?.close();
            ctxRef.current = null;
            analyserRef.current = null;
            wiredRef.current = false;
        };
    }, []);

    /** Wire the analyser on the first user gesture; never block playback on it. */
    const ensureGraph = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;
        if (wiredRef.current) {
            void ctxRef.current?.resume();
            return;
        }
        wiredRef.current = true; // set first: a thrown error must not retry forever

        try {
            const Ctor =
                window.AudioContext ??
                (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!Ctor) return;
            const ctx = new Ctor();
            const source = ctx.createMediaElementSource(el);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.78;
            source.connect(analyser);
            analyser.connect(ctx.destination);
            ctxRef.current = ctx;
            analyserRef.current = analyser;
            void ctx.resume();
        } catch {
            // Visualiser unavailable — the <audio> element still plays normally.
            analyserRef.current = null;
        }
    }, []);

    const play = useCallback(
        (id: string) => {
            const el = audioRef.current;
            if (!el) return;
            setError(null);
            ensureGraph();

            if (currentId !== id) {
                setCurrentId(id);
                setTime(0);
                setDuration(0);
                setLoading(true);
                el.src = SRC(id);
                el.load();
            }

            void el.play().catch(() => {
                setLoading(false);
                setPlaying(false);
                setError('Your browser blocked playback — press play again.');
            });
        },
        [currentId, ensureGraph]
    );

    const toggle = useCallback(() => {
        const el = audioRef.current;
        if (!el || !currentId) return;
        if (el.paused) play(currentId);
        else el.pause();
    }, [currentId, play]);

    const seek = useCallback((seconds: number) => {
        const el = audioRef.current;
        if (!el || !Number.isFinite(el.duration)) return;
        el.currentTime = Math.max(0, Math.min(el.duration, seconds));
        setTime(el.currentTime);
    }, []);

    return { currentId, playing, time, duration, loading, error, analyserRef, play, toggle, seek };
}

/* ------------------------------------------------------------------ *
 * Waveform
 * ------------------------------------------------------------------ */

/**
 * Mirrored frequency bars. Draws a calm static pattern when idle so the deck
 * never looks broken or empty, and animates only while something is playing.
 */
function Waveform({
    analyserRef,
    playing,
    progress,
    onScrub,
}: {
    analyserRef: React.RefObject<AnalyserNode | null>;
    playing: boolean;
    progress: number;
    onScrub: (ratio: number) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef(0);
    const drawRef = useRef<(() => void) | null>(null);
    const progressRef = useRef(progress);

    // Declared before the repaint effect below so the ref is current when it runs.
    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduced = prefersReducedMotion();
        const BARS = 72;
        const idle = Array.from({ length: BARS }, (_, i) => 0.18 + Math.abs(Math.sin(i * 0.38)) * 0.26);
        let data: Uint8Array | null = null;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const r = canvas.getBoundingClientRect();
            canvas.width = Math.max(1, Math.floor(r.width * dpr));
            canvas.height = Math.max(1, Math.floor(r.height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        /* Setting canvas.width wipes the bitmap, so a resize that lands after a
           draw would leave the deck blank until the next frame — and while
           paused there is no next frame. Always repaint after resizing. */
        const ro = new ResizeObserver(() => {
            resize();
            drawRef.current?.();
        });
        ro.observe(canvas);

        const draw = () => {
            const r = canvas.getBoundingClientRect();
            const w = r.width;
            const h = r.height;
            ctx.clearRect(0, 0, w, h);

            const analyser = analyserRef.current;
            if (analyser && playing) {
                if (!data || data.length !== analyser.frequencyBinCount) {
                    data = new Uint8Array(analyser.frequencyBinCount);
                }
                analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
            }

            const gap = 2;
            const bw = Math.max(1, w / BARS - gap);
            const mid = h / 2;
            const played = progressRef.current * w;

            for (let i = 0; i < BARS; i++) {
                let v: number;
                if (data && playing) {
                    // Low bins carry most of the energy — sample on a curve so
                    // the top end is not a flat dead strip.
                    const idx = Math.floor(Math.pow(i / BARS, 1.6) * data.length);
                    v = data[idx] / 255;
                    v = Math.max(idle[i] * 0.5, v);
                } else {
                    v = idle[i];
                }

                const bh = Math.max(2, v * (h - 6));
                const x = i * (bw + gap);
                const isPlayed = x + bw <= played;

                ctx.fillStyle = isPlayed ? 'rgba(56, 116, 120, 0.95)' : 'rgba(73, 68, 68, 0.26)';
                ctx.beginPath();
                const rad = Math.min(bw / 2, 2);
                ctx.roundRect(x, mid - bh / 2, bw, bh, rad);
                ctx.fill();
            }

            if (playing && !reduced) rafRef.current = requestAnimationFrame(draw);
        };

        drawRef.current = draw;
        draw();
        return () => {
            cancelAnimationFrame(rafRef.current);
            drawRef.current = null;
            ro.disconnect();
        };
    }, [analyserRef, playing]);

    /* While paused (or under reduced motion) no animation loop is running, so
       seeking would leave a stale progress fill. Repaint once per change. */
    useEffect(() => {
        if (playing && !prefersReducedMotion()) return;
        drawRef.current?.();
    }, [progress, playing]);

    const scrub = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        onScrub(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
    };

    return <canvas ref={canvasRef} className="mus-wave" onClick={scrub} aria-hidden />;
}

/* ------------------------------------------------------------------ *
 * Lyrics
 * ------------------------------------------------------------------ */

/** Splits a lyric line so [stage directions] and (backing vocals) can be styled
 *  differently from the sung words — the whole point of showing the sheet. */
function LyricLine({ text }: { text: string }) {
    const parts = useMemo(() => text.split(/(\[[^\]]*\]|\([^)]*\))/g).filter(Boolean), [text]);
    return (
        <span className="mus-line">
            {parts.map((part, i) => {
                if (part.startsWith('[')) return <em key={i} className="mus-cue">{part}</em>;
                if (part.startsWith('(')) return <span key={i} className="mus-backing">{part}</span>;
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}

/* ------------------------------------------------------------------ *
 * Section
 * ------------------------------------------------------------------ */

export function Music() {
    const engine = useAudioEngine();
    const { currentId, playing, time, duration, loading, error, analyserRef, play, toggle, seek } = engine;

    const [selectedId, setSelectedId] = useState<string>(TRACKS[0].id);
    const selected = useMemo(() => TRACKS.find(t => t.id === selectedId) ?? TRACKS[0], [selectedId]);
    const nowPlaying = useMemo(() => TRACKS.find(t => t.id === currentId) ?? null, [currentId]);

    const sheetRef = useRef<HTMLDivElement>(null);

    /* UI click/tick sounds would fire straight over the music. Mute them while
       a track plays and restore whatever the visitor had set afterwards. */
    const restoreRef = useRef<boolean | null>(null);
    useEffect(() => {
        if (playing) {
            if (restoreRef.current === null) {
                restoreRef.current = isSoundEnabled();
                if (restoreRef.current) setSoundEnabled(false);
            }
        } else if (restoreRef.current !== null) {
            if (restoreRef.current) setSoundEnabled(true);
            restoreRef.current = null;
        }
    }, [playing]);

    const onPick = (t: Track) => {
        setSelectedId(t.id);
        if (currentId === t.id) toggle();
        else play(t.id);
    };

    /** Scroll the sheet panel itself — never the page, which Lenis owns. */
    const jumpToSection = (index: number) => {
        const panel = sheetRef.current;
        const target = panel?.querySelector<HTMLElement>(`[data-sec="${index}"]`);
        if (!panel || !target) return;
        panel.scrollTo({ top: target.offsetTop - panel.offsetTop - 8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };

    const progress = duration > 0 ? time / duration : 0;
    const deckTrack = nowPlaying ?? selected;
    const isDeckPlaying = playing && currentId === deckTrack.id;

    return (
        <section className="music-section" id="music">
            <div className="section-head">
                <div>
                    <div className="case-badge live">
                        <span className="pulse-dot" /> {TRACKS.length} original tracks · {ARTIST}
                    </div>
                    <h2 className="section-title">
                        I write the words. <em>The model sings them.</em>
                    </h2>
                    <p className="case-lead">
                        Lyrics, song structure and every arrangement direction below are mine — written out as a brief, the
                        same way I spec software. {MUSIC_MODEL} performs them. Press play and read along: the{' '}
                        <em className="mus-cue-inline">[bracketed lines]</em> are the direction I gave it.
                    </p>
                </div>
                <div className="case-meta-block mono-label">
                    <span>Written &amp; directed</span>
                    <strong>Dan Usman</strong>
                    <span>Performed by</span>
                    <strong>{MUSIC_MODEL}</strong>
                    <span>Languages</span>
                    <strong>English · Pidgin · French</strong>
                </div>
            </div>

            {/* ---- Deck ---- */}
            <div className={`mus-deck${isDeckPlaying ? ' is-playing' : ''}`}>
                <button
                    type="button"
                    className="mus-play"
                    onClick={() => (currentId === deckTrack.id ? toggle() : play(deckTrack.id))}
                    aria-label={isDeckPlaying ? `Pause ${deckTrack.title}` : `Play ${deckTrack.title}`}
                >
                    {loading && currentId === deckTrack.id ? (
                        <span className="mus-spinner" aria-hidden />
                    ) : isDeckPlaying ? (
                        <svg viewBox="0 0 24 24" aria-hidden width="26" height="26">
                            <rect x="6" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
                            <rect x="14" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" aria-hidden width="26" height="26">
                            <path d="M8 5.2v13.6c0 .9 1 1.4 1.7.9l10.1-6.8a1.1 1.1 0 000-1.8L9.7 4.3A1.1 1.1 0 008 5.2z" fill="currentColor" />
                        </svg>
                    )}
                </button>

                <div className="mus-deck-main">
                    <div className="mus-deck-head">
                        <h3 className="mus-deck-title">{deckTrack.title}</h3>
                        <span className="mono-label mus-deck-meta">
                            {deckTrack.genre} · {deckTrack.language}
                        </span>
                    </div>

                    <Waveform
                        analyserRef={analyserRef}
                        playing={isDeckPlaying}
                        progress={currentId === deckTrack.id ? progress : 0}
                        onScrub={ratio => seek(ratio * (duration || deckTrack.duration))}
                    />

                    <div className="mus-transport">
                        <span className="mono-label mus-time">{clock(currentId === deckTrack.id ? time : 0)}</span>
                        <input
                            type="range"
                            className="mus-range"
                            min={0}
                            max={duration || deckTrack.duration}
                            step={0.5}
                            value={currentId === deckTrack.id ? time : 0}
                            onChange={e => seek(Number(e.target.value))}
                            aria-label={`Seek within ${deckTrack.title}`}
                        />
                        <span className="mono-label mus-time">{clock(duration || deckTrack.duration)}</span>
                    </div>

                    <p className="mus-status" role="status" aria-live="polite">
                        {error
                            ? error
                            : isDeckPlaying
                              ? `Now playing — ${deckTrack.title}`
                              : deckTrack.note}
                    </p>
                </div>
            </div>

            {/* ---- Tracks + sheet ---- */}
            <div className="mus-body">
                <ol className="mus-list">
                    {TRACKS.map((t, i) => {
                        const isCurrent = currentId === t.id;
                        return (
                            <li key={t.id}>
                                <button
                                    type="button"
                                    className={`mus-row${selectedId === t.id ? ' is-selected' : ''}${isCurrent && playing ? ' is-playing' : ''}`}
                                    onClick={() => onPick(t)}
                                    onMouseEnter={playing ? undefined : playTick}
                                    aria-pressed={selectedId === t.id}
                                >
                                    <span className="mus-row-n mono-label" aria-hidden>
                                        {isCurrent && playing ? (
                                            <span className="mus-eq" aria-hidden>
                                                <i /><i /><i />
                                            </span>
                                        ) : (
                                            String(i + 1).padStart(2, '0')
                                        )}
                                    </span>
                                    <span className="mus-row-main">
                                        <span className="mus-row-title">{t.title}</span>
                                        <span className="mus-row-note">{t.note}</span>
                                    </span>
                                    <span className="mus-row-tags mono-label">
                                        <span className="mus-tag">{t.genre}</span>
                                        <span className="mus-tag ghost">{t.language}</span>
                                    </span>
                                    <span className="mus-row-dur mono-label">{clock(t.duration)}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <div className="mus-sheet-wrap">
                    <div className="mus-sheet-head">
                        <div>
                            <div className="mono-label">Lyric sheet &amp; direction</div>
                            <h3 className="mus-sheet-title">{selected.title}</h3>
                        </div>
                        {currentId !== selected.id && (
                            <button
                                type="button"
                                className="mus-sheet-play"
                                onClick={() => {
                                    play(selected.id);
                                    playClick();
                                }}
                            >
                                Play this ▸
                            </button>
                        )}
                    </div>

                    <div className="mus-struct" role="list" aria-label={`Structure of ${selected.title}`}>
                        {selected.sections.map((s, i) => (
                            <button
                                key={`${s.label}-${i}`}
                                type="button"
                                role="listitem"
                                className="mus-struct-chip"
                                onClick={() => jumpToSection(i)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected.id}
                            ref={sheetRef}
                            className="mus-sheet"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {selected.sections.map((s, i) => (
                                <div className="mus-sec" data-sec={i} key={`${s.label}-${i}`}>
                                    <div className="mus-sec-label mono-label">{s.label}</div>
                                    {s.direction && <p className="mus-direction">{s.direction}</p>}
                                    {s.lines.map((line, j) => (
                                        <LyricLine key={j} text={line} />
                                    ))}
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
