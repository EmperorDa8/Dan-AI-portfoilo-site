import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, Line } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Small 3D figures, one per section, each drawn from what that section is
 * about. They share a "technical drawing" look — flat paper fills, ink edges,
 * one teal accent — so they sit with the ruled cells and window chrome rather
 * than reading as decoration from somewhere else.
 *
 * Everything animates on a fixed loop computed from the clock, with no state
 * and no randomness at render time, so a figure looks the same every visit.
 *
 * This file pulls in three.js; it is only ever loaded through FigureSlot,
 * which lazy-imports it when a figure is about to scroll into view.
 */

export type FigureKind = 'ship' | 'calendar' | 'document' | 'film' | 'graph' | 'rings';

const INK = '#23231f';
const ACCENT = '#2f6b60';
const PAPER = '#fdfcf9';
const MUTED = '#c3bdb2';

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
/** Deterministic 0…1 from two integers — stands in for Math.random(). */
const rnd = (i: number, k: number) => {
    const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
};

/* ------------------------------------------------------------------ *
 * Shipped products — six releases stacking up, one after another
 * ------------------------------------------------------------------ */
function Ship() {
    const group = useRef<THREE.Group>(null);
    const slabs = useRef<(THREE.Mesh | null)[]>([]);
    const COUNT = 6; // one per live product
    const T = 7.5;

    useFrame(({ clock }) => {
        const t = clock.elapsedTime % T;
        const leaving = ease((t - (T - 0.8)) / 0.8);
        slabs.current.forEach((m, i) => {
            if (!m) return;
            const arrive = ease((t - 0.2 - i * 0.5) / 0.9);
            m.position.y = -0.72 + i * 0.27 - (1 - arrive) * 1.5;
            m.scale.setScalar(Math.max(0.0001, arrive * (1 - leaving)));
        });
        if (group.current) group.current.rotation.y = -0.62 + Math.sin(clock.elapsedTime * 0.45) * 0.14;
    });

    return (
        <group ref={group} rotation={[0.44, -0.62, 0]}>
            {Array.from({ length: COUNT }, (_, i) => (
                <mesh key={i} ref={el => (slabs.current[i] = el)}>
                    <boxGeometry args={[2.1, 0.13, 1.3]} />
                    <meshBasicMaterial color={i === COUNT - 1 ? ACCENT : PAPER} />
                    <Edges color={INK} threshold={15} />
                </mesh>
            ))}
        </group>
    );
}

/* ------------------------------------------------------------------ *
 * Xamio — a scattered timetable settles into a calendar, and the
 * student's own exams step forward out of it
 * ------------------------------------------------------------------ */
function Calendar() {
    const group = useRef<THREE.Group>(null);
    const tiles = useRef<(THREE.Mesh | null)[]>([]);
    const COLS = 6;
    const ROWS = 4;
    const EXAMS = [4, 9, 15, 20];
    const T = 8;

    useFrame(({ clock }) => {
        const t = clock.elapsedTime % T;
        const leaving = ease((t - (T - 0.7)) / 0.7);
        tiles.current.forEach((m, i) => {
            if (!m) return;
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const settle = ease((t - 0.1 - (col + row) * 0.09) / 1.1) * (1 - leaving);
            const gx = (col - (COLS - 1) / 2) * 0.44;
            const gy = ((ROWS - 1) / 2 - row) * 0.44;
            const sx = (rnd(i, 1) - 0.5) * 3.4;
            const sy = (rnd(i, 2) - 0.5) * 2.2;
            m.position.x = gx + sx * (1 - settle);
            m.position.y = gy + sy * (1 - settle);
            m.rotation.z = (rnd(i, 3) - 0.5) * 2.4 * (1 - settle);

            const order = EXAMS.indexOf(i);
            const found = order >= 0 ? ease((t - 2.6 - order * 0.55) / 0.5) * (1 - leaving) : 0;
            m.position.z = found * 0.42;
        });
        if (group.current) group.current.rotation.y = -0.42 + Math.sin(clock.elapsedTime * 0.4) * 0.1;
    });

    return (
        <group ref={group} rotation={[0.28, -0.42, 0]}>
            {Array.from({ length: COLS * ROWS }, (_, i) => (
                <mesh key={i} ref={el => (tiles.current[i] = el)}>
                    <boxGeometry args={[0.36, 0.36, 0.06]} />
                    <meshBasicMaterial color={EXAMS.includes(i) ? ACCENT : PAPER} />
                    <Edges color={INK} threshold={15} />
                </mesh>
            ))}
        </group>
    );
}

/* ------------------------------------------------------------------ *
 * Veridic — a dense page; a highlight moves down it and each line it
 * touches lifts off the page to be read
 * ------------------------------------------------------------------ */
