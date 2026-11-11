import { useMemo } from 'react';

/**
 * A field of characters used as texture behind a band of text.
 *
 * Generated rather than typed: one short motif, offset by one character per
 * row, so the diagonals read as a woven pattern. Deterministic (no randomness
 * during render) and hidden from assistive tech — it is decoration.
 */
const MOTIF = '·:+—/:·.×—';

export function Ascii({ rows = 26, cols = 240 }: { rows?: number; cols?: number }) {
    const text = useMemo(() => {
        const line = MOTIF.repeat(Math.ceil(cols / MOTIF.length) + 1);
        return Array.from({ length: rows }, (_, r) => line.slice(r % MOTIF.length, (r % MOTIF.length) + cols)).join('\n');
    }, [rows, cols]);

    return (
        <pre className="ascii" aria-hidden>
            {text}
        </pre>
    );
}
