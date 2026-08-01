import { useRef, useState } from 'react';
import { gsap, prefersReducedMotion, revealElement, useGsapScope } from '../lib/scroll';
import { playClick, playTick } from '../sound';

type Cat = 'AI-native' | 'Frontend' | 'Backend & data' | 'Ship';

type Tool = {
    name: string;
    cat: Cat;
    /** Reached for daily, versus used when the job calls for it. */
    daily?: boolean;
    /** simpleicons slug. Omit where no icon exists — a monogram is drawn instead. */
    slug?: string;
};

/* Verified against cdn.simpleicons.org: `openai` and `lovable` 404, so those
   two carry no slug and fall back to a monogram rather than a broken image. */
const TOOLS: Tool[] = [
    { name: 'Claude Code', cat: 'AI-native', slug: 'claude', daily: true },
    { name: 'Cursor', cat: 'AI-native', slug: 'cursor', daily: true },
    { name: 'OpenAI', cat: 'AI-native' },
    { name: 'Gemini', cat: 'AI-native', slug: 'googlegemini' },
    { name: 'ElevenLabs', cat: 'AI-native', slug: 'elevenlabs' },
    { name: 'Lovable', cat: 'AI-native' },
    { name: 'n8n', cat: 'AI-native', slug: 'n8n', daily: true },

    { name: 'React', cat: 'Frontend', slug: 'react', daily: true },
    { name: 'Next.js', cat: 'Frontend', slug: 'nextdotjs', daily: true },
    { name: 'TypeScript', cat: 'Frontend', slug: 'typescript', daily: true },
    { name: 'Tailwind', cat: 'Frontend', slug: 'tailwindcss', daily: true },
    { name: 'Vite', cat: 'Frontend', slug: 'vite' },
    { name: 'Framer Motion', cat: 'Frontend', slug: 'framer' },

    { name: 'Node.js', cat: 'Backend & data', slug: 'nodedotjs', daily: true },
    { name: 'Python', cat: 'Backend & data', slug: 'python', daily: true },
    { name: 'FastAPI', cat: 'Backend & data', slug: 'fastapi' },
    { name: 'PostgreSQL', cat: 'Backend & data', slug: 'postgresql' },
    { name: 'Supabase', cat: 'Backend & data', slug: 'supabase', daily: true },

    { name: 'Git', cat: 'Ship', slug: 'git', daily: true },
    { name: 'GitHub', cat: 'Ship', slug: 'github', daily: true },
    { name: 'Vercel', cat: 'Ship', slug: 'vercel', daily: true },
    { name: 'Netlify', cat: 'Ship', slug: 'netlify' },
    { name: 'Docker', cat: 'Ship', slug: 'docker' },
];

const CATS: Cat[] = ['AI-native', 'Frontend', 'Backend & data', 'Ship'];

function monogram(name: string) {
    const cleaned = name.replace(/[^A-Za-z0-9]/g, '');
    return cleaned.slice(0, 2).toUpperCase();
}

function ToolMark({ tool }: { tool: Tool }) {
    const [failed, setFailed] = useState(false);
    if (!tool.slug || failed) {
        return (
            <span className="stack-monogram" aria-hidden>
                {monogram(tool.name)}
            </span>
        );
    }
    return (
        <img
            className="stack-logo"
            src={`https://cdn.simpleicons.org/${tool.slug}`}
            alt=""
            aria-hidden
            width={30}
            height={30}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
        />
    );
}

/**
 * The stack, made scannable and alive.
 *
 * Recruiters filter on tooling keywords, so this sits early and states depth
 * (daily driver vs. used when needed) rather than dumping an undifferentiated
 * logo wall. Filtering re-flows the grid with a hand-rolled FLIP so tiles glide
 * to their new positions instead of snapping.
 */
