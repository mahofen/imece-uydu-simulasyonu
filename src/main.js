import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createImeceSatellite } from './satellite.js';
import { createEarthSystem, createStarfield } from './earth.js';

// Global Durum
const state = {
    viewMode: 'global_orbit', // 'global_orbit' (Gerçek Mesafe Yörünge) | 'satellite_chase' (Yakın Takip) | 'camera_pov' (Nadir POV) | 'ground_station' (Ankara)
    autoRotate: true,
    userInteracting: false,
    showEarth: true,
    showSwathCone: true,
    showAltRuler: true,
    materialMode: false,
    activeMaterialType: 'all',
    simSpeed: 10, // Başlangıçta yörünge hareketinin belirgin görülmesi için 10x
    isPaused: false,
    activeSubsystem: null,
    targetCameraPos: null,
    targetLookAt: null,
    orbitAngle: 0.5 // Yörünge açısı (radyan)
};

// 1. SAHNE VE KAMERA
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020409);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
);
// Başlangıç konumu: Tüm Dünya ve uydunun 680 km mesafedeki yörüngesi kadrajda
camera.position.set(0, 18, 36);
const currentLookAt = new THREE.Vector3(0, 0, 0);

// 2. RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 3. KONTROLLER
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2.0;
controls.maxDistance = 120;
controls.enablePan = true;
controls.target.copy(currentLookAt);

controls.addEventListener('start', () => {
    state.userInteracting = true;
    state.targetCameraPos = null;
});
controls.addEventListener('end', () => {
    setTimeout(() => {
        state.userInteracting = false;
    }, 2500);
});

// 4. IŞIKLANDIRMA SİSTEMİ
const sunLight = new THREE.DirectionalLight(0xfffaea, 3.4);
sunLight.position.set(18, 12, 16);
sunLight.castShadow = true;
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0xffecd1, 1.2);
fillLight.position.set(-16, 6, 12);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.0);
rimLight.position.set(-16, 12, -16);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0x222d3d, 0.75);
scene.add(ambientLight);

// 5. YILDIZ ALANI
const starfield = createStarfield();
scene.add(starfield);

// 6. DÜNYA VE GERÇEK 680 KM YÖRÜNGE SİSTEMİ
const earthSys = createEarthSystem();
scene.add(earthSys.earthGroup);

// 7. İMECE UYDUSU MODELİ
const { satelliteGroup: satellite, setMaterialAnalysisMode } = createImeceSatellite();
// Yörüngede uydunun hem gövdesinin hem panellerinin net görülebilmesi için uygun ölçek
satellite.scale.set(0.48, 0.48, 0.48);
scene.add(satellite);

// 8. ETKİLEŞİM VE SEÇİM
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-999, -999);

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function findSubsystemParent(object) {
    let curr = object;
    while (curr && curr.parent && curr.parent !== satellite) {
        if (curr.userData && curr.userData.title) return curr;
        curr = curr.parent;
    }
    if (curr && curr.userData && curr.userData.title) return curr;
    return null;
}

window.addEventListener('click', (event) => {
    if (event.target.closest('#hud-container') || event.target.closest('.interactive-panel') || event.target.closest('button')) {
        return;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(satellite.children, true);

    if (intersects.length > 0) {
        const targetSubsystem = findSubsystemParent(intersects[0].object);
        if (targetSubsystem) {
            selectSubsystem(targetSubsystem.name);
        }
    }
});

export function selectSubsystem(subsystemName) {
    const subsystem = satellite.getObjectByName(subsystemName);
    if (!subsystem || !subsystem.userData.title) return;

    state.activeSubsystem = subsystemName;
    updateSubsystemInfoPanel(subsystem.userData);

    // Uyduyu yakından inceleme moduna geç
    setObserverMode('satellite_chase');
}

function updateSubsystemInfoPanel(data) {
    const modal = document.getElementById('info-modal');
    if (!modal) return;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-desc').textContent = data.description;

    const specsEl = document.getElementById('modal-specs');
    specsEl.innerHTML = '';
    data.specs.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        specsEl.appendChild(li);
    });

    modal.classList.add('visible');
}

// 9. GÖZLEMCİ REFERANS MODLARI (Bakış Açıları)
export function setObserverMode(mode) {
    state.viewMode = mode;
    state.targetCameraPos = null;

    document.querySelectorAll('[data-observer]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-observer') === mode);
    });

    const reticleHUD = document.getElementById('camera-reticle');
    if (reticleHUD) {
        reticleHUD.style.display = mode === 'camera_pov' ? 'block' : 'none';
    }

    switch (mode) {
        case 'global_orbit': // Uzaydan tüm Dünya ve 680 km yörünge hareketi
            state.targetCameraPos = new THREE.Vector3(0, 18, 36);
            state.targetLookAt = new THREE.Vector3(0, 0, 0);
            controls.minDistance = 16;
            controls.maxDistance = 120;
            break;

        case 'satellite_chase': // Uydunun yanında 680 km irtifada uçuş takibi
            controls.minDistance = 1.2;
            controls.maxDistance = 25;
            break;

        case 'camera_pov': // İMECE'nin optik kamerasından yeryüzüne doğrudan bakış
            controls.minDistance = 0.5;
            controls.maxDistance = 10;
            break;

        case 'ground_station': // Ankara Yer İstasyonu perspektifinden gökyüzü
            state.targetCameraPos = new THREE.Vector3(-1.8, -10.5, 3.8);
            state.targetLookAt = satellite.position.clone();
            controls.minDistance = 3;
            controls.maxDistance = 50;
            break;
    }
}

