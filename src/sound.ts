/* WebAudio UI + ambient sound design.
   Everything is off by default and gated behind the nav toggle — browsers
   block autoplay audio, and unsolicited sound is hostile. */

const STORAGE_KEY = 'dan-ui-sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambientEl: HTMLAudioElement | null = null;
let ambientGain: GainNode | null = null;
let ambientSrc: MediaElementAudioSourceNode | null = null;
let enabled = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'on';

function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
}

function blip(freq: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    if (!enabled) return;
    const ac = getCtx();
    if (!ac || !master) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
    osc.connect(gain).connect(master);
    osc.start();
    osc.stop(ac.currentTime + duration);
}

/** Soft high tick for hovers. */
export function playTick() {
    blip(2600, 0.045, 0.024, 'sine');
}

/** Rounder blip for clicks / selections. */
export function playClick() {
    blip(880, 0.09, 0.045, 'triangle');
    blip(1760, 0.06, 0.026, 'sine');
}

/** Low swell used when a major section comes into view. */
export function playSwell() {
    if (!enabled) return;
    const ac = getCtx();
    if (!ac || !master) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ac.currentTime + 0.9);
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ac.currentTime + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.9);
    osc.connect(filter).connect(gain).connect(master);
    osc.start();
    osc.stop(ac.currentTime + 0.9);
}

/** Legacy alias kept so existing call sites keep working. */
export const playWhoosh = playSwell;

/* ---------- Ambient bed ---------- */

function ensureAmbient() {
    const ac = getCtx();
    if (!ac || !master || ambientEl) return;

    const el = new Audio();
    el.src = '/ambient/ambience.opus';
    el.loop = true;
    el.crossOrigin = 'anonymous';
    el.preload = 'auto';
    // Fall back to AAC where Opus-in-audio isn't supported (Safari).
    if (el.canPlayType('audio/ogg; codecs=opus') === '') el.src = '/ambient/ambience.m4a';

    const src = ac.createMediaElementSource(el);
    const gain = ac.createGain();
    gain.gain.value = 0;
    src.connect(gain).connect(master);

    ambientEl = el;
    ambientGain = gain;
    ambientSrc = src;
}

function fadeAmbient(to: number, seconds = 1.5) {
    const ac = getCtx();
    if (!ac || !ambientGain) return;
    ambientGain.gain.cancelScheduledValues(ac.currentTime);
    ambientGain.gain.setValueAtTime(Math.max(ambientGain.gain.value, 0.0001), ac.currentTime);
    ambientGain.gain.linearRampToValueAtTime(to, ac.currentTime + seconds);
}

/** Scroll velocity subtly opens the ambient bed — motion becomes audible. */
export function setScrollIntensity(v: number) {
    if (!enabled || !ambientGain) return;
    const ac = getCtx();
    if (!ac) return;
    const target = 0.12 + Math.min(Math.abs(v) / 40, 1) * 0.16;
    ambientGain.gain.setTargetAtTime(target, ac.currentTime, 0.4);
}

/* The velocity feed used to be a permanent 120ms interval in App, running for
   the life of the page even with sound off. It now exists only while enabled. */
let velocityTimer: number | null = null;

function startVelocityFeed(read: () => number) {
    if (velocityTimer !== null) return;
    velocityTimer = window.setInterval(() => setScrollIntensity(read()), 140);
}

function stopVelocityFeed() {
    if (velocityTimer === null) return;
    window.clearInterval(velocityTimer);
    velocityTimer = null;
}

/** Supplies the scroll-velocity source; only polled while sound is on. */
let velocitySource: (() => number) | null = null;

export function registerVelocitySource(read: () => number) {
    velocitySource = read;
    if (enabled) startVelocityFeed(read);
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

    if (on) {
        getCtx();
        ensureAmbient();
        void ambientEl?.play().catch(() => {
            /* still blocked — the toggle click should satisfy autoplay, but never throw */
        });
        fadeAmbient(0.14);
        if (velocitySource) startVelocityFeed(velocitySource);
        playClick();
    } else {
        stopVelocityFeed();
        fadeAmbient(0, 0.5);
        window.setTimeout(() => ambientEl?.pause(), 550);
    }
}

/** Release audio resources (used on unmount in dev/HMR). */
export function teardownSound() {
    ambientEl?.pause();
    ambientSrc?.disconnect();
    ambientGain?.disconnect();
    ambientEl = null;
    ambientSrc = null;
    ambientGain = null;
}
