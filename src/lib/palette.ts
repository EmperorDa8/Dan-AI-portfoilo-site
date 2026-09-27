/** Opens the ⌘K command palette from anywhere (nav button, hero button). */
export const OPEN_PALETTE = 'open-palette';
export const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE));
