import { useEffect, useState } from 'react';

export function Navigation() {
    const [activeSection, setActiveSection] = useState<string>('work');

    useEffect(() => {
        const sections = ['work', 'bio'];
        const observers: IntersectionObserver[] = [];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold: 0.3 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    return (
        <nav>
            <div className="nav-left">
                <a href="/" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                    DAN_USMAN
                </a>
            </div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                <a href="#bio" className={activeSection === 'bio' ? 'active' : ''}>BIO</a>
                <a href="#work" className={activeSection === 'work' ? 'active' : ''}>WORK</a>
            </div>
            <div className="nav-right">
                <a href="https://www.linkedin.com/in/dan-usman/" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>LINKEDIN</a>
                <a href="https://github.com/EmperorDa8" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>GITHUB</a>
                <a href="mailto:Uabdul88@gmail.com">CONTACT</a>
            </div>
        </nav>
    );
}
