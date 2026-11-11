import type { CSSProperties, ReactNode } from 'react';
import { useSectionProgress } from '../lib/sectionProgress';

/**
 * One desk, three jobs.
 *
 * Nine real artefacts start scattered across the stage and, as the section
 * scrolls, file themselves into three columns — one per title. The finished
 * layout is an ordinary grid; "scattered" is only an offset from it, scaled by
 * scroll progress. So with no JavaScript, on a phone, or under reduced motion,
 * what renders is simply the sorted grid.
 *
 * Scatter offsets are in column widths (~31vw) and row heights (~17vh): each
 * card is thrown to a different cell of the same 3x3 grid, so the desk begins
 * spread across the whole stage with the three kinds of work mixed together,
 * rather than heaped in the middle.
 *
 * Nothing here is a mock-up: the code is from this repository, the JSON is the
 * shape the contract-triage demo returns further down the page, the lyric and
 * its direction are from the track's own sheet, and the frames are from the
 * finished pieces.
 */

type Scatter = { x: number; y: number; r: number };

type Card = { key: string; file: string; scatter: Scatter; body: ReactNode; kind: 'code' | 'image' | 'note' };

const img = (src: string, alt: string) => <img src={src} alt={alt} decoding="async" />;

const COLUMNS: { title: string; role: string; cards: Card[] }[] = [
    {
        title: 'Engineer',
        role: 'AI Product Engineer',
        cards: [
            {
                key: 'fx',
                kind: 'code',
                file: 'src/lib/scrollFx.ts',
                scatter: { x: 31, y: 33, r: -6 },
                body: (
                    <pre>{`const target = clamp(
  scrollState.velocity / VELOCITY_FULL_SCALE,
  -1, 1);
damped += (target - damped)
  * (1 - Math.exp(-DAMPING * dt));`}</pre>
                ),
            },
            {
                key: 'xamio',
                kind: 'image',
                file: 'xamio.app · Product Hunt launch',
                scatter: { x: 60, y: -18, r: 5 },
                body: img('/xamio_thumbnail.webp', 'Xamio app'),
            },
            {
                key: 'triage',
                kind: 'code',
                file: 'contract-triage · response',
                scatter: { x: 29, y: -35, r: 8 },
                body: (
                    <pre>{`{
  "band": "amber",
  "confidence": 0.46,
  "route": "human_review"
}`}</pre>
                ),
            },
        ],
    },
    {
        title: 'Video',
        role: 'AI Video Creator',
        cards: [
            {
                key: 'ctrlz',
                kind: 'image',
                file: 'ctrl-z.mp4 · client: Ziafam',
                scatter: { x: -32, y: 18, r: 7 },
                body: img('/studio/mg-ctrl-z.webp', 'Ctrl+Z motion graphic'),
            },
            {
                key: 'king',
                kind: 'image',
                file: 'battle-weary-king.mp4',
                scatter: { x: 30, y: 16, r: -5 },
                body: img('/studio/king.webp', 'The battle-weary king'),
            },
            {
                key: 'gowell-video',
                kind: 'image',
                file: 'go-well-video.mp4',
                scatter: { x: -29, y: -33, r: -8 },
                body: img('/music/go-well-video.webp', 'Go Well music video'),
            },
        ],
    },
    {
        title: 'Creative',
        role: 'AI Creative Specialist',
        cards: [
            {
                key: 'lyric',
                kind: 'note',
                file: 'go-well · lyric sheet',
                scatter: { x: -31, y: 19, r: 5 },
                body: (
                    <p>
                        <em>[Sub bass and one dry guitar lick only. Centred, no drums.]</em>
                        <span>I don learn to light myself.</span>
                    </p>
                ),
            },
            {
                key: 'track',
                kind: 'note',
                file: 'one-more-day.mp3 · 3:02',
                scatter: { x: -62, y: 15, r: -7 },
                body: (
                    <p>
                        <span className="desk-bars" aria-hidden>
                            {Array.from({ length: 22 }, (_, i) => (
                                <i key={i} style={{ height: `${28 + Math.abs(Math.sin(i * 0.9)) * 62}%` }} />
                            ))}
                        </span>
                        <span>Written and directed. Soul, raw take.</span>
                    </p>
                ),
            },
            {
                key: 'pilot',
                kind: 'image',
                file: 'pilot-departures.png',
                scatter: { x: 2, y: -19, r: 9 },
                body: img('/studio/pilot.webp', 'Pilot, departures'),
            },
        ],
    },
];

export function Desk() {
    const ref = useSectionProgress<HTMLElement>({ lateAt: 0.6 });

    return (
        <section className="desk" id="desk" ref={ref} aria-label="One desk, three jobs">
            <div className="desk-stage">
                <header className="desk-head">
                    <h2 className="desk-title">
                        One desk. <em>Three jobs.</em>
                    </h2>
                    <p className="desk-sub">
                        Real files from my work, filed the way I&apos;d file them. Keep scrolling and they sort themselves.
                    </p>
                </header>

                <div className="desk-grid">
                    {COLUMNS.map(col => (
                        <div className="desk-col" key={col.title}>
                            <div className="desk-label">
                                <span className="desk-label-title">{col.title}</span>
                                <span className="mono-label">{col.role}</span>
                            </div>
                            {col.cards.map((card, row) => (
                                <figure
                                    key={card.key}
                                    className={`desk-card is-${card.kind}`}
                                    style={
                                        {
                                            '--sx': `${card.scatter.x}vw`,
                                            '--sy': `${card.scatter.y}vh`,
                                            '--sr': `${card.scatter.r}deg`,
                                            // Filing order: left to right, top to bottom.
                                            '--i': COLUMNS.indexOf(col) + row * 3,
                                        } as CSSProperties
                                    }
                                >
                                    <div className="desk-card-body">{card.body}</div>
                                    <figcaption className="mono-label">{card.file}</figcaption>
                                </figure>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
