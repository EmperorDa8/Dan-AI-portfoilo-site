import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './scroll';

/**
 * Publishes how far a tall section has travelled past the viewport as `--p`
 * (0 → 1) on the section itself, so a sticky stage inside it can be animated
 * entirely in CSS.
 *
 * Deliberately a plain scroll listener rather than a ScrollTrigger pin: the
 * stage is `position: sticky`, so the browser reserves the space and nothing
 * can collide with the next section. (A pin with no spacing is what made the
 * Works heading overlap its list earlier in this project.) The value is a pure
 * function of one bounding rect, so it is also trivially correct after a
 * resize or a jump-scroll.
 *
 * Below `minWidth`, or under reduced motion, nothing is tracked: `--p` is set
 * to 1 once — the finished state — and the CSS lays the section out statically.
 * `data-late` is set once progress passes `lateAt`, for things that should
 * switch on rather than scrub (a link that must not be clickable while unseen).
 */
export function useSectionProgress<T extends HTMLElement>(opts: { minWidth?: number; lateAt?: number } = {}) {
    const ref = useRef<T>(null);
    const { minWidth = 821, lateAt = 0.75 } = opts;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
        let last = -1;

        const settle = () => {
            el.style.setProperty('--p', '1');
            el.setAttribute('data-late', '');
            el.setAttribute('data-static', '');
            el.removeAttribute('data-active');
        };

        const update = () => {
            if (!mq.matches || prefersReducedMotion()) {
                settle();
                return;
            }
            el.removeAttribute('data-static');
            const rect = el.getBoundingClientRect();
            // True while the section is what sits under the fixed nav, so the
            // nav can read the ground beneath it. `--p` alone cannot say this:
            // it stays at 1 after the section has scrolled away.
            el.toggleAttribute('data-active', rect.top <= 0 && rect.bottom > 80);
            const travel = rect.height - window.innerHeight;
            const p = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 1;
            if (Math.abs(p - last) < 0.0005) return;
            last = p;
            el.style.setProperty('--p', p.toFixed(4));
            el.toggleAttribute('data-late', p >= lateAt);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        mq.addEventListener('change', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            mq.removeEventListener('change', update);
        };
    }, [minWidth, lateAt]);

    return ref;
}
