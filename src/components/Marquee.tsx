const TOOLS = [
    'Claude API',
    'Claude Code',
    'OpenAI',
    'Gemini',
    'MCP',
    'RAG',
    'Multi-agent',
    'Veo 3',
    'Kling',
    'Nano Banana',
    'ElevenLabs',
] as const;

/**
 * The track is rendered twice so the -50% translate loops seamlessly. The second
 * pass is aria-hidden — otherwise screen readers announce the whole tool list
 * twice. Kept as flat sibling spans because `.marquee-content span` styles every
 * descendant span; a wrapper element would pick up its padding and ✦ separator
 * and break the loop's symmetry.
 */
export function Marquee() {
    return (
        <div className="marquee-container reveal">
            <div className="marquee-content">
                {TOOLS.map(t => (
                    <span key={t}>{t}</span>
                ))}
                {TOOLS.map(t => (
                    <span key={`dupe-${t}`} aria-hidden>
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
}
