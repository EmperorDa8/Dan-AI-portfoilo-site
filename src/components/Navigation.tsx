import { useEffect, useState } from 'react';

export function Navigation() {
    const [activeSection, setActiveSection] = useState<string>('work');

    useEffect(() => {
        const sections = ['work', 'bio', 'experience', 'expertise'];
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
            <div style={{ display: 'flex', gap: '2.25rem' }}>
                <a href="#bio" className={activeSection === 'bio' ? 'active' : ''}>BIO</a>
                <a href="#work" className={activeSection === 'work' ? 'active' : ''}>WORK</a>
                <a href="#experience" className={activeSection === 'experience' ? 'active' : ''}>EXPERIENCE</a>
                <a href="#expertise" className={activeSection === 'expertise' ? 'active' : ''}>EXPERTISE</a>
            </div>
            <div className="nav-right">
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">RESUME ↗</a>
                <a href="https://www.linkedin.com/in/dan-usman/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
                <a href="https://github.com/EmperorDa8" target="_blank" rel="noopener noreferrer">GITHUB</a>
                <a href="mailto:Uabdul88@gmail.com">CONTACT</a>
            </div>
        </nav>
    );
}
