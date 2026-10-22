import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulator } from '../../../context/SimulatorContext';
import {
  createEarthTexture,
  createEarthNightTexture,
  createCloudTexture
} from '../../../utils/textures';

export const EarthGlobe: React.FC = () => {
  const {
    mode,
    orbitSpeed,
    isOrbitPaused,
    isThermalMode
  } = useSimulator();

  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const earthRadius = 14.0;

  // Dokular
  const dayTex = useMemo(() => createEarthTexture(), []);
  const nightTex = useMemo(() => createEarthNightTexture(), []);
  const cloudTex = useMemo(() => createCloudTexture(), []);

  // Gündüz-Gece ve Termal FLIR Shader Malzemesi
  const earthShaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTex },
        nightTexture: { value: nightTex },
        sunDirection: { value: new THREE.Vector3(0.7, 0.4, 0.6).normalize() },
        isThermal: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        uniform float isThermal;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;

          float cosAngle = dot(vNormal, sunDirection);

          if (isThermal > 0.5) {
            // Termal FLIR Sahte Renk Paleti (-60°C ile +45°C arası)
            float t = smoothstep(-0.6, 0.8, cosAngle);
            vec3 coldBlue = vec3(0.04, 0.12, 0.45);
            vec3 midCyan = vec3(0.08, 0.65, 0.75);
            vec3 warmYellow = vec3(0.95, 0.85, 0.15);
            vec3 hotRed = vec3(0.95, 0.22, 0.1);

            vec3 thermalColor;
            if (t < 0.4) {
              thermalColor = mix(coldBlue, midCyan, t / 0.4);
            } else if (t < 0.75) {
              thermalColor = mix(midCyan, warmYellow, (t - 0.4) / 0.35);
            } else {
              thermalColor = mix(warmYellow, hotRed, (t - 0.75) / 0.25);
            }
            gl_FragColor = vec4(thermalColor, 1.0);
          } else {
            // Normal Fotogerçekçi Görünüm + Okyanus Güneş Yansıması (Specular Glint)
            float dayWeight = smoothstep(-0.08, 0.18, cosAngle);
            
            // Okyanus parıltısı
            vec3 halfDir = normalize(sunDirection + vViewDir);
            float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0);
            float isOcean = (dayColor.b > dayColor.g && dayColor.b > 0.2) ? 1.0 : 0.0;
            vec3 glint = vec3(1.0, 0.95, 0.8) * spec * isOcean * 0.9 * max(0.0, cosAngle);

            vec3 color = mix(nightColor * 1.8, dayColor * 1.15 + glint, dayWeight);
            gl_FragColor = vec4(color, 1.0);
          }
        }
      `
    });
  }, [dayTex, nightTex]);

  // Atmosfer Işıması
  const atmosphereMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.25, 0.75, 1.0, 1.0) * intensity * 2.2;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Dünya ve bulutların dönüşü
  useFrame((_, delta) => {
    if (earthShaderMat.uniforms.isThermal) {
      earthShaderMat.uniforms.isThermal.value = isThermalMode ? 1.0 : 0.0;
    }

    if (!isOrbitPaused) {
      const rotDelta = delta * 0.02 * (orbitSpeed / 10);
      if (earthRef.current) {
        earthRef.current.rotation.y += rotDelta;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += rotDelta * 1.15;
      }
    }
  });

  // Dünya YÖRÜNGE modunda merkezdedir (0, 0, 0)
  // Serbest uydu keşfinde aşağıda (0, -18.5, 0) arka plan olarak durur
  const isCentered = mode === 'ORBIT';
  const earthPos: [number, number, number] = isCentered ? [0, 0, 0] : [0, -18.5, 0];

  return (
    <group position={earthPos}>
      {/* Kendi ekseninde dönen Dünya grubu */}
      <group ref={earthRef}>
        <mesh material={earthShaderMat}>
          <sphereGeometry args={[earthRadius, 64, 64]} />
        </mesh>

        {/* Ankara Yer İstasyonu İşaretçisi (39.9° K, 32.8° D) */}
        {(() => {
          const lat = 39.93 * (Math.PI / 180);
          const lon = 32.85 * (Math.PI / 180);
          const r = earthRadius + 0.05;
          const gx = r * Math.cos(lat) * Math.sin(lon);
          const gy = r * Math.sin(lat);
          const gz = r * Math.cos(lat) * Math.cos(lon);
          return (
            <group position={[gx, gy, gz]}>
              <mesh>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
              </mesh>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          );
        })()}
      </group>

      {/* Bulut Katmanı */}
      <mesh ref={cloudsRef} raycast={() => null}>
        <sphereGeometry args={[earthRadius + 0.12, 64, 64]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.7}
          roughness={0.9}
        />
      </mesh>

      {/* Atmosfer Işıması */}
      <mesh material={atmosphereMat} raycast={() => null}>
        <sphereGeometry args={[earthRadius + 0.45, 64, 64]} />
      </mesh>
    </group>
  );
};
