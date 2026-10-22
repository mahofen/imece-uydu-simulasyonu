import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';

export const SignalWaves: React.FC = () => {
  const { selectedSubsystem, signalMode } = useSimulator();
  const groupRef = useRef<THREE.Group>(null);

  const ringCount = 5;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * 2.0;

    groupRef.current.children.forEach((child, idx) => {
      const ring = child as THREE.Mesh;
      // Halka dalgalarının sırayla büyümesi ve solması
      const phase = (t + idx * (1.0 / ringCount)) % 1.0;
      const scale = 0.2 + phase * 4.5;
      ring.scale.set(scale, scale, scale);

      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, (1.0 - phase) * 0.7);
    });
  });

  const isCommsActive = selectedSubsystem === 'COMMUNICATION_SYSTEM' || signalMode !== 'none';

  if (!isCommsActive) return null;

  const waveColor = signalMode === 'uplink' ? '#f59e0b' : '#38bdf8';

  return (
    <group
      ref={groupRef}
      position={[-1.0, -1.3, -0.85]}
      rotation={[Math.PI * 0.75, -Math.PI * 0.2, 0]}
    >
      {Array.from({ length: ringCount }).map((_, idx) => (
        <mesh key={idx}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial
            color={waveColor}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};
