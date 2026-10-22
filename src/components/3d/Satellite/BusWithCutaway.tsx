import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulator } from '../../../context/SimulatorContext';
import { INTERNAL_COMPONENTS } from '../../../utils/subsystemsData';
import {
  createGoldMLITexture,
  createMLIBumpMap,
  createBodyDecalTexture
} from '../../../utils/textures';

export const BusWithCutaway: React.FC = () => {
  const {
    selectedSubsystem,
    setSelectedSubsystem,
    hoveredSubsystem,
    setHoveredSubsystem,
    cutawayActive
  } = useSimulator();

  const isSelected = selectedSubsystem === 'BUS_SYSTEM';
  const isHovered = hoveredSubsystem === 'BUS_SYSTEM';

  // Dokular
  const goldMLITexture = useMemo(() => createGoldMLITexture(), []);
  const mliBumpMap = useMemo(() => createMLIBumpMap(), []);
  const bodyDecalTexture = useMemo(() => createBodyDecalTexture(), []);

  // Normal ve yarı saydam kesit malzemeleri
  const outerMaterials = useMemo(() => {
    const opacity = cutawayActive ? 0.32 : 1.0;
    const transparent = cutawayActive;
    const wireframe = cutawayActive;

    const goldMat = new THREE.MeshStandardMaterial({
      color: isSelected ? 0xffcc00 : 0xdf9e16,
      emissive: isSelected ? 0x664400 : (isHovered ? 0x332200 : 0x000000),
      roughness: 0.28,
      metalness: 0.85,
      map: goldMLITexture,
      bumpMap: mliBumpMap,
      bumpScale: 0.05,
      transparent,
      opacity,
      wireframe: false
    });

    const aluMat = new THREE.MeshStandardMaterial({
      color: 0xdde5ed,
      roughness: 0.3,
      metalness: 0.8,
      transparent,
      opacity: cutawayActive ? 0.4 : 1.0
    });

    const decalMat = new THREE.MeshStandardMaterial({
      map: bodyDecalTexture,
      roughness: 0.3,
      metalness: 0.4,
      transparent,
      opacity: cutawayActive ? 0.35 : 1.0
    });

    return [
      goldMat,   // +X
      goldMat,   // -X
      aluMat,    // +Y (Üst radyatör)
      aluMat,    // -Y (Alt PAF arayüzü)
      decalMat,  // +Z (Ön yüz - İMECE & Bayrak)
      goldMat    // -Z (Arka yüz)
    ];
  }, [cutawayActive, isSelected, isHovered, goldMLITexture, mliBumpMap, bodyDecalTexture]);

  return (
    <group
      name="BUS_SYSTEM"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSubsystem('BUS_SYSTEM');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSubsystem('BUS_SYSTEM');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredSubsystem(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Ana Dış Gövde Kutusu */}
      <mesh castShadow receiveShadow material={outerMaterials}>
        <boxGeometry args={[1.6, 2.3, 1.5]} />
      </mesh>

      {/* Yapısal Köşebent Alüminyum Direkler */}
      {[
        [0.8, 0, 0.75],
        [-0.8, 0, 0.75],
        [0.8, 0, -0.75],
        [-0.8, 0, -0.75]
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <cylinderGeometry args={[0.04, 0.04, 2.34, 8]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.25}
            metalness={0.85}
            transparent={cutawayActive}
            opacity={cutawayActive ? 0.5 : 1.0}
          />
        </mesh>
      ))}

      {/* Fırlatıcı Arayüz Halkası (PAF - Payload Attach Fitting) */}
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.28, 32]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* İç Kesit Bileşenleri (Yalnızca kesit modu aktifken veya gövde seçildiğinde parlar) */}
      {cutawayActive && (
        <group name="INTERNAL_SYSTEMS">
          {INTERNAL_COMPONENTS.map((comp) => (
            <group key={comp.id} position={comp.position}>
              <mesh>
                <boxGeometry args={comp.size} />
                <meshStandardMaterial
                  color={comp.color}
                  emissive={comp.color}
                  emissiveIntensity={0.35}
                  roughness={0.2}
                  metalness={0.7}
                />
              </mesh>
              {/* Mikro devre çizgileri / bağlantılar */}
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(...comp.size)]} />
                <lineBasicMaterial color="#ffffff" linewidth={2} />
              </lineSegments>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
