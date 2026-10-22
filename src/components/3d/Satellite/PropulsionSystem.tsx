import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulator } from '../../../context/SimulatorContext';

export const PropulsionSystem: React.FC = () => {
  const {
    selectedSubsystem,
    setSelectedSubsystem,
    hoveredSubsystem,
    setHoveredSubsystem
  } = useSimulator();

  const isSelected = selectedSubsystem === 'PROPULSION_SYSTEM';
  const isHovered = hoveredSubsystem === 'PROPULSION_SYSTEM';

  const thrusterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isSelected ? 0xef4444 : (isHovered ? 0xdc2626 : 0x555a62),
        emissive: isSelected ? 0xb91c1c : (isHovered ? 0x991b1b : 0x000000),
        emissiveIntensity: isSelected ? 0.7 : (isHovered ? 0.35 : 0),
        roughness: 0.3,
        metalness: 0.92
      }),
    [isSelected, isHovered]
  );

  const aluMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xdde5ed, roughness: 0.3, metalness: 0.8 }),
    []
  );

  return (
    <group
      name="PROPULSION_SYSTEM"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSubsystem('PROPULSION_SYSTEM');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSubsystem('PROPULSION_SYSTEM');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredSubsystem(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* İtki Taban Plakası */}
      <mesh position={[0, -1.2, -0.4]} material={aluMat}>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
      </mesh>

      {/* Ana HALE Elektrikli İtki Motor Çanı */}
      <mesh
        position={[0, -1.38, -0.4]}
        rotation={[Math.PI, 0, 0]}
        material={thrusterMat}
      >
        <coneGeometry args={[0.12, 0.28, 24, 1, true]} />
      </mesh>

      {/* 4 Köşe Soğuk Gaz Manevra Nozulları (RCS) */}
      {[
        [0.2, -1.25, -0.2],
        [-0.2, -1.25, -0.2],
        [0.2, -1.25, -0.6],
        [-0.2, -1.25, -0.6]
      ].map(([rx, ry, rz], idx) => (
        <mesh
          key={idx}
          position={[rx, ry, rz]}
          rotation={[Math.PI, 0, 0]}
          material={thrusterMat}
        >
          <coneGeometry args={[0.03, 0.08, 12, 1, true]} />
        </mesh>
      ))}
    </group>
  );
};
