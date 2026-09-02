const TOOLS = [
    'Claude Code',
    'Lovable',
    'Rocket AI',
    'Cursor',
    'GPT-4o',
    'Midjourney',
    'Sora & VEO 3',
    'ElevenLabs',
    'n8n',
    'Generative AI',
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