function Document() {
    const group = useRef<THREE.Group>(null);
    const lines = useRef<(THREE.Mesh | null)[]>([]);
    const marker = useRef<THREE.Mesh>(null);
    const WIDTHS = [1.25, 1.34, 0.92, 1.28, 1.12, 1.34, 0.74, 1.05];
    const STEP = 0.8;

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        const active = Math.floor(t / STEP) % WIDTHS.length;
        const within = (t % STEP) / STEP;
        const lift = Math.sin(within * Math.PI);
        lines.current.forEach((m, i) => {
            if (!m) return;
            const on = i === active;
            m.position.z = 0.07 + (on ? lift * 0.34 : 0);
            (m.material as THREE.MeshBasicMaterial).color.set(on ? ACCENT : MUTED);
        });
        if (marker.current) {
            marker.current.position.y = 0.78 - active * 0.22;
            marker.current.scale.x = Math.max(0.001, WIDTHS[active] / 1.34);
            marker.current.position.x = -0.67 + WIDTHS[active] / 2;
        }
        if (group.current) group.current.rotation.y = -0.5 + Math.sin(t * 0.4) * 0.12;
    });

    return (
        <group ref={group} rotation={[0.16, -0.5, 0.04]}>
            {[2, 1, 0].map(depth => (
                <mesh key={depth} position={[depth * 0.07, depth * -0.06, depth * -0.07]}>
                    <boxGeometry args={[1.8, 2.3, 0.03]} />
                    <meshBasicMaterial color={PAPER} />
                    <Edges color={INK} threshold={15} />
                </mesh>
            ))}
            <mesh ref={marker} position={[0, 0.78, 0.05]}>
                <planeGeometry args={[1.42, 0.17]} />
                <meshBasicMaterial color={ACCENT} transparent opacity={0.18} />
            </mesh>
            {WIDTHS.map((w, i) => (
                <mesh key={i} ref={el => (lines.current[i] = el)} position={[-0.67 + w / 2, 0.78 - i * 0.22, 0.07]}>
                    <boxGeometry args={[w, 0.07, 0.02]} />
                    <meshBasicMaterial color={MUTED} />
                </mesh>
            ))}
        </group>
    );
}

/* ------------------------------------------------------------------ *
 * Prompts as production systems — the same character across five shots.
 * It drifts from frame to frame, then the spec locks it and every frame
 * matches.
 * ------------------------------------------------------------------ */
function Film() {
    const group = useRef<THREE.Group>(null);
    const figures = useRef<(THREE.Group | null)[]>([]);
    const rule = useRef<THREE.Mesh>(null);
    const FRAMES = 5;
    const T = 6.5;

    useFrame(({ clock }) => {
        const t = clock.elapsedTime % T;
        // 0–2.2 drifting, 2.2–3.1 locking, 3.1–5.6 locked, 5.6–6.5 releasing
        const lock = ease((t - 2.2) / 0.9) * (1 - ease((t - 5.6) / 0.9));
        const loose = 1 - lock;
        figures.current.forEach((g, i) => {
            if (!g) return;
            const wobble = Math.sin(clock.elapsedTime * (1.1 + i * 0.23) + i);
            g.position.x = (rnd(i, 4) - 0.5) * 0.26 * loose;
            g.position.y = (rnd(i, 5) - 0.5) * 0.3 * loose;
            g.rotation.z = ((rnd(i, 6) - 0.5) * 1.3 + wobble * 0.18) * loose;
            g.scale.setScalar(1 + (rnd(i, 7) - 0.5) * 0.7 * loose);
        });
        if (rule.current) rule.current.scale.x = Math.max(0.001, lock);
        if (group.current) group.current.rotation.y = -0.3 + Math.sin(clock.elapsedTime * 0.4) * 0.1;
    });

    return (
        <group ref={group} rotation={[0.12, -0.3, 0]}>
            <mesh ref={rule} position={[0, 0.16, 0.03]}>
                <boxGeometry args={[FRAMES * 0.92, 0.014, 0.01]} />
                <meshBasicMaterial color={ACCENT} />
            </mesh>
            {Array.from({ length: FRAMES }, (_, i) => (
                <group key={i} position={[(i - (FRAMES - 1) / 2) * 0.92, 0, 0]}>
                    <mesh>
                        <boxGeometry args={[0.8, 1.06, 0.03]} />
                        <meshBasicMaterial color={PAPER} />
                        <Edges color={INK} threshold={15} />
                    </mesh>
                    <group ref={el => (figures.current[i] = el)} position={[0, 0, 0.04]}>
                        <mesh position={[0, 0.16, 0]}>
                            <circleGeometry args={[0.12, 24]} />
                            <meshBasicMaterial color={INK} />
                        </mesh>
                        <mesh position={[0, -0.2, 0]}>
                            <coneGeometry args={[0.2, 0.42, 3]} />
                            <meshBasicMaterial color={INK} />
                        </mesh>
                    </group>
                </group>
            ))}
        </group>
    );
}

