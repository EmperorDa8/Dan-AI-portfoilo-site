import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/scroll';
import type { FigureKind } from './Figure3D';

const Figure3D = lazy(() => import('./Figure3D'));

/**
 * The slot a 3D figure renders into. It owns everything that should not cost
 * a visitor who will never see the figure:
 *
 * - On small screens, low-power devices or under reduced motion it renders
 *   nothing at all, so the layout simply closes up. (Same gate as Scene3D.)
 * - The WebGL canvas is mounted only while the slot is near the viewport and
 *   unmounted once it is well past, so of the six figures on the page no more
 *   than two ever hold a GL context at once.
 * - three.js itself is in a lazy chunk shared with the hero scene.
 */
export function FigureSlot({ kind, className = '' }: { kind: FigureKind; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);
    const [near, setNear] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1100px)');
        const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
        const evaluate = () => setEnabled(mq.matches && !lowPower && !prefersReducedMotion());
        evaluate();
        mq.addEventListener('change', evaluate);
        return () => mq.removeEventListener('change', evaluate);
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!enabled || !el) return;
        const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '300px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div ref={ref} className={`fig fig--${kind} ${className}`} aria-hidden>
            {near && (
                <Suspense fallback={null}>
                    <Figure3D kind={kind} />
                </Suspense>
            )}
        </div>
    );
}
