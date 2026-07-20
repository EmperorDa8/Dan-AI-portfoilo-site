import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playTick } from '../sound';

const CAROUSEL = [
    { src: '/venturescout_thumbnail.png', label: 'VentureScout' },
    { src: '/galaxyflow_thumbnail.png', label: 'Galaxyflow' },
    { src: '/subkit.png', label: 'Subkit' },
    { src: '/yourev_screenshot.png', label: 'YouRev' },
    { src: '/game_character.png', label: 'AZer-t Studio' },
    { src: '/ad_generator_thumbnail.png', label: 'Ad Scale Gen' },
    { src: '/mcp_analytics_app.png', label: 'MCP Analytics' },
    { src: '/generative_media_studio.png', label: 'Media Engine' },
];

export function PrototypeCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragLimit, setDragLimit] = useState(0);
    const [dragged, setDragged] = useState(false);

    useEffect(() => {
        const measure = () => {
            const track = trackRef.current;
            if (!track) return;
            setDragLimit(Math.max(0, track.scrollWidth - window.innerWidth));
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    return (
        <section className="carousel-section" aria-label="Prototype gallery">
            <div className="carousel-head">
                <span className="mono-label">/ prototype gallery</span>
                <span className="mono-label carousel-hint">Drag to explore →</span>
            </div>
            <div className="hero-carousel">
                {!dragged && <div className="drag-me">← Drag me →</div>}
                <motion.div
                    ref={trackRef}
                    className="hero-carousel-track"
                    drag="x"
                    dragConstraints={{ left: -dragLimit, right: 0 }}
                    dragElastic={0.08}
                    onDragStart={() => setDragged(true)}
                >
                    {CAROUSEL.map(item => (
                        <div className="hero-card" key={item.label} onMouseEnter={playTick}>
                            <img src={item.src} alt={item.label} draggable={false} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
