import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulator } from '../../../context/SimulatorContext';
import { createGoldMLITexture } from '../../../utils/textures';

export const OpticalCamera: React.FC = () => {
  const {
    selectedSubsystem,
    setSelectedSubsystem,
    hoveredSubsystem,
    setHoveredSubsystem
  } = useSimulator();

  const isSelected = selectedSubsystem === 'ELECTRO_OPTICAL_CAMERA';
  const isHovered = hoveredSubsystem === 'ELECTRO_OPTICAL_CAMERA';

  const goldMLITexture = useMemo(() => createGoldMLITexture(), []);

  const darkOpticalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isSelected ? 0x064e3b : (isHovered ? 0x065f46 : 0x181c24),
        emissive: isSelected ? 0x10b981 : (isHovered ? 0x047857 : 0x000000),
        emissiveIntensity: isSelected ? 0.45 : (isHovered ? 0.25 : 0),
        roughness: 0.5,
        metalness: 0.45
      }),
    [isSelected, isHovered]
  );

  const lensGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x1a4968,
        transmission: 0.65,
        opacity: 0.92,
        transparent: true,
        roughness: 0.04,
        metalness: 0.12,
        ior: 1.55,
        reflectivity: 0.95
      }),
    []
  );

  const goldMirrorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.08,
        metalness: 0.98
      }),
    []
  );

  const hoodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xdf9e16,
        roughness: 0.28,
        metalness: 0.85,
        map: goldMLITexture
      }),
    [goldMLITexture]
  );

  return (
    <group
      name="ELECTRO_OPTICAL_CAMERA"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSubsystem('ELECTRO_OPTICAL_CAMERA');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSubsystem('ELECTRO_OPTICAL_CAMERA');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredSubsystem(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Ana Baffle Silindiri (Karbon Fiber Korumalı Namlu) */}
      <mesh
        position={[0, -0.2, 1.25]}
        rotation={[Math.PI / 2, 0, 0]}
        material={darkOpticalMat}
      >
        <cylinderGeometry args={[0.48, 0.52, 1.1, 32, 1, true]} />
      </mesh>

      {/* İç Yansıma Engelleyici Halkalar (Baffle Rings) */}
      {[0, 1, 2, 3, 4].map((r) => (
        <mesh
          key={r}
          position={[0, -0.2, 0.8 + r * 0.2]}
          material={darkOpticalMat}
        >
          <torusGeometry args={[0.44 - r * 0.015, 0.015, 8, 32]} />
        </mesh>
      ))}

      {/* Ön Cam / Optik Mercek */}
      <mesh
        position={[0, -0.2, 1.7]}
        rotation={[Math.PI / 2, 0, 0]}
        material={lensGlassMat}
      >
        <cylinderGeometry args={[0.44, 0.44, 0.04, 32]} />
      </mesh>

      {/* Örümcek Ayaklar (Spider Vanes) - İkincil Aynayı Tutan Çapraz Kollar */}
      <mesh position={[0, -0.2, 1.68]} material={darkOpticalMat}>
        <boxGeometry args={[0.86, 0.015, 0.06]} />
      </mesh>
      <mesh
        position={[0, -0.2, 1.68]}
        rotation={[0, 0, Math.PI / 2]}
        material={darkOpticalMat}
      >
        <boxGeometry args={[0.86, 0.015, 0.06]} />
      </mesh>

      {/* İkincil Ayna (Secondary Gold Mirror Hub) */}
      <mesh
        position={[0, -0.2, 1.69]}
        rotation={[Math.PI / 2, 0, 0]}
        material={goldMirrorMat}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
      </mesh>

      {/* Baffle Güneş Siperliği (MLI Kesik Güneş Kalkanı) */}
      <mesh
        position={[0, -0.2, 1.85]}
        rotation={[Math.PI / 2, 0, -Math.PI / 4]}
        material={hoodMat}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.35, 32, 1, true, 0, Math.PI * 1.3]} />
      </mesh>
    </group>
  );
};
