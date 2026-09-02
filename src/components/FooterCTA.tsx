import { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick, playTick } from '../sound';

const EMAIL = 'Uabdul88@gmail.com';
const REASONS = ['Hiring for a role', 'A project', 'A friendly chat', 'Something else'];

/** Set VITE_CONTACT_ENDPOINT (Formspree, Resend, a serverless fn) to enable
 *  real submission. Without it the form degrades to a mailto: draft, and says so. */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function FooterCTA() {
    const [reason, setReason] = useState<string>(REASONS[0]);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<Status>('idle');

    const mailtoHref = () => {
        const subject = encodeURIComponent(`Portfolio contact — ${reason}`);
        const body = encodeURIComponent(`Reason: ${reason}\nFrom: ${email || '(no email given)'}\n\n${message || '(no message)'}`);
        return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        playClick();

        if (!ENDPOINT) {
            // No endpoint configured — open a draft and tell the user plainly.
            window.location.href = mailtoHref();
            setStatus('sent');
            return;
        }

        setStatus('sending');
        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ reason, email, message }),
            });
            setStatus(res.ok ? 'sent' : 'error');
        } catch {
            setStatus('error');
        }
    };

    return (
        <section className="cta-section" id="contact">
            {/* A face at the conversion point — people reply to people. */}
            <div className="cta-head">
                <motion.figure
                    className="cta-portrait"
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <img
                        src="/hero_portrait_bw.webp"
                        alt="Dan Usman"
                        width={1200}
                        height={1600}
                        loading="lazy"
                        decoding="async"
                    />
                </motion.figure>

                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="cta-title"
                >
                    Let&apos;s build
                    <br />
                    <em>the future.</em>
                    <span className="cta-sig mono-label">
                        Dan Usman · usually replies within a day
                    </span>
                </motion.h2>
            </div>

            <div className="cta-socials">
                <a href="https://www.linkedin.com/in/dan-usman/" target="_blank" rel="noopener noreferrer" className="cta-social-pill" onMouseEnter={playTick}>
                    LinkedIn
                </a>
                <a href="https://github.com/EmperorDa8" target="_blank" rel="noopener noreferrer" className="cta-social-pill" onMouseEnter={playTick}>
                    GitHub
                </a>
                <a href={`mailto:${EMAIL}`} className="cta-social-pill" onMouseEnter={playTick}>
                    Email
                </a>
                <a href="/Dan_Usman_CV_AI_Builder_2026.pdf" download className="cta-social-pill" onMouseEnter={playTick}>
                    Resume ↓
                </a>
            </div>

            <form className="contact-form" onSubmit={submit}>
                <label className="form-label" id="reason-label">
                    What brings you here?
                </label>
                <div className="chip-row" role="group" aria-labelledby="reason-label">
                    {REASONS.map(r => (
                        <button
                            key={r}
                            type="button"
                            aria-pressed={reason === r}
                            className={`form-chip ${reason === r ? 'selected' : ''}`}
                            onClick={() => {
                                setReason(r);
                                playClick();
                            }}
                            onMouseEnter={playTick}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <label className="form-label" htmlFor="email">
                    Your email
                </label>
                <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        if (status !== 'idle') setStatus('idle');
                    }}
                    autoComplete="email"
                    required
                />

                <label className="form-label" htmlFor="message">
                    Anything else on your mind?
                </label>
                <textarea
                    id="message"
                    className="form-message"
                    placeholder="Tell me a little about it..."
                    value={message}
                    onChange={e => {
                        setMessage(e.target.value);
                        if (status !== 'idle') setStatus('idle');
                    }}
                    required
                />

                <div className="form-actions">
                    <button type="submit" className="send-btn" disabled={status === 'sending'} onMouseEnter={playTick}>
                        {status === 'sending' ? 'Sending…' : 'Send it'} <span aria-hidden>→</span>
                    </button>

                    <p className="form-fallback">
                        or email me directly at{' '}
                        <a href={`mailto:${EMAIL}`} onMouseEnter={playTick}>
                            {EMAIL}
                        </a>
                    </p>
                </div>

                <p className="form-status" role="status" aria-live="polite">
                    {status === 'sent' && !ENDPOINT && 'Opened a draft in your mail app — if nothing happened, use the address above.'}
                    {status === 'sent' && ENDPOINT && "Thanks — that's with me. I'll reply within a day."}
                    {status === 'error' && (
                        <>
                            That didn’t send.{' '}
                            <a href={mailtoHref()}>Open it as an email draft instead</a> — your message is kept.
                        </>
                    )}
                </p>
            </form>
        </section>
    );
}
