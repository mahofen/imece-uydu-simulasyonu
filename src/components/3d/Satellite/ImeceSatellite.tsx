import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';
import { ORBIT_PRESETS } from '../../../utils/orbitPresetsData';
import { BusWithCutaway } from './BusWithCutaway';
import { SolarPanels } from './SolarPanels';
import { OpticalCamera } from './OpticalCamera';
import { CommunicationAntennas } from './CommunicationAntennas';
import { ADCSSystem } from './ADCSSystem';
import { PropulsionSystem } from './PropulsionSystem';
import { SunBeamParticles } from '../VisualEffects/SunBeamParticles';
import { CameraLightRays } from '../VisualEffects/CameraLightRays';
import { SignalWaves } from '../VisualEffects/SignalWaves';
import { SensorFOVProjection } from '../VisualEffects/SensorFOVProjection';

export const ImeceSatellite: React.FC = () => {
  const { mode, adcsRotation, orbitAngle, orbitPreset, isThermalMode } = useSimulator();
  const satRef = useRef<THREE.Group>(null);

  // Yörünge veya serbest inceleme moduna göre konum ve yönelim güncellemesi
  useFrame(() => {
    if (!satRef.current) return;

    if (mode === 'ORBIT') {
      const presetData = ORBIT_PRESETS[orbitPreset] || ORBIT_PRESETS.IMECE_SSO;
      const R_orb = presetData.radiusUnits;
      const inc = presetData.inclinationDeg * (Math.PI / 180);

      const satX = R_orb * Math.cos(orbitAngle);
      const satY = R_orb * Math.sin(orbitAngle) * Math.sin(inc);
      const satZ = R_orb * Math.sin(orbitAngle) * Math.cos(inc);

      satRef.current.position.set(satX, satY, satZ);
      satRef.current.scale.set(0.48, 0.48, 0.48);

      // Standart Nadir yönelimi: Kamera Dünya merkezine (0, 0, 0) bakar
      satRef.current.lookAt(0, 0, 0);
    } else {
      // İnceleme & Etkinlik modunda: Ekranın merkezinde büyük ve ayrıntılı
      satRef.current.position.set(0, 0, 0);
      satRef.current.scale.set(1.0, 1.0, 1.0);

      // AOKS Yönelim açısına doğru yumuşak geçiş (Lerp)
      const targetEuler = new THREE.Euler(
        adcsRotation[0],
        adcsRotation[1],
        adcsRotation[2]
      );
      satRef.current.rotation.x = THREE.MathUtils.lerp(
        satRef.current.rotation.x,
        targetEuler.x,
        0.08
      );
      satRef.current.rotation.y = THREE.MathUtils.lerp(
        satRef.current.rotation.y,
        targetEuler.y,
        0.08
      );
      satRef.current.rotation.z = THREE.MathUtils.lerp(
        satRef.current.rotation.z,
        targetEuler.z,
        0.08
      );
    }
  });

  return (
    <group ref={satRef} name="IMECE_SATELLITE_ROOT">
      <BusWithCutaway />
      <SolarPanels />
      <OpticalCamera />
      <CommunicationAntennas />
      <ADCSSystem />
      <PropulsionSystem />
      {/* 3D sahne üzerinde hiçbir tanıma aracı veya engelleyici etiket olmasın */}
      <SunBeamParticles />
      <CameraLightRays />
      <SignalWaves />
    </group>
  );
};
