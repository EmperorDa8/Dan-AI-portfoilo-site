/* Tiny WebAudio UI-sound engine — no audio assets needed.
   Off by default; toggled from the nav and persisted in localStorage. */

const STORAGE_KEY = 'dan-ui-sound';

let ctx: AudioContext | null = null;
let enabled = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'on';

function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
}

function blip(freq: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    if (!enabled) return;
    const ac = getCtx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration);
}

/** Soft high tick for hovers. */
export function playTick() {
    blip(2600, 0.045, 0.028, 'sine');
}

/** Rounder blip for clicks / selections. */
export function playClick() {
    blip(880, 0.09, 0.05, 'triangle');
    blip(1760, 0.06, 0.03, 'sine');
}

/** Low whoosh-ish pulse for big transitions. */
export function playWhoosh() {
    if (!enabled) return;
    const ac = getCtx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ac.currentTime + 0.35);
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.35);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.35);
}

export function isSoundEnabled() {
    return enabled;
}

export function setSoundEnabled(on: boolean) {
    enabled = on;
    try {
        localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch {
        /* private mode — non-fatal */
    }
    if (on) playClick();
}
