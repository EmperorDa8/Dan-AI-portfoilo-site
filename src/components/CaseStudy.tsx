export function CaseStudy() {
    return (
        <section className="case-study">
            <div className="case-showcase">
                <div className="mock-phone left"></div>

                <div className="mock-phone center">
                    {/* Inner UI Mock for Voice AI */}
                    <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '2rem', color: '#111', fontWeight: 600, borderBottom: '2px solid #111', paddingBottom: '0.5rem' }}>
                        &gt; SYS.CONFIG <span style={{ float: 'right' }}>[OK]</span>
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>NPC.Core</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary-accent)', marginBottom: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>AZer-t Studio Integration</div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ background: '#111', color: 'white', padding: '6px 16px', border: '2px solid #111', fontSize: '0.8rem', fontWeight: 600 }}>DIALOGUE</div>
                        <div style={{ color: '#111', border: '2px solid #111', padding: '6px 10px', fontSize: '0.8rem', fontWeight: 600, boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>LATENCY</div>
                    </div>

                    <div style={{ background: '#f4f4f0', border: 'var(--b-border)', borderRadius: '0', padding: '24px', boxShadow: '6px 6px 0px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '28px', height: '28px', background: 'var(--text-color)', border: '2px solid #111' }}></div>
                                <div style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'var(--font-mono)' }}>
                                    Engine<br />
                                    <span style={{ color: '#111', fontSize: '0.85rem', fontWeight: 700 }}>ElevenLabs API</span>
                                </div>
                            </div>
                            <div style={{ color: 'var(--secondary-accent)', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', animation: 'pulse 2s infinite' }}>[ACTIVE]</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>Workflow</div>
                        <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', fontWeight: 'bold', letterSpacing: '-1.5px', marginBottom: '12px', lineHeight: 1.1 }}>
                            Real-time<br />Generation
                        </div>

                        <div style={{ height: '4px', background: 'transparent', borderTop: '2px dashed #111', marginTop: '20px' }}></div>
                    </div>
                </div>

                <div className="mock-phone right"></div>
            </div>

            <div className="case-footer">
                <div className="case-desc">
                    Architected complex system prompts and automation workflows for an interactive voice AI application, enabling the platform to generate dynamic, personality-driven NPC dialogue in real-time.
                </div>
                <div className="case-thumbs">
                    <div className="thumb" style={{ background: 'white', border: '1px solid #ddd' }}>
                        <img src="https://images.unsplash.com/photo-1558769132-cb1fac08404a?w=200&q=80" style={{ opacity: 0.4 }} alt="Thumb 1" />
                    </div>
                    <div className="thumb">
                        <img src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=200&q=80" alt="Thumb 2" />
                    </div>
                    <div className="thumb">
                        <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200&q=80" alt="Thumb 3" />
                    </div>
                </div>
            </div>

            <div className="case-bottom-title">
                /Voice_Agent<sup style={{ fontSize: '0.4em' }}>®</sup>
            </div>
        </section>
    );
}
