import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, useGsapScope } from '../lib/scroll';

type Props = {
    /** Basename in /ambient — e.g. "library" loads library.webm + library.mp4 */
    name: 'library' | 'schoolroom';
    /** Peak opacity of the layer. Keep low; this is texture, not content. */
    opacity?: number;
};

/**
 * Low-opacity looping video used as atmospheric section texture.
 * Parallaxes on scroll, pauses when off-screen, and is skipped for
 * reduced-motion users.
 */
export function AmbientVideo({ name, opacity = 0.16 }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const scopeRef = useGsapScope<HTMLDivElement>(({ scope }) => {
        if (prefersReducedMotion()) return;
        const v = scope.querySelector('video');
        if (!v) return;

        gsap.fromTo(
            v,
            { yPercent: -8, scale: 1.12 },
            {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: true },
            }
        );

        gsap.fromTo(
            scope,
            { opacity: 0 },
            {
                opacity: 1,
                ease: 'none',
                scrollTrigger: { trigger: scope, start: 'top bottom', end: 'top 55%', scrub: true },
            }
        );
    }, []);

    // Only play while visible — avoids burning decode cycles off-screen.
    useEffect(() => {
        const v = videoRef.current;
        if (!v || prefersReducedMotion()) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) void v.play().catch(() => {});
                else v.pause();
            },
            { threshold: 0.05 }
        );
        io.observe(v);
        return () => io.disconnect();
    }, []);

    if (prefersReducedMotion()) return null;

    return (
        <div className="ambient-video" ref={scopeRef} style={{ '--ambient-op': opacity } as React.CSSProperties} aria-hidden>
            <video ref={videoRef} muted loop playsInline preload="none" poster="">
                <source src={`/ambient/${name}.webm`} type="video/webm" />
                <source src={`/ambient/${name}.mp4`} type="video/mp4" />
            </video>
        </div>
    );
}
