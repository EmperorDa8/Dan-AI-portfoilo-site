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
            duration: 0.9,
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

/* ------------------------------------------------------------------ *
 * Reveal safety net
 *
 * A previous version armed its fail-safe timer at MOUNT and only checked
 * whether the ScrollTrigger had fired. Two bugs followed: every element on the
 * page was force-shown 2.5s after load (including content nine screens down,
 * destroying its reveal), and the pending tween was never killed, so it later
 * replayed from opacity:0 and flashed.
 *
 * This version instead: starts the grace period when the element actually
 * reaches the viewport, verifies the real computed opacity rather than a proxy
 * signal, and kills the tween before forcing. A single shared watchdog catches
 * anything the observer misses — including elements animated by other systems.
 * ------------------------------------------------------------------ */

const pendingChecks = new Set<() => void>();
let watchdogId: number | null = null;

function ensureWatchdog() {
    if (watchdogId !== null || typeof window === 'undefined') return;
    watchdogId = window.setInterval(() => {
        pendingChecks.forEach(check => check());
        if (pendingChecks.size === 0 && watchdogId !== null) {
            window.clearInterval(watchdogId);
            watchdogId = null;
        }
    }, 2000);
}

function isOnScreen(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
}

/** Force an element visible if it is on screen but still transparent. */
function guard(el: HTMLElement, onSettled: () => void) {
    const check = () => {
        if (!el.isConnected) {
            pendingChecks.delete(check);
            return;
        }
        if (parseFloat(getComputedStyle(el).opacity) >= 0.99) {
            pendingChecks.delete(check);
            return;
        }
        if (!isOnScreen(el)) return; // still below the fold — leave its animation intact
        onSettled();
        gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' });
        pendingChecks.delete(check);
    };
    pendingChecks.add(check);
    ensureWatchdog();
    return check;
}

/** Fade + rise reveal for a single element. */
export function revealElement(
    el: HTMLElement,
    opts: { y?: number; delay?: number; start?: string; failsafeMs?: number } = {}
) {
    if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
    }

    gsap.set(el, { opacity: 0, y: opts.y ?? 42 });

    const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: opts.delay ?? 0,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: opts.start ?? 'top 88%',
            once: true,
        },
    });

    // Killing the tween is what stops the old flash-back-to-invisible.
    const settle = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
    };

    const check = guard(el, settle);

    // Grace period begins on viewport entry, not on mount.
    const io = new IntersectionObserver(
        entries => {
            if (!entries.some(e => e.isIntersecting)) return;
            io.disconnect();
            window.setTimeout(check, opts.failsafeMs ?? 1500);
        },
        { threshold: 0.01 }
    );
    io.observe(el);
}

/** Reveal a set of elements with a stagger. */
export function revealOnScroll(targets: gsap.TweenTarget, opts: { y?: number; stagger?: number } = {}) {
    const els = gsap.utils.toArray<HTMLElement>(targets as gsap.DOMTarget);
    els.forEach((el, i) => revealElement(el, { y: opts.y, delay: i * (opts.stagger ?? 0) }));
}

/**
 * Extends the same guarantee to elements animated by framer-motion's
 * `whileInView`, which ships no fallback of its own: if its observer never
 * delivers, the case studies and credentials would render blank forever.
 */
export function installRevealSafetyNet(selectors: string[]) {
    if (typeof window === 'undefined' || prefersReducedMotion()) return;
    const sweep = () => {
        selectors.forEach(sel => {
            document.querySelectorAll<HTMLElement>(sel).forEach(el => {
                if (parseFloat(getComputedStyle(el).opacity) < 0.99) guard(el, () => {});
            });
        });
    };
    window.setTimeout(sweep, 3000);
    window.setTimeout(sweep, 9000);
}

export { gsap, ScrollTrigger };