// 10. GERÇEK ORANSAL YÖRÜNGE HAREKETİ HESAPLAMASI
function updateSatelliteOrbit(delta) {
    if (!state.isPaused) {
        // Gerçek orbital hız: 98.4 dakika periyot
        // delta * (2*PI / 5904 s) * simSpeed
        const meanMotion = (Math.PI * 2 / 5904);
        state.orbitAngle += delta * meanMotion * state.simSpeed * 12;
    }

    const R_orb = earthSys.orbitRadius; // 15.494 birim (680 km gerçek orantılı yarıçap)
    const inc = earthSys.inclination;   // 98.2° kutupsal eğim

    // Yörünge düzlemindeki konumun 3B dünya koordinatlarına izdüşümü
    const satX = R_orb * Math.cos(state.orbitAngle);
    const satY = R_orb * Math.sin(state.orbitAngle) * Math.sin(inc);
    const satZ = R_orb * Math.sin(state.orbitAngle) * Math.cos(inc);

    satellite.position.set(satX, satY, satZ);

    // NADİR YÖNELİMİ (Nadir Pointing):
    // İMECE'nin elektro-optik kamerası (+Z yönü) her an tam olarak Dünya'nın merkezine (0, 0, 0) bakar!
    satellite.lookAt(0, 0, 0);

    // Dünya sistemi ve 680 km irtifa lazer çizgisini güncelle
    const { isContact } = earthSys.update(delta, state.isPaused ? 0 : state.simSpeed, satellite.position);

    // Kamera Takip Modları
    if (state.viewMode === 'satellite_chase' && !state.userInteracting) {
        // Kamerayı uydunun arkasında ve biraz üstünde uçur
        const satNorm = satellite.position.clone().normalize();
        const velocityVec = new THREE.Vector3(
            -R_orb * Math.sin(state.orbitAngle),
            R_orb * Math.cos(state.orbitAngle) * Math.sin(inc),
            R_orb * Math.cos(state.orbitAngle) * Math.cos(inc)
        ).normalize();

        const camOffset = velocityVec.clone().multiplyScalar(-3.5).add(satNorm.clone().multiplyScalar(1.8));
        camera.position.copy(satellite.position).add(camOffset);
        controls.target.copy(satellite.position);
    } else if (state.viewMode === 'camera_pov' && !state.userInteracting) {
        // Kamerayı uydunun optik namlusuna yerleştir, doğrudan yeryüzüne baksın
        camera.position.copy(satellite.position);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
    } else if (state.viewMode === 'ground_station' && !state.userInteracting) {
        // Yer istasyonundan gökyüzündeki uyduyu takip et
        controls.target.copy(satellite.position);
    }

    // Telemetri Paneli Güncelleme
    const lat = Math.asin(satY / R_orb) * (180 / Math.PI);
    const lon = (Math.atan2(satZ, satX) * (180 / Math.PI) - (Date.now() * 0.005 * state.simSpeed)) % 360;

    const latEl = document.getElementById('telemetry-lat');
    const lonEl = document.getElementById('telemetry-lon');
    const stationEl = document.getElementById('telemetry-station');
    const downlinkEl = document.getElementById('telemetry-downlink');

    if (latEl) latEl.textContent = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'K' : 'G'}`;
    if (lonEl) lonEl.textContent = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'D' : 'B'}`;
    if (stationEl) {
        stationEl.textContent = isContact ? 'İrtibat Kuruldu (Ankara AOK)' : 'Ufuk Altında';
        stationEl.style.color = isContact ? '#4ade80' : '#94a3b8';
    }
    if (downlinkEl) {
        downlinkEl.textContent = isContact ? '320 Mbps (Aktif Aktarım)' : 'Beklemede (Depolanıyor)';
        downlinkEl.style.color = isContact ? '#38bdf8' : '#64748b';
    }
}

