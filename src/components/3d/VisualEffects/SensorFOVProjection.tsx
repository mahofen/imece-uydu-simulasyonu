import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';
import { ORBIT_PRESETS } from '../../../utils/orbitPresetsData';

export const SensorFOVProjection: React.FC = () => {
  const { mode, orbitAngle, orbitPreset, sensorFovVisible } = useSimulator();
  const coneGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const presetData = ORBIT_PRESETS[orbitPreset] || ORBIT_PRESETS.IMECE_SSO;
  const R_orb = presetData.radiusUnits;
  const inc = presetData.inclinationDeg * (Math.PI / 180);
  const R_earth = 14.0;
  const height = Math.max(0.5, R_orb - R_earth);

  useFrame(() => {
    if (!coneGroupRef.current) return;

    if (mode === 'ORBIT' && sensorFovVisible) {
      const satX = R_orb * Math.cos(orbitAngle);
      const satY = R_orb * Math.sin(orbitAngle) * Math.sin(inc);
      const satZ = R_orb * Math.sin(orbitAngle) * Math.cos(inc);

      coneGroupRef.current.position.set(satX, satY, satZ);
      coneGroupRef.current.lookAt(0, 0, 0);

      if (ringRef.current) {
        const pulse = 1.0 + Math.sin(Date.now() * 0.005) * 0.12;
        ringRef.current.scale.set(pulse, pulse, 1.0);
      }
    }
  });

  if (mode !== 'ORBIT' || !sensorFovVisible) return null;

  // Swath genişliği irtifaya bağlı olarak orantılanır (İMECE ~13.9 km swath)
  const footprintRadius = Math.max(0.6, (height * 0.38));

  return (
    <group ref={coneGroupRef} name="SENSOR_FOV_CONE">
      {/* 
        Koni: Uydudan (0, 0, 0) yönüne bakar. 
        Three.js CylinderGeometry Y ekseninde durduğu için X ekseninde 90 derece döndürülüp 
        merkezi -height/2'ye ötelenir.
      */}
      <group position={[0, 0, height / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, footprintRadius, height, 32, 1, true]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Kenar Işın Hatları */}
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.08, footprintRadius, height, 8, 1, true)]} />
          <lineBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
        </lineSegments>

        {/* Yeryüzündeki Ayak İzi (Footprint Swath) */}
        <mesh
          ref={ringRef}
          position={[0, -height / 2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[footprintRadius * 0.85, footprintRadius, 32]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};
