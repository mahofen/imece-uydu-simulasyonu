import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';
import {
  createSolarPanelTexture,
  createCarbonFiberTexture
} from '../../../utils/textures';

interface SolarWingProps {
  side: 'left' | 'right';
  isSelected: boolean;
  isHovered: boolean;
  solarTexture: THREE.CanvasTexture;
  carbonTexture: THREE.CanvasTexture;
}

const SolarWing: React.FC<SolarWingProps> = ({
  side,
  isSelected,
  isHovered,
  solarTexture,
  carbonTexture
}) => {
  const dir = side === 'right' ? 1 : -1;
  const wingRef = useRef<THREE.Group>(null);

  // İnce güneş takip motoru salınımı
  useFrame(({ clock }) => {
    if (wingRef.current && isSelected) {
      wingRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  const aluMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xdde5ed, roughness: 0.3, metalness: 0.8 }),
    []
  );

  const carbonMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: carbonTexture, roughness: 0.65, metalness: 0.25 }),
    [carbonTexture]
  );

  const solarMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: solarTexture,
        roughness: 0.15,
        metalness: 0.9,
        emissive: isSelected ? 0x0284c7 : (isHovered ? 0x0369a1 : 0x000000),
        emissiveIntensity: isSelected ? 0.6 : (isHovered ? 0.3 : 0)
      }),
    [solarTexture, isSelected, isHovered]
  );

  const panelMats = useMemo(() => [
    aluMat, aluMat, aluMat, aluMat,
    solarMat, // Ön yüz (+Z)
    carbonMat // Arka yüz (-Z)
  ], [aluMat, solarMat, carbonMat]);

  return (
    <group ref={wingRef}>
      {/* SADM (Solar Array Drive Mechanism) Motor Silindiri */}
      <mesh position={[dir * 0.9, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.25, 16]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Yoke Kolu (CFRP Taşıyıcı Kiriş) */}
      <mesh position={[dir * 1.15, 0.3, 0]}>
        <boxGeometry args={[0.35, 0.06, 0.12]} />
        <primitive object={carbonMat} />
      </mesh>

      {/* 2 Kademeli Güneş Paneli Kanadı */}
      {[
        { posX: dir * 1.9, width: 1.15 },
        { posX: dir * 3.15, width: 1.15 }
      ].map((seg, idx) => (
        <group key={idx} position={[seg.posX, 0.3, 0]}>
          <mesh castShadow receiveShadow material={panelMats}>
            <boxGeometry args={[seg.width, 1.85, 0.04]} />
          </mesh>

          {/* Arka Yüz Alüminyum Destek Fitilleri */}
          {[-0.7, -0.35, 0, 0.35, 0.7].map((ribY, rIdx) => (
            <mesh key={rIdx} position={[0, ribY, -0.03]}>
              <boxGeometry args={[seg.width * 0.95, 0.03, 0.02]} />
              <primitive object={aluMat} />
            </mesh>
          ))}

          {/* Menteşeler (Hinges) */}
          {idx === 0 && (
            <>
              <mesh position={[dir * 0.6, 0.6, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.1, 12]} />
                <primitive object={aluMat} />
              </mesh>
              <mesh position={[dir * 0.6, -0.6, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.1, 12]} />
                <primitive object={aluMat} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
};

export const SolarPanels: React.FC = () => {
  const {
    selectedSubsystem,
    setSelectedSubsystem,
    hoveredSubsystem,
    setHoveredSubsystem
  } = useSimulator();

  const isSelected = selectedSubsystem === 'SOLAR_ARRAYS';
  const isHovered = hoveredSubsystem === 'SOLAR_ARRAYS';

  const solarTexture = useMemo(() => createSolarPanelTexture(), []);
  const carbonTexture = useMemo(() => createCarbonFiberTexture(), []);

  return (
    <group
      name="SOLAR_ARRAYS"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSubsystem('SOLAR_ARRAYS');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSubsystem('SOLAR_ARRAYS');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredSubsystem(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <SolarWing
        side="right"
        isSelected={isSelected}
        isHovered={isHovered}
        solarTexture={solarTexture}
        carbonTexture={carbonTexture}
      />
      <SolarWing
        side="left"
        isSelected={isSelected}
        isHovered={isHovered}
        solarTexture={solarTexture}
        carbonTexture={carbonTexture}
      />
    </group>
  );
};
