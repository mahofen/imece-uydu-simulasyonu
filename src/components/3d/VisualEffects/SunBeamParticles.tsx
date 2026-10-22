import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';

export const SunBeamParticles: React.FC = () => {
  const { selectedSubsystem, sunActive } = useSimulator();
  const pointsRef = useRef<THREE.Points>(null);

  // 120 adet foton parçacığı
  const count = 140;

  const [positions, initialOffsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offsets: number[] = [];

    for (let i = 0; i < count; i++) {
      // Güneş kaynağından uydunun panellerine doğru (sağ ve sol kanatlara)
      const side = i % 2 === 0 ? 1 : -1;
      const targetX = side * (1.5 + Math.random() * 2.0);
      const targetY = 0.3 + (Math.random() - 0.5) * 1.5;
      const targetZ = 0;

      // Başlangıç noktası: Güneş yönü (yukarı ve uzakta)
      const sunDist = 12.0;
      const startX = targetX + 4.0;
      const startY = targetY + 6.0;
      const startZ = targetZ + 8.0;

      pos[i * 3] = startX;
      pos[i * 3 + 1] = startY;
      pos[i * 3 + 2] = startZ;

      offsets.push(Math.random());
    }

    return [pos, offsets];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !sunActive) return;

    const t = clock.getElapsedTime() * 1.5;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const targetX = side * (1.5 + (i % 5) * 0.4);
      const targetY = 0.3 + ((i % 7) - 3) * 0.2;
      const targetZ = 0;

      const sunX = targetX + 5.0;
      const sunY = targetY + 7.0;
      const sunZ = targetZ + 9.0;

      // 0 ile 1 arasında ilerleyen döngüsel oran
      const progress = (t + initialOffsets[i]) % 1.0;

      arr[i * 3] = THREE.MathUtils.lerp(sunX, targetX, progress);
      arr[i * 3 + 1] = THREE.MathUtils.lerp(sunY, targetY, progress);
      arr[i * 3 + 2] = THREE.MathUtils.lerp(sunZ, targetZ, progress);
    }

    posAttr.needsUpdate = true;
  });

  const shouldShow = sunActive && (selectedSubsystem === 'SOLAR_ARRAYS' || selectedSubsystem === null);

  if (!shouldShow) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color={selectedSubsystem === 'SOLAR_ARRAYS' ? '#fef08a' : '#38bdf8'}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
