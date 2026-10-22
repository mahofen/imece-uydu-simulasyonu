import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSimulator } from '../../context/SimulatorContext';
import { ImeceSatellite } from './Satellite/ImeceSatellite';
import { EarthGlobe } from './Earth/EarthGlobe';
import { OrbitPath } from './Earth/OrbitPath';
import { SensorFOVProjection } from './VisualEffects/SensorFOVProjection';

// Yıldız Alanı (Deep Space Starfield)
const Starfield: React.FC = () => {
  const count = 2400;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x93c5fd),
      new THREE.Color(0xfef08a),
      new THREE.Color(0xfbcfe8),
      new THREE.Color(0x67e8f9)
    ];

    for (let i = 0; i < count; i++) {
      // Küresel dağılım (uzak mesafe R=180 - 600)
      const r = 200 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.4}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
};

// Kamera Geçiş ve Hedef Kontrolörü (Hatasız ve Güvenli Yakınlaştırma/Uzaklaştırma)
const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { targetCamera, setTargetCamera, mode, zoomTrigger, isCinematicTour, stopCinematicTour } = useSimulator();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const isOrbit = mode === 'ORBIT';
  const minDistance = isOrbit ? 16.5 : 2.0;
  const maxDistance = isOrbit ? 80.0 : 16.0;

  // Kullanıcı manuel döndürür veya yaklaştırırken otomatik kamera lerp geçişini ve sinematik turu hemen iptal et
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => {
      setTargetCamera(null);
      if (isCinematicTour) {
        stopCinematicTour();
      }
    };

    controls.addEventListener('start', onStart);
    return () => {
      controls.removeEventListener('start', onStart);
    };
  }, [setTargetCamera, isCinematicTour, stopCinematicTour]);

  // Görev çubuğundaki + / - butonlarıyla güvenli adım adım yakınlaştırma/uzaklaştırma
  useEffect(() => {
    if (!zoomTrigger || !controlsRef.current) return;
    const controls = controlsRef.current;
    const target = controls.target;
    const offset = new THREE.Vector3().subVectors(camera.position, target);
    const currentDist = offset.length();

    if (currentDist < 0.001) return;

    let newDist = currentDist;
    if (zoomTrigger.dir === 'in') {
      newDist = Math.max(minDistance, currentDist * 0.78);
    } else {
      newDist = Math.min(maxDistance, currentDist * 1.28);
    }

    offset.setLength(newDist);
    camera.position.copy(target).add(offset);
    controls.update();
  }, [zoomTrigger, minDistance, maxDistance, camera]);

  useFrame(() => {
    if (targetCamera) {
      const targetPos = new THREE.Vector3(...targetCamera.pos);
      const targetLook = new THREE.Vector3(...targetCamera.lookAt);

      camera.position.lerp(targetPos, 0.06);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 0.06);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(targetPos) < 0.04) {
        setTargetCamera(null);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={minDistance}
      maxDistance={maxDistance}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      autoRotate={isCinematicTour}
      autoRotateSpeed={0.9}
    />
  );
};

export const SceneContainer: React.FC = () => {
  const { sunActive, graphicsQuality, mode } = useSimulator();

  const dpr: [number, number] = graphicsQuality === 'high' ? [1, 2] : [1, 1];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 1.8, 4.8], fov: 45, near: 0.1, far: 1200 }}
        gl={{
          antialias: graphicsQuality !== 'low',
          powerPreference: 'high-performance'
        }}
        shadows={graphicsQuality === 'high'}
      >
        {/* Arka Plan Rengi: Derin Uzay Karalığı */}
        <color attach="background" args={['#020409']} />

        {/* Aydınlatma */}
        <ambientLight intensity={sunActive ? 0.35 : 0.1} />
        
        {/* Güneş Işığı (Sun Active durumuna göre parlak veya gölgede) */}
        <directionalLight
          position={[18, 14, 16]}
          intensity={sunActive ? 3.4 : 0.2}
          color="#fffcf0"
          castShadow={graphicsQuality === 'high'}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Dünya Yansıma Işığı (Earthshine) */}
        <directionalLight
          position={[0, -12, 4]}
          intensity={0.65}
          color="#38bdf8"
        />

        {/* Derin Uzay Yıldız Alanı */}
        <Starfield />

        {/* İMECE Uydusu */}
        <ImeceSatellite />

        {/* Dünya Küresi */}
        <EarthGlobe />

        {/* 680 km SSO Yörünge Çizgisi */}
        <OrbitPath />

        {/* Kamera Görüş Konisi & Yeryüzü Tarama İzi (Footprint) */}
        <SensorFOVProjection />

        {/* Kamera Kontrolleri */}
        <CameraController />
      </Canvas>
    </div>
  );
};
