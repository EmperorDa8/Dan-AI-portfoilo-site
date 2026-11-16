import { useEffect, useState } from 'react';
import { playClick, playTick } from '../sound';

/**
 * A floating dock at the bottom of the screen: one call to action that splits
 * two ways, so a visitor hiring for either half of the job is one click from
 * the right evidence.
 *
 * It appears once the hero has scrolled away and steps aside while the
 * contact section is on screen — at that point the form is the call to action.
 */
export function Dock() {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const contact = document.getElementById('contact');
        let pastHero = false;
        let atContact = false;
        const sync = () => setShown(pastHero && !atContact);

        const onScroll = () => {
            pastHero = window.scrollY > window.innerHeight * 0.8;
            sync();
        };
        const io = contact
            ? new IntersectionObserver(([e]) => {
                  atContact = e.isIntersecting;
                  sync();
              })
            : null;

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        if (contact && io) io.observe(contact);
        return () => {
            window.removeEventListener('scroll', onScroll);
            io?.disconnect();
        };
    }, []);

    return (
        <nav className={`dock${shown ? ' is-shown' : ''}`} aria-label="Hire Dan" aria-hidden={!shown}>
            <span className="dock-label">Hiring?</span>
            <span className="dock-split">
                <a href="#work" tabIndex={shown ? 0 : -1} onMouseEnter={playTick} onClick={playClick}>
                    Engineering
                </a>
                <a href="#studio" tabIndex={shown ? 0 : -1} onMouseEnter={playTick} onClick={playClick}>
                    Creative
                </a>
            </span>
            <a
                href="#contact"
                className="dock-go"
                tabIndex={shown ? 0 : -1}
                aria-label="Contact Dan"
                onMouseEnter={playTick}
                onClick={playClick}
            >
                →
            </a>
        </nav>
    );
}
