import { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick, playTick } from '../sound';

const REASONS = ['A project', 'A friendly chat', 'Employment', 'Something else'];
const URGENCY_LABELS = ['Whenever', 'No rush', 'Sometime soon', 'This week', 'ASAP'];

export function FooterCTA() {
    const [reason, setReason] = useState<string>(REASONS[0]);
    const [urgency, setUrgency] = useState(2);
    const [message, setMessage] = useState('');

    const submit = () => {
        playClick();
        const subject = encodeURIComponent(`Portfolio contact — ${reason}`);
        const body = encodeURIComponent(
            `Reason: ${reason}\nUrgency: ${URGENCY_LABELS[urgency]}\n\n${message || '(no message)'}`
        );
        window.location.href = `mailto:Uabdul88@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <section className="cta-section" id="contact">
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
            </motion.h2>

            <div className="cta-socials">
                <a href="https://www.linkedin.com/in/dan-usman/" target="_blank" rel="noopener noreferrer" className="cta-social-pill" onMouseEnter={playTick}>
                    LinkedIn
                </a>
                <a href="https://github.com/EmperorDa8" target="_blank" rel="noopener noreferrer" className="cta-social-pill" onMouseEnter={playTick}>
                    GitHub
                </a>
                <a href="mailto:Uabdul88@gmail.com" className="cta-social-pill" onMouseEnter={playTick}>
                    Email
                </a>
                <a href="/Dan_Usman_CV_AI_Builder_2026.pdf" download className="cta-social-pill" onMouseEnter={playTick}>
                    Resume ↓
                </a>
            </div>

            <div className="contact-form">
                <label className="form-label">What brings you here?</label>
                <div className="chip-row">
                    {REASONS.map(r => (
                        <button
                            key={r}
                            type="button"
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

                <div className="urgency-wrap">
                    <label className="form-label" htmlFor="urgency">
                        How urgent?
                        <span className="urgency-value">{URGENCY_LABELS[urgency]}</span>
                    </label>
                    <input
                        id="urgency"
                        type="range"
                        min={0}
                        max={4}
                        step={1}
                        value={urgency}
                        onChange={e => setUrgency(Number(e.target.value))}
                        className="urgency-slider"
                    />
                    <div className="urgency-ends">
                        <span>Whenever</span>
                        <span>ASAP</span>
                    </div>
                </div>

                <label className="form-label" htmlFor="message">
                    Anything else on your mind?
                </label>
                <textarea
                    id="message"
                    className="form-message"
                    placeholder="Tell me a little about it..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />

                <button type="button" className="send-btn" onClick={submit} onMouseEnter={playTick}>
                    Send it <span aria-hidden>→</span>
                </button>
            </div>
        </section>
    );
}
