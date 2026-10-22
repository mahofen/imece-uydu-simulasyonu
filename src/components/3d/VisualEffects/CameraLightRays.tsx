import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';

export const CameraLightRays: React.FC = () => {
  const { selectedSubsystem, mode, imagingPhase } = useSimulator();
  const coneRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (coneRef.current) {
      const mat = coneRef.current.material as THREE.MeshBasicMaterial;
      const speed = imagingPhase === 'CAPTURING' ? 8 : 3;
      mat.opacity = 0.22 + Math.sin(clock.getElapsedTime() * speed) * 0.12;
    }
  });

  const isCameraActive =
    selectedSubsystem === 'ELECTRO_OPTICAL_CAMERA' ||
    (mode === 'IMAGING_MISSION' && (imagingPhase === 'SLEWING' || imagingPhase === 'CAPTURING'));

  if (!isCameraActive && mode !== 'ORBIT') return null;

  return (
    <group position={[0, -0.2, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
      {/* Şeffaf Işık Piramidi / Konisi (Zeminden Kameraya Işık Akışı) */}
      <mesh ref={coneRef} position={[0, 4.5, 0]}>
        <coneGeometry args={[1.6, 9.0, 32, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Merkezdeki Işık Çizgileri */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.02, 0.4, 9.0, 8, 1, true]} />
        <meshBasicMaterial
          color="#a7f3d0"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
