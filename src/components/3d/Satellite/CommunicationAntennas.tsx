import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulator } from '../../../context/SimulatorContext';

export const CommunicationAntennas: React.FC = () => {
  const {
    selectedSubsystem,
    setSelectedSubsystem,
    hoveredSubsystem,
    setHoveredSubsystem
  } = useSimulator();

  const isSelected = selectedSubsystem === 'COMMUNICATION_SYSTEM';
  const isHovered = hoveredSubsystem === 'COMMUNICATION_SYSTEM';

  const dishMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isSelected ? 0xf59e0b : (isHovered ? 0xd97706 : 0xdde5ed),
        emissive: isSelected ? 0xb45309 : (isHovered ? 0x92400e : 0x000000),
        emissiveIntensity: isSelected ? 0.6 : (isHovered ? 0.3 : 0),
        roughness: 0.25,
        metalness: 0.85
      }),
    [isSelected, isHovered]
  );

  const hornMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 0.95
      }),
    []
  );

  const carbonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1f242d,
        roughness: 0.6,
        metalness: 0.25
      }),
    []
  );

  return (
    <group
      name="COMMUNICATION_SYSTEM"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSubsystem('COMMUNICATION_SYSTEM');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSubsystem('COMMUNICATION_SYSTEM');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredSubsystem(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* X-Bant Çanak Anten Taşıyıcı Bom (Boom) */}
      <mesh
        position={[-0.6, -0.9, -0.7]}
        rotation={[0, 0, Math.PI / 4]}
        material={carbonMat}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
      </mesh>

      {/* 2 Eksenli Gimbal Küresi */}
      <mesh position={[-0.85, -1.15, -0.7]} material={dishMat}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>

      {/* Parabolik X-Bant Çanak Anten Reflektörü */}
      <mesh
        position={[-1.0, -1.3, -0.85]}
        rotation={[Math.PI * 0.75, -Math.PI * 0.2, 0]}
        material={dishMat}
      >
        <sphereGeometry args={[0.35, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
      </mesh>

      {/* Odaktaki Besleme Hunisi (Feed Horn) */}
      <mesh
        position={[-0.95, -1.25, -0.8]}
        rotation={[Math.PI * 0.75, 0, 0]}
        material={hornMat}
      >
        <coneGeometry args={[0.05, 0.14, 16]} />
      </mesh>

      {/* S-Bant TT&C Konik Horn Antenleri (Üst ve Alt) */}
      <mesh position={[0.4, 1.25, 0.3]} material={hornMat}>
        <coneGeometry args={[0.06, 0.18, 16]} />
      </mesh>
      <mesh
        position={[0.4, -1.25, -0.3]}
        rotation={[Math.PI, 0, 0]}
        material={hornMat}
      >
        <coneGeometry args={[0.06, 0.18, 16]} />
      </mesh>

      {/* GPS Alıcı Yaması (Patch Antenna) */}
      <mesh position={[-0.4, 1.17, 0.3]} material={dishMat}>
        <boxGeometry args={[0.14, 0.03, 0.14]} />
      </mesh>

      {/* Çubuk Telemetri Antenleri (Whip Antennas) */}
      <mesh
        position={[0.85, 1.35, -0.7]}
        rotation={[0, 0, Math.PI / 4]}
        material={carbonMat}
      >
        <cylinderGeometry args={[0.006, 0.003, 0.8, 8]} />
      </mesh>
      <mesh
        position={[-0.85, 1.35, -0.7]}
        rotation={[0, 0, -Math.PI / 4]}
        material={carbonMat}
      >
        <cylinderGeometry args={[0.006, 0.003, 0.8, 8]} />
      </mesh>
    </group>
  );
};
