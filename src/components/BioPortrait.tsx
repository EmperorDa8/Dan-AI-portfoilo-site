import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/scroll';

/**
 * The bio portrait as a living loop: an 8s Flow (Veo 3.1) animation made from
 * Dan's own photo, starting and ending on the same frame so it loops without a
 * jump. Silent, and only decoded while on screen.
 *
 * The poster is the clip's own first frame, so there is no shift in framing
 * when playback starts. Under reduced motion only the poster is shown. If the
 * video fails to load, the original photo is used instead.
 */
export function BioPortrait() {
    const ref = useRef<HTMLVideoElement>(null);
    const [failed, setFailed] = useState(false);
    const [still] = useState(prefersReducedMotion);

    useEffect(() => {
        const v = ref.current;
        if (!v || still) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) void v.play().catch(() => {});
                else v.pause();
            },
            { threshold: 0.15 }
        );
        io.observe(v);
        return () => io.disconnect();
    }, [still, failed]);

    if (failed) {
        return <img src="/hero_portrait_color.webp" alt="Dan Usman" loading="lazy" decoding="async" width={800} height={1000} />;
    }

    if (still) {
        return <img className="bio-portrait" src="/bio-portrait.webp" alt="Dan Usman" loading="lazy" decoding="async" width={540} height={960} />;
    }

    return (
        <video
            ref={ref}
            className="bio-portrait"
            src="/bio-portrait.mp4"
            poster="/bio-portrait.webp"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Dan Usman, animated portrait"
            onError={() => setFailed(true)}
        />
    );
}