export function TechStack() {
    const [filter, setFilter] = useState<Cat | 'All'>('All');
    const gridRef = useRef<HTMLUListElement>(null);
    const raf = useRef(0);

    const scopeRef = useGsapScope<HTMLElement>(({ scope }) => {
        const tiles = gsap.utils.toArray<HTMLElement>('.stack-tile', scope);
        tiles.forEach((tile, i) => {
            // Wave stagger across columns rather than a flat top-to-bottom sweep.
            revealElement(tile, { y: 26, delay: (i % 6) * 0.05 + Math.floor(i / 6) * 0.04, start: 'top 92%' });
        });

        if (prefersReducedMotion()) return;

        // Count the totals up as the section arrives.
        scope.querySelectorAll<HTMLElement>('[data-countto]').forEach(el => {
            const to = Number(el.dataset.countto ?? 0);
            const obj = { v: 0 };
            gsap.to(obj, {
                v: to,
                duration: 1.1,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 92%', once: true },
                onUpdate: () => {
                    el.textContent = String(Math.round(obj.v));
                },
            });
        });
    }, []);

    /** FLIP: measure, mutate, measure, then animate the delta to zero. */
    const applyFilter = (next: Cat | 'All') => {
        playClick();
        const grid = gridRef.current;
        if (!grid || prefersReducedMotion()) {
            setFilter(next);
            return;
        }

        const tiles = Array.from(grid.querySelectorAll<HTMLElement>('.stack-tile'));
        const first = new Map(tiles.map(t => [t, t.getBoundingClientRect()]));

        setFilter(next);

        requestAnimationFrame(() => {
            tiles.forEach(tile => {
                const before = first.get(tile);
                if (!before) return;
                const after = tile.getBoundingClientRect();
                if (after.width === 0) return; // now hidden
                const dx = before.left - after.left;
                const dy = before.top - after.top;
                if (!dx && !dy) return;
                const inner = tile.querySelector<HTMLElement>('.stack-tile-in');
                if (!inner) return;
                gsap.fromTo(
                    inner,
                    { x: dx, y: dy },
                    { x: 0, y: 0, duration: 0.55, ease: 'power3.out' }
                );
            });
        });
    };

    /** Pointer pull — the tile leans toward the cursor. */
    const magnet = (e: React.PointerEvent<HTMLLIElement>) => {
        if (prefersReducedMotion()) return;
        const el = e.currentTarget;
        const x = e.clientX;
        const y = e.clientY;
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            const px = (x - r.left) / r.width - 0.5;
            const py = (y - r.top) / r.height - 0.5;
            el.style.setProperty('--tx', `${(px * 7).toFixed(2)}px`);
            el.style.setProperty('--ty', `${(py * 7).toFixed(2)}px`);
            el.style.setProperty('--ry', `${(px * 14).toFixed(2)}deg`);
            el.style.setProperty('--rx', `${(-py * 12).toFixed(2)}deg`);
        });
    };

    const release = (e: React.PointerEvent<HTMLLIElement>) => {
        cancelAnimationFrame(raf.current);
        const el = e.currentTarget;
        ['--tx', '--ty', '--ry', '--rx'].forEach(v => el.style.setProperty(v, v.includes('r') ? '0deg' : '0px'));
    };

    const counts: Record<string, number> = { All: TOOLS.length };
    CATS.forEach(c => (counts[c] = TOOLS.filter(t => t.cat === c).length));
    const dailyCount = TOOLS.filter(t => t.daily).length;

    return (
        <section className="stack-section" id="stack" ref={scopeRef}>
            <div className="section-head">
                <h2 className="section-title">
                    The <em>stack.</em>
                </h2>
                <p className="stack-meta mono-label">
                    <span data-countto={TOOLS.length}>0</span> tools ·{' '}
                    <span data-countto={dailyCount}>0</span> used daily · {CATS.length} disciplines
                </p>
            </div>

            <div className="stack-filters" role="group" aria-label="Filter stack by discipline">
                {(['All', ...CATS] as const).map(c => (
                    <button
                        key={c}
                        type="button"
                        className={`stack-filter${filter === c ? ' is-on' : ''}`}
                        onClick={() => applyFilter(c)}
                        onMouseEnter={playTick}
                        aria-pressed={filter === c}
                    >
                        {c}
                        <span className="stack-filter-n">{counts[c]}</span>
                    </button>
                ))}
            </div>

            <ul className="stack-grid" ref={gridRef}>
                {TOOLS.map(t => {
                    const shown = filter === 'All' || t.cat === filter;
                    return (
                        <li
                            key={t.name}
                            className={`stack-tile${t.daily ? ' is-daily' : ''}${shown ? '' : ' is-out'}`}
                            data-cat={t.cat}
                            onPointerMove={magnet}
                            onPointerLeave={release}
                            onMouseEnter={playTick}
                        >
                            <div className="stack-tile-in">
                                <ToolMark tool={t} />
                                <span className="stack-name">{t.name}</span>
                                <span className="stack-tag mono-label">{t.daily ? 'daily' : t.cat}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
