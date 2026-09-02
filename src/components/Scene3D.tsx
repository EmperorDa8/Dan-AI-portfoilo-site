import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { prefersReducedMotion, scrollState } from '../lib/scroll';

const COUNT = 90;
const PALETTE = ['#387478', '#a5bcba', '#c8e1dd', '#494444'];

/**
 * Deterministic field generator.
 *
 * `Math.random()` during render is impure — React may re-run a `useMemo` body at
 * any time, which would silently re-scatter the whole field mid-scroll. A seeded
 * generator makes the layout a pure function of the seed: stable across renders,
 * and reproducible when something looks wrong.
 */
function mulberry32(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function buildShards() {
    const rand = mulberry32(0x5ea4d5);
    return Array.from({ length: COUNT }, (_, i) => ({
        position: [(rand() - 0.5) * 26, (rand() - 0.5) * 34, (rand() - 0.5) * 22] as [number, number, number],
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI] as [number, number, number],
        scale: 0.22 + rand() * 0.75,
        speed: 0.06 + rand() * 0.22,
        phase: rand() * Math.PI * 2,
        color: new THREE.Color(PALETTE[i % PALETTE.length]),
    }));
}

/**
 * Drifting shard field. Scroll dollies the whole cluster through the camera and
 * spins it slowly; the pointer adds a gentle lateral sway.
 */
function Shards() {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const group = useRef<THREE.Group>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const pointer = useRef({ x: 0, y: 0 });

    const shards = useMemo(() => buildShards(), []);

    // Bake per-instance colors once.
    useEffect(() => {
        const m = mesh.current;
        if (!m) return;
        shards.forEach((s, i) => m.setColorAt(i, s.color));
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }, [shards]);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            pointer.current.x = e.clientX / window.innerWidth - 0.5;
            pointer.current.y = e.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    useFrame((state, delta) => {
        const m = mesh.current;
        const g = group.current;
        if (!m || !g) return;

        const t = state.clock.elapsedTime;
        const p = scrollState.progress;

        // Scroll drives depth travel + slow rotation of the whole field.
        g.position.z = THREE.MathUtils.damp(g.position.z, p * 26, 3, delta);
        g.rotation.y = THREE.MathUtils.damp(g.rotation.y, p * Math.PI * 0.85, 3, delta);
        g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.current.y * 0.18, 3, delta);
        g.position.x = THREE.MathUtils.damp(g.position.x, pointer.current.x * -2.2, 3, delta);

        for (let i = 0; i < COUNT; i++) {
            const s = shards[i];
            dummy.position.set(
                s.position[0],
                s.position[1] + Math.sin(t * s.speed + s.phase) * 0.9,
                s.position[2]
            );
            dummy.rotation.set(
                s.rotation[0] + t * s.speed * 0.35,
                s.rotation[1] + t * s.speed * 0.5,
                s.rotation[2]
            );
            dummy.scale.setScalar(s.scale);
            dummy.updateMatrix();
            m.setMatrixAt(i, dummy.matrix);
        }
        m.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={group}>
            <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    roughness={0.42}
                    metalness={0.12}
                    transparent
                    opacity={0.5}
                    flatShading
                />
            </instancedMesh>
        </group>
    );
}

export function Scene3D() {
    const [enabled, setEnabled] = useState(false);
    const [inRange, setInRange] = useState(true);

    // Gate re-evaluates on resize — it previously ran once, so a desktop window
    // narrowed to phone width kept WebGL running.
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 820px)');
        const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
        const evaluate = () => setEnabled(!prefersReducedMotion() && !mq.matches && !lowPower);
        evaluate();
        mq.addEventListener('change', evaluate);
        return () => mq.removeEventListener('change', evaluate);
    }, []);

    // Scoped to the first ~1.6 screens. Past that the field has flown behind the
    // camera and is occluded anyway, so rendering it was pure waste.
    useEffect(() => {
        const onScroll = () => setInRange(window.scrollY < window.innerHeight * 1.6);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Never render while the tab is hidden. This is tracked separately from
       `inRange`: folding it into that flag meant returning to the tab restored
       the already-false value, so the scene never came back. */
    const [visible, setVisible] = useState(!document.hidden);
    useEffect(() => {
        const onVis = () => setVisible(!document.hidden);
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
    }, []);

    if (!enabled || !inRange || !visible) return null;

    return (
        <div className="scene3d" aria-hidden>
            <Canvas
                dpr={[1, 1.25]}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0, 18], fov: 42 }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[6, 10, 8]} intensity={1.5} color="#fff6e8" />
                <directionalLight position={[-8, -4, -6]} intensity={0.7} color="#cbe3d8" />
                <Shards />
                <fog attach="fog" args={['#faf8f3', 16, 46]} />
            </Canvas>
        </div>
    );
}
