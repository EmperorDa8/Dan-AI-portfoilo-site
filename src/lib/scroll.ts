import { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Global scroll progress 0..1, readable by the WebGL layer without re-rendering React. */
export const scrollState = {
    progress: 0,
    velocity: 0,
};

let lenis: Lenis | null = null;

export function getLenis() {
    return lenis;
}

export function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Boots Lenis smooth scroll and syncs it with GSAP's ticker + ScrollTrigger.
 * Mount once, at the app root.
 */
export function useSmoothScroll() {
    useEffect(() => {
        if (prefersReducedMotion()) return;

        const instance = new Lenis({
            duration: 1.05,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.6,
        });
        lenis = instance;

        instance.on('scroll', (e: { progress: number; velocity: number }) => {
            scrollState.progress = e.progress;
            scrollState.velocity = e.velocity;
            ScrollTrigger.update();
        });

        const raf = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        // Anchor links must route through Lenis or they jump instantly.
        const onClick = (ev: MouseEvent) => {
            const link = (ev.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
            if (!link) return;
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const el = document.querySelector(id);
            if (!el) return;
            ev.preventDefault();
            instance.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 });
        };
        document.addEventListener('click', onClick);

        ScrollTrigger.refresh();

        return () => {
            document.removeEventListener('click', onClick);
            gsap.ticker.remove(raf);
            instance.destroy();
            lenis = null;
        };
    }, []);
}

/**
 * Runs a GSAP setup function inside a scoped context so every tween and
 * ScrollTrigger it creates is reverted on unmount.
 */
export function useGsapScope<T extends HTMLElement>(
    setup: (ctx: { scope: T }) => void,
    deps: unknown[] = []
) {
    const ref = useRef<T>(null);

    useLayoutEffect(() => {
        const scope = ref.current;
        if (!scope) return;
        const ctx = gsap.context(() => setup({ scope }), scope);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ref;
}

/**
 * Fade + rise reveal for a single element.
 *
 * Content must never be left permanently invisible. If the ScrollTrigger has
 * not fired within `failsafeMs` (smooth-scroll loop stalled, rAF throttled in a
 * background tab, a JS error upstream), the element is forced visible.
 */
export function revealElement(
    el: HTMLElement,
    opts: { y?: number; delay?: number; start?: string; failsafeMs?: number } = {}
) {
    if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
    }

    let played = false;
    const show = () => {
        played = true;
        gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' });
    };

    gsap.set(el, { opacity: 0, y: opts.y ?? 42 });

    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: opts.delay ?? 0,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: opts.start ?? 'top 88%',
            once: true,
            onEnter: () => {
                played = true;
            },
        },
    });

    window.setTimeout(() => {
        if (!played) show();
    }, opts.failsafeMs ?? 2500);
}

/** Reveal a set of elements with a stagger. */
export function revealOnScroll(targets: gsap.TweenTarget, opts: { y?: number; stagger?: number } = {}) {
    const els = gsap.utils.toArray<HTMLElement>(targets as gsap.DOMTarget);
    els.forEach((el, i) => revealElement(el, { y: opts.y, delay: i * (opts.stagger ?? 0) }));
}

export { gsap, ScrollTrigger };
