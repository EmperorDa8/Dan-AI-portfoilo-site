/* ------------------------------------------------------------------ *
 * Scroll-driven atmosphere.
 *
 * One publisher, driven from the Lenis rAF loop that already exists, writing
 * a handful of custom properties on :root. CSS does the rest, so adding an
 * effect costs a rule rather than another listener or another loop:
 *
 *   --vel      damped scroll velocity, -1 … 1 (signed, direction matters)
 *   --vel-abs  its magnitude, 0 … 1
 *   --skew     a few tenths of a degree of shear, for grids that should
 *              feel like they have weight
 *
 * Everything here is motion-only. Under prefers-reduced-motion the publisher
 * never starts and every variable stays at its neutral default, so the CSS
 * that reads them resolves to no transform at all.
 * ------------------------------------------------------------------ */

import { prefersReducedMotion, scrollState } from './scroll';

/** Lenis reports roughly px/frame; this is the speed we treat as "full tilt". */
const VELOCITY_FULL_SCALE = 55;
/** Shear stays under a degree — enough to feel, not enough to notice. */
const MAX_SKEW_DEG = 0.85;
/** Higher = snappier recovery when scrolling stops. */
const DAMPING = 7.5;

let damped = 0;
let lastTime = 0;
let running = false;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Advance the published variables. Called once per frame from the scroll
 * loop — never schedules a frame of its own.
 */
export function tickScrollFx(timeMs: number) {
    if (!running) return;

    const dt = lastTime ? Math.min((timeMs - lastTime) / 1000, 0.1) : 0;
    lastTime = timeMs;

    const target = clamp(scrollState.velocity / VELOCITY_FULL_SCALE, -1, 1);
    // Frame-rate independent exponential approach, so a 120Hz display and a
    // 60Hz one settle at the same rate.
    damped += (target - damped) * (1 - Math.exp(-DAMPING * dt));

    if (Math.abs(damped) < 0.0005) damped = 0;

    const root = document.documentElement.style;
    root.setProperty('--vel', damped.toFixed(4));
    root.setProperty('--vel-abs', Math.abs(damped).toFixed(4));
    root.setProperty('--skew', `${(damped * MAX_SKEW_DEG).toFixed(3)}deg`);
}

export function startScrollFx() {
    if (prefersReducedMotion()) return;
    running = true;
    lastTime = 0;
}

export function stopScrollFx() {
    running = false;
    damped = 0;
    lastTime = 0;
    const root = document.documentElement.style;
    root.removeProperty('--vel');
    root.removeProperty('--vel-abs');
    root.removeProperty('--skew');
}

/* ------------------------------------------------------------------ *
 * Column parallax
 * ------------------------------------------------------------------ */

/**
 * Give a masonry grid depth by letting its columns travel at different rates.
 *
 * The depth is written as `--col-depth` on each tile and consumed by the CSS
 * `translate` property — deliberately NOT `transform`, which framer-motion's
 * `layout` already owns on these tiles. The two properties compose, so the
 * filter re-flow and the parallax never fight over one value.
 *
 * Columns are derived from measured offsetLeft rather than an index, because
 * the grid is `auto-fill` + `dense`: how many columns exist, and which tile
 * lands in which, is only known after layout.
 */
export function applyColumnParallax(grid: HTMLElement, maxDepth = 34) {
    const tiles = Array.from(grid.children) as HTMLElement[];
    if (!tiles.length) return;

    if (prefersReducedMotion()) {
        tiles.forEach(t => t.style.removeProperty('--col-depth'));
        return;
    }

    // Bucket by left edge; tiles sharing an edge share a column.
    const lefts = [...new Set(tiles.map(t => Math.round(t.offsetLeft)))].sort((a, b) => a - b);
    const columns = lefts.length;

    tiles.forEach(tile => {
        const col = lefts.indexOf(Math.round(tile.offsetLeft));
        // A single column (phone) gets no parallax — there is nothing to
        // parallax against, and staggering one column just looks like drift.
        if (columns < 2) {
            tile.style.removeProperty('--col-depth');
            return;
        }
        // Alternate the sign so neighbouring columns separate, and taper the
        // outer columns so the row does not read as a simple zig-zag.
        const phase = col / (columns - 1); // 0 … 1
        const wave = Math.sin(phase * Math.PI * 1.5 + 0.4);
        tile.style.setProperty('--col-depth', `${(wave * maxDepth).toFixed(1)}px`);
    });
}

/* ------------------------------------------------------------------ *
 * Word splitting
 * ------------------------------------------------------------------ */

const SPLIT_FLAG = 'data-split';

/**
 * Wrap every word of a heading in a masked span so it can rise into place.
 *
 * Walks text nodes only and rebuilds them in situ, so inline elements — the
 * `<em>` that carries the serif accent on every section title — survive with
 * their styling intact. Splitting `innerHTML` would flatten them.
 */
export function splitWords(el: HTMLElement) {
    if (prefersReducedMotion() || el.hasAttribute(SPLIT_FLAG)) return;
    el.setAttribute(SPLIT_FLAG, '');

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    let node = walker.nextNode();
    while (node) {
        if (node.textContent?.trim()) texts.push(node as Text);
        node = walker.nextNode();
    }

    texts.forEach(text => {
        const frag = document.createDocumentFragment();
        // Keep the whitespace runs: they are what separates the words once
        // each one becomes an inline-block.
        text.textContent!.split(/(\s+)/).forEach(chunk => {
            if (!chunk) return;
            if (!chunk.trim()) {
                frag.appendChild(document.createTextNode(chunk));
                return;
            }
            const mask = document.createElement('span');
            mask.className = 'word-mask';
            const inner = document.createElement('span');
            inner.className = 'word';
            inner.textContent = chunk;
            mask.appendChild(inner);
            frag.appendChild(mask);
        });
        text.replaceWith(frag);
    });
}
