import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';
import { ORBIT_PRESETS } from '../../../utils/orbitPresetsData';

export const OrbitPath: React.FC = () => {
  const { mode, orbitSpeed, isOrbitPaused, setOrbitAngle, orbitPreset } = useSimulator();

  const presetData = ORBIT_PRESETS[orbitPreset] || ORBIT_PRESETS.IMECE_SSO;
  const orbitRadius = presetData.radiusUnits;
  const inclination = presetData.inclinationDeg * (Math.PI / 180);

  // Yörünge elips/çember çizgisi noktaları
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 240;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = orbitRadius * Math.cos(theta);
      const y = orbitRadius * Math.sin(theta) * Math.sin(inclination);
      const z = orbitRadius * Math.sin(theta) * Math.cos(inclination);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [orbitRadius, inclination]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  // Orbital hareket güncellemesi
  useFrame((_, delta) => {
    if (mode === 'ORBIT' && !isOrbitPaused) {
      // Periyoda bağlı ortalama açısal hız (Kepler)
      const baseMotion = (Math.PI * 2) / (presetData.periodMinutes * 60);
      const step = delta * baseMotion * orbitSpeed * 35 * presetData.speedMultiplier;
      setOrbitAngle(prev => (prev + step) % (Math.PI * 2));
    }
  });

  if (mode !== 'ORBIT') return null;

  return (
    <group name="ORBIT_PATH">
      {/* Dinamik Yörünge İzi Çizgisi */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={orbitPreset === 'IMECE_SSO' ? '#38bdf8' : orbitPreset === 'GEO_TURKSAT' ? '#f59e0b' : '#10b981'}
          opacity={0.75}
          transparent
          linewidth={2}
        />
      </line>
    </group>
  );
};
