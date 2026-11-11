import type { ReactNode } from 'react';

/**
 * Window chrome: three dots, the file or address in the middle, a short note
 * on the right. One frame for everything that is "a thing running" — a
 * product screenshot, a demo, the showreel — so engineering and creative work
 * are presented in the same visual language.
 */
export function Win({
    title,
    meta,
    children,
    className = '',
}: {
    title: string;
    meta?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`win ${className}`}>
            <div className="win-bar" aria-hidden>
                <span className="win-dots">
                    <i />
                    <i />
                    <i />
                </span>
                <span className="win-title">{title}</span>
                <span className="win-meta">{meta}</span>
            </div>
            <div className="win-body">{children}</div>
        </div>
    );
}
