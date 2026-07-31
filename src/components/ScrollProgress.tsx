import { useEffect, useRef } from 'react';
import { getLenis } from '../lib/scroll';

/** Thin scroll-progress rail, Contralabs-style. */
export function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = (p: number) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        };

        const l = getLenis();
        if (l) {
            const handler = (e: { progress: number }) => update(e.progress);
            l.on('scroll', handler);
            return () => l.off('scroll', handler);
        }

        // Reduced-motion / no-Lenis fallback
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            update(max > 0 ? window.scrollY / max : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="scroll-rail" aria-hidden>
            <div className="scroll-rail-bar" ref={barRef} />
        </div>
    );
}