/* ------------------------------------------------------------------ *
 * Client systems — nine agents; work passes from one to the next and
 * stops at the gate in the middle until a human lets it through
 * ------------------------------------------------------------------ */
const NODES: [number, number, number][] = [
    [-1.5, 0.85, 0.1], [0, 0.95, -0.25], [1.5, 0.8, 0.15],
    [-1.45, 0, -0.2], [0, 0, 0.3], [1.5, 0.05, -0.15],
    [-1.5, -0.85, 0.15], [0, -0.92, -0.2], [1.45, -0.85, 0.1],
];
const ROUTE = [0, 1, 2, 5, 4, 3, 6, 7, 8];
const GATE = 4;

function Graph() {
    const group = useRef<THREE.Group>(null);
    const pulse = useRef<THREE.Mesh>(null);
    const gate = useRef<THREE.Mesh>(null);
    const HOP = 0.55; // seconds per hop
    const HOLD = 1.1; // seconds waiting at the gate
    const gateStep = ROUTE.indexOf(GATE);
    const T = (ROUTE.length - 1) * HOP + HOLD + 0.8;

    useFrame(({ clock }) => {
        let t = clock.elapsedTime % T;
        let waiting = 0;
        const reach = gateStep * HOP;
        if (t > reach && t < reach + HOLD) {
            waiting = Math.sin(((t - reach) / HOLD) * Math.PI);
            t = reach;
        } else if (t >= reach + HOLD) {
            t -= HOLD;
        }
        const f = Math.min(t / HOP, ROUTE.length - 1);
        const a = Math.min(Math.floor(f), ROUTE.length - 2);
        const k = ease(f - a);
        const from = NODES[ROUTE[a]];
        const to = NODES[ROUTE[a + 1]];
        if (pulse.current) {
            pulse.current.position.set(
                from[0] + (to[0] - from[0]) * k,
                from[1] + (to[1] - from[1]) * k,
                from[2] + (to[2] - from[2]) * k
            );
            pulse.current.visible = f < ROUTE.length - 1;
        }
        if (gate.current) {
            gate.current.scale.setScalar(1 + waiting * 0.55);
            gate.current.rotation.y = clock.elapsedTime * 0.8;
        }
        if (group.current) group.current.rotation.y = -0.35 + Math.sin(clock.elapsedTime * 0.35) * 0.18;
    });

    return (
        <group ref={group} rotation={[0.2, -0.35, 0]}>
            {ROUTE.slice(0, -1).map((n, i) => (
                <Line key={i} points={[NODES[n], NODES[ROUTE[i + 1]]]} color={INK} lineWidth={1} transparent opacity={0.45} />
            ))}
            {NODES.map((p, i) =>
                i === GATE ? (
                    <mesh key={i} ref={gate} position={p}>
                        <octahedronGeometry args={[0.2, 0]} />
                        <meshBasicMaterial color={PAPER} />
                        <Edges color={ACCENT} threshold={1} />
                    </mesh>
                ) : (
                    <mesh key={i} position={p}>
                        <sphereGeometry args={[0.085, 16, 16]} />
                        <meshBasicMaterial color={INK} />
                    </mesh>
                )
            )}
            <mesh ref={pulse}>
                <sphereGeometry args={[0.12, 20, 20]} />
                <meshBasicMaterial color={ACCENT} />
            </mesh>
        </group>
    );
}

/* ------------------------------------------------------------------ *
 * Bio — three disciplines, linked and turning as one
 * ------------------------------------------------------------------ */
function Rings() {
    const a = useRef<THREE.Mesh>(null);
    const b = useRef<THREE.Mesh>(null);
    const c = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (a.current) a.current.rotation.set(t * 0.32, t * 0.18, 0);
        if (b.current) b.current.rotation.set(Math.PI / 2 + t * 0.14, t * 0.36, 0);
        if (c.current) c.current.rotation.set(t * -0.22, Math.PI / 2, t * 0.3);
    });

    const ring = (ref: React.RefObject<THREE.Mesh | null>, color: string, tube: number) => (
        <mesh ref={ref}>
            <torusGeometry args={[1.05, tube, 12, 120]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );

    return (
        <group>
            {ring(a, INK, 0.012)}
            {ring(b, INK, 0.012)}
            {ring(c, ACCENT, 0.02)}
        </group>
    );
}

const SCENES: Record<FigureKind, { node: () => React.JSX.Element; z: number }> = {
    ship: { node: Ship, z: 5.3 },
    calendar: { node: Calendar, z: 4.9 },
    document: { node: Document, z: 5.4 },
    film: { node: Film, z: 5.7 },
    graph: { node: Graph, z: 5.3 },
    rings: { node: Rings, z: 5.2 },
};

export default function Figure3D({ kind }: { kind: FigureKind }) {
    const { node: Scene, z } = SCENES[kind];
    return (
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, z], fov: 30 }}>
            <Scene />
        </Canvas>
    );
}
