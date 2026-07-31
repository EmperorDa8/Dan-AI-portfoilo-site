import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { prefersReducedMotion, scrollState } from '../lib/scroll';

const COUNT = 90;
const PALETTE = ['#387478', '#a5bcba', '#c8e1dd', '#494444'];

/**
 * Drifting shard field. Scroll dollies the whole cluster through the camera and
 * spins it slowly; the pointer adds a gentle lateral sway.
 */
function Shards() {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const group = useRef<THREE.Group>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const pointer = useRef({ x: 0, y: 0 });

    const shards = useMemo(
        () =>
            Array.from({ length: COUNT }, (_, i) => ({
                position: [
                    (Math.random() - 0.5) * 26,
                    (Math.random() - 0.5) * 34,
                    (Math.random() - 0.5) * 22,
                ] as [number, number, number],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
                    number,
                    number,
                    number,
                ],
                scale: 0.22 + Math.random() * 0.75,
                speed: 0.06 + Math.random() * 0.22,
                phase: Math.random() * Math.PI * 2,
                color: new THREE.Color(PALETTE[i % PALETTE.length]),
            })),
        []
    );

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

    useEffect(() => {
        // Skip WebGL on reduced-motion, small screens, and low-core devices.
        const smallScreen = window.matchMedia('(max-width: 820px)').matches;
        const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
        setEnabled(!prefersReducedMotion() && !smallScreen && !lowPower);
    }, []);

    if (!enabled) return null;

    return (
        <div className="scene3d" aria-hidden>
            <Canvas
                dpr={[1, 1.6]}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0, 18], fov: 42 }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[6, 10, 8]} intensity={1.5} color="#fff6e8" />
                <directionalLight position={[-8, -4, -6]} intensity={0.7} color="#c8e1dd" />
                <Shards />
                <fog attach="fog" args={['#fbfaf6', 16, 46]} />
            </Canvas>
        </div>
    );
}
