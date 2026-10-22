import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulator } from '../../../context/SimulatorContext';

export const ADCSSystem: React.FC = () => {
  const {
    selectedSubsystem,
    setSelectedSubsystem,
    hoveredSubsystem,
    setHoveredSubsystem
  } = useSimulator();

  const isSelected = selectedSubsystem === 'ADCS_SYSTEM';
  const isHovered = hoveredSubsystem === 'ADCS_SYSTEM';

  const trackerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isSelected ? 0x8b5cf6 : (isHovered ? 0x7c3aed : 0x1e293b),
        emissive: isSelected ? 0x6d28d9 : (isHovered ? 0x5b21b6 : 0x000000),
        emissiveIntensity: isSelected ? 0.7 : (isHovered ? 0.35 : 0),
        roughness: 0.3,
        metalness: 0.8
      }),
    [isSelected, isHovered]
  );

  const aluMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xdde5ed, roughness: 0.3, metalness: 0.8 }),
    []
  );

  return (
    <group
      name="ADCS_SYSTEM"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSubsystem('ADCS_SYSTEM');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSubsystem('ADCS_SYSTEM');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredSubsystem(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Yıldız İzler (Star Tracker 1 - Sağ Üst Açı) */}
      <mesh
        position={[0.82, 0.7, -0.4]}
        rotation={[0, Math.PI / 6, -Math.PI / 3]}
        material={trackerMat}
      >
        <cylinderGeometry args={[0.05, 0.07, 0.22, 16]} />
      </mesh>

      {/* Yıldız İzler (Star Tracker 2 - Sol Üst Açı) */}
      <mesh
        position={[-0.82, 0.7, -0.4]}
        rotation={[0, -Math.PI / 6, Math.PI / 3]}
        material={trackerMat}
      >
        <cylinderGeometry args={[0.05, 0.07, 0.22, 16]} />
      </mesh>

      {/* Manyetik Tork Çubuğu (Magnetorquer Bar) */}
      <mesh
        position={[0, 1.18, -0.5]}
        rotation={[0, 0, Math.PI / 2]}
        material={aluMat}
      >
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
      </mesh>
    </group>
  );
};