// 11. EKRAN BOYUTU YÖNETİMİ
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 12. ANİMASYON DÖNGÜSÜ
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Gerçek 680 km fiziksel yörünge hareketi
    updateSatelliteOrbit(delta);

    // Kamera Yumuşak Geçişi (Lerp)
    if (state.targetCameraPos) {
        camera.position.lerp(state.targetCameraPos, 0.06);
        controls.target.lerp(state.targetLookAt, 0.06);
        if (camera.position.distanceTo(state.targetCameraPos) < 0.05) {
            state.targetCameraPos = null;
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

// 13. UI ETKİLEŞİMLERİ
function setupUI() {
    // Gözlemci Modları
    document.querySelectorAll('[data-observer]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.getAttribute('data-observer');
            setObserverMode(mode);
        });
    });

    // Zaman Hızlandırma
    document.querySelectorAll('[data-speed]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const spd = parseFloat(e.currentTarget.getAttribute('data-speed'));
            state.simSpeed = spd;
            document.querySelectorAll('[data-speed]').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // Duraklat / Oynat
    const pauseBtn = document.getElementById('btn-pause-play');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            state.isPaused = !state.isPaused;
            pauseBtn.classList.toggle('active', state.isPaused);
            pauseBtn.innerHTML = state.isPaused ? '<span>▶️</span> Oynat' : '<span>⏸️</span> Duraklat';
        });
    }

    // Malzeme Analizi Aç/Kapa
    const materialToggleBtn = document.getElementById('btn-toggle-materials');
    const materialsPanel = document.getElementById('materials-panel');
    if (materialToggleBtn) {
        materialToggleBtn.addEventListener('click', () => {
            state.materialMode = !state.materialMode;
            materialToggleBtn.classList.toggle('active', state.materialMode);
            if (materialsPanel) materialsPanel.classList.toggle('visible', state.materialMode);
            setMaterialAnalysisMode(state.materialMode, state.activeMaterialType);
        });
    }

    // Malzeme Filtre Butonları
    document.querySelectorAll('[data-material-filter]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const matType = e.currentTarget.getAttribute('data-material-filter');
            state.activeMaterialType = matType;
            document.querySelectorAll('[data-material-filter]').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            setMaterialAnalysisMode(true, matType);
            showMaterialInfo(matType);
        });
    });

    // Alt Sistem Butonları
    document.querySelectorAll('[data-subsystem]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sys = e.currentTarget.getAttribute('data-subsystem');
            selectSubsystem(sys);
        });
    });

    // İrtifa Cetveli İşaretçileri Tıklama
    document.querySelectorAll('.gauge-marker').forEach(marker => {
        marker.addEventListener('click', (e) => {
            const alt = e.currentTarget.getAttribute('data-alt');
            if (alt === '680') {
                setObserverMode('satellite_chase');
            } else if (alt === '0') {
                setObserverMode('camera_pov');
            } else {
                setObserverMode('global_orbit');
            }
        });
    });

    // Modal Kapatma
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('info-modal').classList.remove('visible');
            state.activeSubsystem = null;
        });
    }

    const loader = document.getElementById('app-loader');
    if (loader) loader.remove();
}

function showMaterialInfo(type) {
    const infoMap = {
        all: {
            title: 'Tüm Uzay Malzemeleri Dağılımı',
            desc: 'İMECE uydusunun gövde, güneş panelleri, kamera optiği ve itki sistemlerinde kullanılan ileri mühendislik malzemeleri.'
        },
        mli: {
            title: 'Kapton MLI (Çok Katmanlı Isıl Yalıtım)',
            desc: '20 kat aluminize Mylar ve Kapton poliimid film. Uzayın -150°C ile +120°C arası radyasyonel sıcaklık farklarına karşı uydunun aviyoniklerini korur.'
        },
        solar: {
            title: 'GaAs / InGaP Üç Eklemeli Güneş Hücreleri',
            desc: '%30 üzeri foton-elektron dönüşüm verimi. Uzay radyasyonuna karşı sertleştirilmiş galyum arsenit kristal wafer yapısı.'
        },
        cfrp: {
            title: 'CFRP (Karbon Elyaf Takviyeli Kompozit)',
            desc: 'Sıfıra yakın ısıl genleşme katsayısı (CTE). Sıcaklık dalgalanmalarında dahi teleskop aynalarının mikron altı hizasını korur.'
        },
        metals: {
            title: 'Havacılık Sınıfı Alüminyum 7075 & Titanyum Ti-6Al-4V',
            desc: 'Fırlatma anındaki 10G titreşim ve mekanik akustik şok yüklerine dayanıklı ana taşıyıcı iskelet ve cıvatalar.'
        },
        optics: {
            title: 'Zerodur & Erimiş Kuvars Optik Aynalar',
            desc: 'Aşırı düşük genleşmeli cam seramik ayna gövdeleri ve yansıma önleyici kaplamalar. Metre-altı çözünürlük için ışığı odaklar.'
        },
        propulsion: {
            title: 'Yüksek Sıcaklık Nikel Alaşımlı İtki Nozulları',
            desc: '1000°C üzerindeki plazma ve gaz çıkışlarına dayanıklı elektrikli / soğuk gaz manevra memeleri.'
        }
    };

    const data = infoMap[type] || infoMap.all;
    const cardEl = document.getElementById('material-desc-box');
    if (cardEl) {
        cardEl.innerHTML = `<strong>${data.title}</strong><p>${data.desc}</p>`;
    }
}

setupUI();
animate();
