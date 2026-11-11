import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/scroll';
import { useSectionProgress } from '../lib/sectionProgress';
import { playClick, playTick } from '../sound';

/**
 * The showreel, in a window that opens.
 *
 * It sits directly under the hero so its top edge shows on the first screen,
 * then grows to fill the viewport as the section scrolls: the first thing a
 * visitor does on this site is watch the work. The reel itself is built by
 * scripts/build_showreel.sh from finished pieces only.
 *
 * On phones and under reduced motion there is no pinning — the window is a
 * plain 16:9 frame with the caption underneath.
 */
export function Reel() {
    const ref = useSectionProgress<HTMLElement>({ lateAt: 0.72 });
    const videoRef = useRef<HTMLVideoElement>(null);

    // Only decode while on screen; reduced motion gets the poster and controls.
    useEffect(() => {
        const v = videoRef.current;
        if (!v || prefersReducedMotion()) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) void v.play().catch(() => {});
                else v.pause();
            },
            { threshold: 0.05 }
        );
        io.observe(v);
        return () => io.disconnect();
    }, []);

    return (
        <section className="reel" id="reel" ref={ref} aria-label="Showreel">
            <div className="reel-stage">
                <div className="reel-window">
                    <div className="reel-bar" aria-hidden>
                        <span className="reel-dots">
                            <i />
                            <i />
                            <i />
                        </span>
                        <span className="reel-file">showreel.mp4</span>
                        <span className="reel-len">0:21</span>
                    </div>

                    <video
                        ref={videoRef}
                        className="reel-video"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/reel/showreel.webp"
                        controls={prefersReducedMotion()}
                        aria-label="Showreel: paintings, client ads, music videos and motion graphics by Dan Usman"
                    >
                        <source src="/reel/showreel.mp4" type="video/mp4" />
                    </video>

                    <div className="reel-end">
                        <p className="reel-line">
                            Paintings, client ads, music videos, motion graphics. <em>Every frame is my work.</em>
                        </p>
                        <a href="#studio" className="btn btn-primary" onMouseEnter={playTick} onClick={playClick}>
                            Open the studio <span aria-hidden>↓</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
