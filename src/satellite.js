import * as THREE from 'three';
import {
    createSolarPanelTexture,
    createGoldMLITexture,
    createMLIBumpMap,
    createBodyDecalTexture,
    createCarbonFiberTexture
} from './textures.js';

export function createImeceSatellite() {
    const satelliteGroup = new THREE.Group();
    satelliteGroup.name = 'IMECE_SATELLITE';

    // Gerçekçi PBR Malzemeleri
    const solarTexture = createSolarPanelTexture();
    const goldMLITexture = createGoldMLITexture();
    const mliBumpMap = createMLIBumpMap();
    const bodyDecalTexture = createBodyDecalTexture();
    const carbonFiberTexture = createCarbonFiberTexture();

    // 1. Çok Katmanlı Yalıtım (Gold MLI)
    const goldMLIMat = new THREE.MeshStandardMaterial({
        color: 0xdf9e16,
        roughness: 0.28,
        metalness: 0.82,
        map: goldMLITexture,
        bumpMap: mliBumpMap,
        bumpScale: 0.05,
        envMapIntensity: 1.4
    });

    // 2. Alüminyum / Titanyum
    const aluminumMat = new THREE.MeshStandardMaterial({
        color: 0xdde5ed,
        roughness: 0.3,
        metalness: 0.78,
        envMapIntensity: 1.0
    });

    // 3. Gövde Yazı ve Bayrak
    const decalMat = new THREE.MeshStandardMaterial({
        map: bodyDecalTexture,
        roughness: 0.28,
        metalness: 0.45
    });

    // 4. Güneş Hücresi
    const solarCellMat = new THREE.MeshStandardMaterial({
        map: solarTexture,
        roughness: 0.15,
        metalness: 0.88,
        bumpScale: 0.02
    });

    // 5. Karbon Fiber
    const carbonMat = new THREE.MeshStandardMaterial({
        map: carbonFiberTexture,
        roughness: 0.65,
        metalness: 0.25
    });

    // 6. Koyu Optik Namlu
    const darkOpticalMat = new THREE.MeshStandardMaterial({
        color: 0x1f232b,
        roughness: 0.55,
        metalness: 0.45
    });

    // 7. Kamera Ön Cam Mercek
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a4968,
        transmission: 0.65,
        opacity: 0.92,
        transparent: true,
        roughness: 0.04,
        metalness: 0.12,
        ior: 1.55,
        reflectivity: 0.95
    });

    // 8. Altın Ayna Kaplama
    const goldMirrorMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.08,
        metalness: 0.98
    });

    // 9. İtki Nozulu
    const thrusterMat = new THREE.MeshStandardMaterial({
        color: 0x555a62,
        roughness: 0.3,
        metalness: 0.92
    });

    // ==========================================
    // MALZEME ANALİZ MODU RENK PALETİ
    // ==========================================
    const diagnosticMats = {
        mli: new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x78350f, roughness: 0.3, metalness: 0.8 }),
        solar: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0369a1, roughness: 0.2, metalness: 0.9 }),
        cfrp: new THREE.MeshStandardMaterial({ color: 0x475569, emissive: 0x1e293b, roughness: 0.7, metalness: 0.3 }),
        metals: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, emissive: 0x64748b, roughness: 0.2, metalness: 0.9 }),
        optics: new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x047857, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.85 }),
        propulsion: new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, roughness: 0.3, metalness: 0.9 }),
        dimmed: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, transparent: true, opacity: 0.2, wireframe: true })
    };

    // Tüm mesh parçalarını kayıt altına alacak dizi
    const taggedMeshes = [];

    function registerMesh(mesh, materialType) {
        mesh.userData.materialType = materialType;
        mesh.userData.originalMaterial = mesh.material;
        taggedMeshes.push(mesh);
        return mesh;
    }

    // ==========================================
    // A) ANA GÖVDE (SATELLITE BUS)
    // ==========================================
    const busGroup = new THREE.Group();
    busGroup.name = 'BUS_SYSTEM';
    busGroup.userData = {
        title: 'İMECE Uydu Gövdesi ve Taşıyıcı Yapı',
        category: 'Platform / Yapısal Alt Sistem',
        description: 'TÜBİTAK UZAY tarafından geliştirilen ana mekanik gövde. Kompozit sandviç paneller ve altın Çok Katmanlı Yalıtım (MLI) battaniyeleriyle uzayın -150°C ile +120°C arasındaki şiddetli ısıl gradyanlarına karşı koruma sağlar.',
        specs: [
            'Ölçüler: ~1.6m x 1.6m x 2.4m Prizma',
            'Kuru Kütle: ~700-800 kg',
            'Malzeme: 20 Kat Kapton MLI + Al 7075 Petek Sandviç Panel',
            'Isıl Kontrol: OSR Radyatörler ve Pasif Yalıtım'
        ]
    };

    const busGeom = new THREE.BoxGeometry(1.6, 2.3, 1.5);
    const busMaterials = [
        goldMLIMat,     // +X
        goldMLIMat,     // -X
        aluminumMat,    // +Y
        aluminumMat,    // -Y
        decalMat,       // +Z
        goldMLIMat      // -Z
    ];
    const busMesh = new THREE.Mesh(busGeom, busMaterials);
    busMesh.castShadow = true;
    busMesh.receiveShadow = true;
    registerMesh(busMesh, 'mli');
    busGroup.add(busMesh);

    // Yapısal Profil Köşebentler
    const cornerGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.34, 8);
    const cornerPositions = [
        [0.8, 0, 0.75], [-0.8, 0, 0.75], [0.8, 0, -0.75], [-0.8, 0, -0.75]
    ];
    cornerPositions.forEach(([x, y, z]) => {
        const pillar = new THREE.Mesh(cornerGeom, aluminumMat);
        pillar.position.set(x, y, z);
        registerMesh(pillar, 'metals');
        busGroup.add(pillar);
    });

    // Fırlatıcı Arayüz Halkası (PAF)
    const adapterRingGeom = new THREE.CylinderGeometry(0.65, 0.75, 0.28, 32);
    const adapterRing = new THREE.Mesh(adapterRingGeom, aluminumMat);
    adapterRing.position.set(0, -1.25, 0);
    registerMesh(adapterRing, 'metals');
    busGroup.add(adapterRing);

    // Cıvatalar
    const boltGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.32, 8);
    for (let b = 0; b < 16; b++) {
        const angle = (b / 16) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeom, thrusterMat);
        bolt.position.set(Math.cos(angle) * 0.71, -1.25, Math.sin(angle) * 0.71);
        registerMesh(bolt, 'metals');
        busGroup.add(bolt);
    }
    satelliteGroup.add(busGroup);

    // ==========================================
    // B) ELEKTRO-OPTİK KAMERA (OPMER / KAFES)
    // ==========================================
    const cameraGroup = new THREE.Group();
    cameraGroup.name = 'ELECTRO_OPTICAL_CAMERA';
    cameraGroup.userData = {
        title: 'Metre-Altı Yüksek Çözünürlüklü Elektro-Optik Kamera',
        category: 'Görev Yükü (Payload)',
        description: 'TÜBİTAK UZAY tarafından geliştirilen OPMER metre-altı optik kamera. 680 km irtifadan yeryüzünü 1 metrenin altında (GSD < 1m) uzamsal çözünürlükle süpürge tarama (pushbroom) yöntemiyle fotoğraflar.',
        specs: [
            'Pankromatik Çözünürlük: < 1.0 m GSD (Pankromatik)',
            'Çok Bantlı Çözünürlük: ~4.0 m GSD (Mavi, Yeşil, Kırmızı, Yakın Kızılötesi)',
            'Şerit Genişliği (Swath): 13.9 km',
            'Optik Yapı: Sıfır Genleşmeli Karbon Baffle + Zerodur Aynalar'
        ]
    };

    const baffleOuterGeom = new THREE.CylinderGeometry(0.48, 0.52, 1.1, 32, 1, true);
    const baffleOuter = new THREE.Mesh(baffleOuterGeom, darkOpticalMat);
    baffleOuter.rotation.x = Math.PI / 2;
    baffleOuter.position.set(0, -0.2, 1.25);
    registerMesh(baffleOuter, 'cfrp');
    cameraGroup.add(baffleOuter);

    for (let r = 0; r < 5; r++) {
        const ringGeom = new THREE.TorusGeometry(0.44 - r * 0.015, 0.015, 8, 32);
        const ringMesh = new THREE.Mesh(ringGeom, darkOpticalMat);
        ringMesh.position.set(0, -0.2, 0.8 + r * 0.2);
        registerMesh(ringMesh, 'cfrp');
        cameraGroup.add(ringMesh);
    }

    const lensGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.04, 32);
    const lensMesh = new THREE.Mesh(lensGeom, lensGlassMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, -0.2, 1.7);
    registerMesh(lensMesh, 'optics');
    cameraGroup.add(lensMesh);

    const vaneGeom = new THREE.BoxGeometry(0.86, 0.015, 0.06);
    const vane1 = new THREE.Mesh(vaneGeom, darkOpticalMat);
    vane1.position.set(0, -0.2, 1.68);
    registerMesh(vane1, 'metals');
    cameraGroup.add(vane1);

    const vane2 = new THREE.Mesh(vaneGeom, darkOpticalMat);
    vane2.rotation.z = Math.PI / 2;
    vane2.position.set(0, -0.2, 1.68);
    registerMesh(vane2, 'metals');
    cameraGroup.add(vane2);

    const secMirrorGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
    const secMirror = new THREE.Mesh(secMirrorGeom, goldMirrorMat);
    secMirror.rotation.x = Math.PI / 2;
    secMirror.position.set(0, -0.2, 1.69);
    registerMesh(secMirror, 'optics');
    cameraGroup.add(secMirror);

    const hoodGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 32, 1, true, 0, Math.PI * 1.3);
    const hoodMesh = new THREE.Mesh(hoodGeom, goldMLIMat);
    hoodMesh.rotation.x = Math.PI / 2;
    hoodMesh.rotation.z = -Math.PI / 4;
    hoodMesh.position.set(0, -0.2, 1.85);
    registerMesh(hoodMesh, 'mli');
    cameraGroup.add(hoodMesh);

    satelliteGroup.add(cameraGroup);

    // ==========================================
    // C) GÜNEŞ PANELLERİ
    // ==========================================
    const solarArraysGroup = new THREE.Group();
    solarArraysGroup.name = 'SOLAR_ARRAYS';
    solarArraysGroup.userData = {
        title: 'Açılabilir Güneş Panelleri',
        category: 'Güç Alt Sistemi (EPS)',
        description: 'Üç eklemeli (GaAs/InGaP/Ge) yüksek verimli uzay güneş panelleri. Tek eksenli güneş takip motoru (SADM) sayesinde yörünge boyunca güneş vektörüne dik açı sağlayarak uydunun tüm aviyonik ve kamera sistemlerini besler.',
        specs: [
            'Hücre Tipi: Triple-Junction InGaP/InGaAs/Ge (%30+ Verim)',
            'Üretim Kapasitesi: ~1200 W (BOL)',
            'Yönlendirme: SADM Güneş Takip Eyleyicisi',
            'Taşıyıcı: Ultra Hafif Karbon Petek Panel (CFRP)'
        ]
    };

    function buildSolarWing(side) {
        const wing = new THREE.Group();
        const dir = side === 'right' ? 1 : -1;

        const sadmGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.25, 16);
        const sadm = new THREE.Mesh(sadmGeom, aluminumMat);
        sadm.rotation.z = Math.PI / 2;
        sadm.position.set(dir * 0.9, 0.3, 0);
        registerMesh(sadm, 'metals');
        wing.add(sadm);

        const yokeArmGeom = new THREE.BoxGeometry(0.35, 0.06, 0.12);
        const yoke = new THREE.Mesh(yokeArmGeom, carbonMat);
        yoke.position.set(dir * 1.15, 0.3, 0);
        registerMesh(yoke, 'cfrp');
        wing.add(yoke);

        const panelSegments = [
            { posX: dir * 1.9, width: 1.15 },
            { posX: dir * 3.15, width: 1.15 }
        ];

        panelSegments.forEach((seg, idx) => {
            const segGroup = new THREE.Group();
            segGroup.position.set(seg.posX, 0.3, 0);

            const pGeom = new THREE.BoxGeometry(seg.width, 1.85, 0.04);
            const pMats = [
                aluminumMat, aluminumMat, aluminumMat, aluminumMat,
                solarCellMat, carbonMat
            ];
            const pMesh = new THREE.Mesh(pGeom, pMats);
            pMesh.castShadow = true;
            registerMesh(pMesh, 'solar');
            segGroup.add(pMesh);

            const ribGeom = new THREE.BoxGeometry(seg.width * 0.95, 0.03, 0.02);
            for (let ribY = -0.7; ribY <= 0.7; ribY += 0.35) {
                const rib = new THREE.Mesh(ribGeom, aluminumMat);
                rib.position.set(0, ribY, -0.03);
                registerMesh(rib, 'metals');
                segGroup.add(rib);
            }

            if (idx === 0) {
                const hingeGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.1, 12);
                const h1 = new THREE.Mesh(hingeGeom, aluminumMat);
                h1.position.set(dir * 0.6, 0.6, 0);
                registerMesh(h1, 'metals');
                segGroup.add(h1);

                const h2 = new THREE.Mesh(hingeGeom, aluminumMat);
                h2.position.set(dir * 0.6, -0.6, 0);
                registerMesh(h2, 'metals');
                segGroup.add(h2);
            }

            wing.add(segGroup);
        });

        return wing;
    }

    solarArraysGroup.add(buildSolarWing('right'));
    solarArraysGroup.add(buildSolarWing('left'));
    satelliteGroup.add(solarArraysGroup);

    // ==========================================
    // D) HABERLEŞME VE ANTEN SİSTEMLERİ
    // ==========================================
    const commsGroup = new THREE.Group();
    commsGroup.name = 'COMMUNICATION_SYSTEM';
    commsGroup.userData = {
        title: 'Haberleşme ve Veri İndirme Antenleri',
        category: 'Haberleşme Alt Sistemi (RF)',
        description: 'Yer gözlem görüntülerinin anında yer istasyonuna iletilmesini sağlayan iki eksenli yönlendirilebilir X-Bant çanak anten ve telemetri/komuta için S-Bant antenler.',
        specs: [
            'Veri İndirme Hızı: X-Bant 320 Mbps',
            'Gimbal Mekanizması: 2 Eksenli Hassas Hedefleme (APM)',
            'TT&C: S-Bant Horn & Dipol Antenler',
            'Çanak Malzemesi: Düşük Genleşmeli Karbon Fiber (CFRP)'
        ]
    };

    const xBandBoomGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 12);
    const xBandBoom = new THREE.Mesh(xBandBoomGeom, carbonMat);
    xBandBoom.rotation.z = Math.PI / 4;
    xBandBoom.position.set(-0.6, -0.9, -0.7);
    registerMesh(xBandBoom, 'cfrp');
    commsGroup.add(xBandBoom);

    const gimbalGeom = new THREE.SphereGeometry(0.07, 16, 16);
    const gimbal = new THREE.Mesh(gimbalGeom, aluminumMat);
    gimbal.position.set(-0.85, -1.15, -0.7);
    registerMesh(gimbal, 'metals');
    commsGroup.add(gimbal);

    const dishGeom = new THREE.SphereGeometry(0.35, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42);
    const dishMesh = new THREE.Mesh(dishGeom, aluminumMat);
    dishMesh.rotation.x = Math.PI * 0.75;
    dishMesh.rotation.y = -Math.PI * 0.2;
    dishMesh.position.set(-1.0, -1.3, -0.85);
    registerMesh(dishMesh, 'cfrp');
    commsGroup.add(dishMesh);

    const hornGeom = new THREE.ConeGeometry(0.05, 0.14, 16);
    const horn = new THREE.Mesh(hornGeom, goldMirrorMat);
    horn.rotation.x = Math.PI * 0.75;
    horn.position.set(-0.95, -1.25, -0.8);
    registerMesh(horn, 'metals');
    commsGroup.add(horn);

    const sBandGeom = new THREE.ConeGeometry(0.06, 0.18, 16);
    const sBandTop = new THREE.Mesh(sBandGeom, goldMirrorMat);
    sBandTop.position.set(0.4, 1.25, 0.3);
    registerMesh(sBandTop, 'metals');
    commsGroup.add(sBandTop);

    const sBandBottom = new THREE.Mesh(sBandGeom, goldMirrorMat);
    sBandBottom.rotation.x = Math.PI;
    sBandBottom.position.set(0.4, -1.25, -0.3);
    registerMesh(sBandBottom, 'metals');
    commsGroup.add(sBandBottom);

    const gpsPlateGeom = new THREE.BoxGeometry(0.14, 0.03, 0.14);
    const gpsPlate = new THREE.Mesh(gpsPlateGeom, aluminumMat);
    gpsPlate.position.set(-0.4, 1.17, 0.3);
    registerMesh(gpsPlate, 'metals');
    commsGroup.add(gpsPlate);

    const whipGeom = new THREE.CylinderGeometry(0.006, 0.003, 0.8, 8);
    const whip1 = new THREE.Mesh(whipGeom, thrusterMat);
    whip1.rotation.z = Math.PI / 4;
    whip1.position.set(0.85, 1.35, -0.7);
    registerMesh(whip1, 'metals');
    commsGroup.add(whip1);

    const whip2 = new THREE.Mesh(whipGeom, thrusterMat);
    whip2.rotation.z = -Math.PI / 4;
    whip2.position.set(-0.85, 1.35, -0.7);
    registerMesh(whip2, 'metals');
    commsGroup.add(whip2);

    satelliteGroup.add(commsGroup);

    // ==========================================
    // E) AOKS & YILDIZ İZLER
    // ==========================================
    const adcsGroup = new THREE.Group();
    adcsGroup.name = 'ADCS_SYSTEM';
    adcsGroup.userData = {
        title: 'Yönelim Belirleme ve Kontrol Sistemi (AOKS)',
        category: 'Aviyonik Alt Sistemi',
        description: 'Uydunun uzaydaki yönelimini hassas olarak belirleyen çift Yıldız İzler (Star Tracker), Güneş algılayıcıları ve manyetik tork çubukları.',
        specs: [
            'Yıldız İzler: Ark-saniye Hassasiyetinde Optik Yıldız Takip',
            'Algılayıcılar: Güneş Duyargaları + Manyetometre',
            'Eyleyiciler: Reaksiyon Tekerleri + Tork Çubukları',
            'Yönelim Hassasiyeti: < 0.05°'
        ]
    };

    const stGeom = new THREE.CylinderGeometry(0.05, 0.07, 0.22, 16);
    const st1 = new THREE.Mesh(stGeom, darkOpticalMat);
    st1.rotation.z = -Math.PI / 3;
    st1.rotation.y = Math.PI / 6;
    st1.position.set(0.82, 0.7, -0.4);
    registerMesh(st1, 'optics');
    adcsGroup.add(st1);

    const st2 = new THREE.Mesh(stGeom, darkOpticalMat);
    st2.rotation.z = Math.PI / 3;
    st2.rotation.y = -Math.PI / 6;
    st2.position.set(-0.82, 0.7, -0.4);
    registerMesh(st2, 'optics');
    adcsGroup.add(st2);

    const torquerGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
    const torquerX = new THREE.Mesh(torquerGeom, aluminumMat);
    torquerX.position.set(0, 1.18, -0.5);
    torquerX.rotation.z = Math.PI / 2;
    registerMesh(torquerX, 'metals');
    adcsGroup.add(torquerX);

    satelliteGroup.add(adcsGroup);

    // ==========================================
    // F) İTKİ SİSTEMİ
    // ==========================================
    const propGroup = new THREE.Group();
    propGroup.name = 'PROPULSION_SYSTEM';
    propGroup.userData = {
        title: 'Milli İtki Sistemi ve Yörünge Düzeltme Motorları',
        category: 'İtki Alt Sistemi (Propulsion)',
        description: 'Uydunun 680 km irtifasını korumak, yörünge eğimini düzeltmek ve görev ömrü sonunda güvenli re-entry sağlamak için kullanılan elektrikli / soğuk gaz itki motorları.',
        specs: [
            'İtki Tipi: HALE Elektrikli İtki Motoru + Soğuk Gaz',
            'Nozul Malzemesi: Nikel-Titanyum Yüksek Sıcaklık Alaşımı',
            'Kullanım: Yörünge Tutma ve Çarpışma Önleme'
        ]
    };

    const propDeckGeom = new THREE.BoxGeometry(0.5, 0.08, 0.5);
    const propDeck = new THREE.Mesh(propDeckGeom, aluminumMat);
    propDeck.position.set(0, -1.2, -0.4);
    registerMesh(propDeck, 'metals');
    propGroup.add(propDeck);

    const thrusterBellGeom = new THREE.ConeGeometry(0.12, 0.28, 24, 1, true);
    const mainThruster = new THREE.Mesh(thrusterBellGeom, thrusterMat);
    mainThruster.rotation.x = Math.PI;
    mainThruster.position.set(0, -1.38, -0.4);
    registerMesh(mainThruster, 'propulsion');
    propGroup.add(mainThruster);

    const rcsGeom = new THREE.ConeGeometry(0.03, 0.08, 12, 1, true);
    const rcsOffsets = [
        [0.2, -1.25, -0.2], [-0.2, -1.25, -0.2], [0.2, -1.25, -0.6], [-0.2, -1.25, -0.6]
    ];
    rcsOffsets.forEach(([rx, ry, rz]) => {
        const rcsNozzle = new THREE.Mesh(rcsGeom, thrusterMat);
        rcsNozzle.rotation.x = Math.PI;
        rcsNozzle.position.set(rx, ry, rz);
        registerMesh(rcsNozzle, 'propulsion');
        propGroup.add(rcsNozzle);
    });
    satelliteGroup.add(propGroup);

    // ==========================================
    // MALZEME MODU FONKSİYONU
    // ==========================================
    function setMaterialAnalysisMode(active, targetMaterialType = 'all') {
        taggedMeshes.forEach(mesh => {
            if (!active) {
                mesh.material = mesh.userData.originalMaterial;
            } else {
                const mType = mesh.userData.materialType;
                if (targetMaterialType === 'all' || targetMaterialType === mType) {
                    mesh.material = diagnosticMats[mType] || diagnosticMats.metals;
                } else {
                    mesh.material = diagnosticMats.dimmed;
                }
            }
        });
    }

    satelliteGroup.rotation.set(0.18, 0.35, 0.0);

    return {
        satelliteGroup,
        setMaterialAnalysisMode
    };
}
