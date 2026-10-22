import * as THREE from 'three';
import { createEarthTexture, createEarthNightTexture, createCloudTexture } from './textures.js';

export function createEarthSystem() {
    const earthGroup = new THREE.Group();
    earthGroup.name = 'EARTH_SYSTEM';

    // GERÇEK ORANSAL FİZİKSEL ÖLÇEKLER
    // Dünya Ekvator Yarıçapı: 6.371 km -> 14.0 birim
    // İMECE Yörünge İrtifası: 680 km -> (14.0 * 680 / 6371) = 1.494 birim
    // Yörünge Yarıçapı: 15.494 birim
    const earthRadius = 14.0;
    const altitude680 = 1.494;
    const orbitRadius = earthRadius + altitude680;
    const inclination = 98.2 * (Math.PI / 180); // 98.2° Kutupsal Güneş Eşzamanlı Yörünge (SSO)

    // Dünya merkezi (0, 0, 0)
    earthGroup.position.set(0, 0, 0);

    // 1. DÜNYA KÜRESİ VE GÜNDÜZ/GECE ŞEHİR IŞIKLARI
    const dayTex = createEarthTexture();
    const nightTex = createEarthNightTexture();

    const earthShaderMat = new THREE.ShaderMaterial({
        uniforms: {
            dayTexture: { value: dayTex },
            nightTexture: { value: nightTex },
            sunDirection: { value: new THREE.Vector3(0.7, 0.4, 0.6).normalize() }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D dayTexture;
            uniform sampler2D nightTexture;
            uniform vec3 sunDirection;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vec3 dayColor = texture2D(dayTexture, vUv).rgb;
                vec3 nightColor = texture2D(nightTexture, vUv).rgb;

                float cosAngle = dot(vNormal, sunDirection);
                float dayWeight = smoothstep(-0.12, 0.22, cosAngle);

                vec3 color = mix(nightColor * 1.8, dayColor * 1.15, dayWeight);
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });

    const earthGeom = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMesh = new THREE.Mesh(earthGeom, earthShaderMat);
    earthGroup.add(earthMesh);

    // 2. BULUT KATMANI
    const cloudTex = createCloudTexture();
    const cloudGeom = new THREE.SphereGeometry(earthRadius + 0.12, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.75,
        blending: THREE.NormalBlending,
        roughness: 0.95
    });
    const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
    earthGroup.add(cloudMesh);

    // 3. ATMOSFER IŞIMASI (Rayleigh Scattering)
    const atmosphereGeom = new THREE.SphereGeometry(earthRadius + 0.42, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
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
                float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
                gl_FragColor = vec4(0.28, 0.72, 1.0, 1.0) * intensity * 2.0;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // 4. ANKARA YER İSTASYONU (TÜBİTAK UZAY)
    const groundStationGroup = new THREE.Group();
    const phi = (90 - 39.9) * (Math.PI / 180);
    const theta = (32.8 + 180) * (Math.PI / 180);
    const gsR = earthRadius + 0.04;
    const gsX = -(gsR * Math.sin(phi) * Math.cos(theta));
    const gsZ = (gsR * Math.sin(phi) * Math.sin(theta));
    const gsY = (gsR * Math.cos(phi));

    const gsMarkerGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
    const gsMarkerMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const gsMarker = new THREE.Mesh(gsMarkerGeom, gsMarkerMat);
    gsMarker.position.set(gsX, gsY, gsZ);
    gsMarker.lookAt(0, 0, 0);
    groundStationGroup.add(gsMarker);

    const gsRingGeom = new THREE.RingGeometry(0.28, 0.42, 24);
    const gsRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
    });
    const gsRing = new THREE.Mesh(gsRingGeom, gsRingMat);
    gsRing.position.set(gsX * 1.01, gsY * 1.01, gsZ * 1.01);
    gsRing.lookAt(0, 0, 0);
    groundStationGroup.add(gsRing);

    earthMesh.add(groundStationGroup);

    // 5. GERÇEK 680 KM ORANSAL YÖRÜNGE ÇEMBERİ (Orbital Path Ring)
    const orbitPoints = [];
    const segments = 180;
    for (let i = 0; i <= segments; i++) {
        const u = (i / segments) * Math.PI * 2;
        // 98.2° eğimli kutupsal yörünge koordinatları
        const x = orbitRadius * Math.cos(u);
        const y = orbitRadius * Math.sin(u) * Math.sin(inclination);
        const z = orbitRadius * Math.sin(u) * Math.cos(inclination);
        orbitPoints.push(new THREE.Vector3(x, y, z));
    }
    const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.6,
        gapSize: 0.3,
        opacity: 0.65,
        transparent: true
    });
    const orbitLine = new THREE.Line(orbitGeom, orbitMat);
    orbitLine.computeLineDistances();
    earthGroup.add(orbitLine);

    // 6. 680 KM İRTİFA ÖLÇÜM LAZER IŞINI (Distance Measurement Line)
    // Uydudan yer merkezine dik inen gerçek mesafe çizgisi
    const altLineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -altitude680, 0)
    ]);
    const altLineMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.9,
        linewidth: 2
    });
    const altitudeLine = new THREE.Line(altLineGeom, altLineMat);
    earthGroup.add(altitudeLine);

    // Yeryüzündeki izdüşüm halkası (Sub-satellite Nadir Target)
    const footprintGeom = new THREE.RingGeometry(0.35, 0.45, 32);
    const footprintMat = new THREE.MeshBasicMaterial({
        color: 0x00f5d4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
    });
    const footprintMesh = new THREE.Mesh(footprintGeom, footprintMat);
    earthGroup.add(footprintMesh);

    // Optik Tarama Şeridi (Pushbroom 13.9 km Swath Corridor)
    const swathStripGeom = new THREE.PlaneGeometry(0.65, 1.8);
    const swathStripMat = new THREE.MeshBasicMaterial({
        color: 0x00f5d4,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    const swathStrip = new THREE.Mesh(swathStripGeom, swathStripMat);
    earthGroup.add(swathStrip);

    // Uydudan yere inen şeffaf tarama konisi
    const coneGeom = new THREE.ConeGeometry(0.45, altitude680, 24, 1, true);
    coneGeom.translate(0, -altitude680 / 2, 0);
    const coneMat = new THREE.MeshBasicMaterial({
        color: 0x00f5d4,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const coneMesh = new THREE.Mesh(coneGeom, coneMat);
    earthGroup.add(coneMesh);

    // 7. X-BANT VERİ İNDİRME IŞINI (RF Downlink Beam)
    const rfLineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
    ]);
    const rfLineMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.3,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.9
    });
    const rfBeamLine = new THREE.Line(rfLineGeom, rfLineMat);
    rfBeamLine.visible = false;
    earthGroup.add(rfBeamLine);

    return {
        earthGroup,
        earthMesh,
        cloudMesh,
        earthRadius,
        orbitRadius,
        altitude680,
        inclination,
        altitudeLine,
        footprintMesh,
        swathStrip,
        coneMesh,
        rfBeamLine,
        gsMarker,
        update: (delta, simSpeed = 1, currentSatPos) => {
            // Dünya dönüşü
            const rotDelta = delta * 0.015 * simSpeed;
            earthMesh.rotation.y += rotDelta;
            cloudMesh.rotation.y += rotDelta * 1.12;

            const pulse = 1.0 + 0.35 * Math.sin(Date.now() * 0.006);
            gsRing.scale.set(pulse, pulse, pulse);

            // Eğer uydu konumu verildiyse irtifa ve tarama izini güncelle
            if (currentSatPos) {
                const satNorm = currentSatPos.clone().normalize();
                const groundPos = satNorm.clone().multiplyScalar(earthRadius + 0.03);

                // 680 km irtifa ölçüm çizgisi
                const positions = altitudeLine.geometry.attributes.position.array;
                positions[0] = currentSatPos.x;
                positions[1] = currentSatPos.y;
                positions[2] = currentSatPos.z;
                positions[3] = groundPos.x;
                positions[4] = groundPos.y;
                positions[5] = groundPos.z;
                altitudeLine.geometry.attributes.position.needsUpdate = true;

                // Yeryüzü izdüşüm hedefi
                footprintMesh.position.copy(groundPos);
                footprintMesh.lookAt(0, 0, 0);

                swathStrip.position.copy(groundPos);
                swathStrip.lookAt(0, 0, 0);

                // Tarama konisi
                coneMesh.position.copy(currentSatPos);
                coneMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), satNorm.clone().negate());

                // Ankara yer istasyonu ile uydu arası mesafe kontrolü (X-Bant RF link)
                const gsWorldPos = new THREE.Vector3();
                gsMarker.getWorldPosition(gsWorldPos);
                const distToGS = currentSatPos.distanceTo(gsWorldPos);
                const maxContactDist = 7.0; // İletişim menzili
                const isContact = distToGS < maxContactDist;

                rfBeamLine.visible = isContact;
                if (isContact) {
                    const rfPos = rfBeamLine.geometry.attributes.position.array;
                    rfPos[0] = currentSatPos.x;
                    rfPos[1] = currentSatPos.y;
                    rfPos[2] = currentSatPos.z;
                    rfPos[3] = gsWorldPos.x;
                    rfPos[4] = gsWorldPos.y;
                    rfPos[5] = gsWorldPos.z;
                    rfBeamLine.geometry.attributes.position.needsUpdate = true;
                    rfBeamLine.computeLineDistances();
                }

                return { isContact, distToGS };
            }
            return { isContact: false, distToGS: 999 };
        }
    };
}

// DERİN UZAY YILDIZ ALANI
export function createStarfield() {
    const starCount = 3800;
    const starGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorChoices = [
        new THREE.Color('#ffffff'),
        new THREE.Color('#b5d6ff'),
        new THREE.Color('#ffe9c9'),
        new THREE.Color('#ffcda8')
    ];

    for (let i = 0; i < starCount; i++) {
        const r = 90 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const starColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        colors[i * 3] = starColor.r;
        colors[i * 3 + 1] = starColor.g;
        colors[i * 3 + 2] = starColor.b;
    }

    starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.9
    });

    return new THREE.Points(starGeom, starMat);
}
