import * as THREE from 'three';

// 1. GÜNEŞ PANELİ DOKUSU (Solar Cell Array Texture)
export function createSolarPanelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#050e1e';
    ctx.fillRect(0, 0, 1024, 1024);

    const cols = 6;
    const rows = 12;
    const padX = 8;
    const padY = 8;
    const cellW = (1024 - (cols + 1) * padX) / cols;
    const cellH = (1024 - (rows + 1) * padY) / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = padX + c * (cellW + padX);
            const y = padY + r * (cellH + padY);

            // Hücre rengi: derin lacivert-mavi GaAs yansıma gradyanı
            const cellGrad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
            cellGrad.addColorStop(0, '#092143');
            cellGrad.addColorStop(0.5, '#0d3264');
            cellGrad.addColorStop(1, '#071a36');
            ctx.fillStyle = cellGrad;

            const cornerCut = 6;
            ctx.beginPath();
            ctx.moveTo(x + cornerCut, y);
            ctx.lineTo(x + cellW - cornerCut, y);
            ctx.lineTo(x + cellW, y + cornerCut);
            ctx.lineTo(x + cellW, y + cellH - cornerCut);
            ctx.lineTo(x + cellW - cornerCut, y + cellH);
            ctx.lineTo(x + cornerCut, y + cellH);
            ctx.lineTo(x, y + cellH - cornerCut);
            ctx.lineTo(x, y + cornerCut);
            ctx.closePath();
            ctx.fill();

            // İnce gümüş toplayıcı mikro çizgiler (Grid fingers)
            ctx.strokeStyle = 'rgba(180, 220, 255, 0.3)';
            ctx.lineWidth = 1;
            const fingerCount = 14;
            const fingerStep = cellH / (fingerCount + 1);
            for (let f = 1; f <= fingerCount; f++) {
                ctx.beginPath();
                ctx.moveTo(x + 2, y + f * fingerStep);
                ctx.lineTo(x + cellW - 2, y + f * fingerStep);
                ctx.stroke();
            }

            // Ana gümüş iletken baralar (Busbars - 2 dikey hat)
            ctx.strokeStyle = '#dbeefd';
            ctx.lineWidth = 2.2;
            const busbar1 = x + cellW * 0.33;
            const busbar2 = x + cellW * 0.67;
            ctx.beginPath();
            ctx.moveTo(busbar1, y + 1);
            ctx.lineTo(busbar1, y + cellH - 1);
            ctx.moveTo(busbar2, y + 1);
            ctx.lineTo(busbar2, y + cellH - 1);
            ctx.stroke();

            // Bağlantı lehim noktaları
            ctx.fillStyle = '#f0f6ff';
            ctx.fillRect(busbar1 - 1.5, y + 2, 3, 5);
            ctx.fillRect(busbar1 - 1.5, y + cellH - 7, 3, 5);
            ctx.fillRect(busbar2 - 1.5, y + 2, 3, 5);
            ctx.fillRect(busbar2 - 1.5, y + cellH - 7, 3, 5);
        }
    }

    ctx.strokeStyle = '#162438';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 1020, 1020);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// 2. ÇOK KATMANLI YALITIM (GOLD KAPTON MLI) DOKUSU
export function createGoldMLITexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#cb8c12';
    ctx.fillRect(0, 0, 512, 512);

    const gridSize = 32;
    for (let y = 0; y < 512; y += gridSize) {
        for (let x = 0; x < 512; x += gridSize) {
            const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
            const rand = seed - Math.floor(seed);
            
            const grad = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
            if (rand > 0.5) {
                grad.addColorStop(0, '#f0b32f');
                grad.addColorStop(0.5, '#cb8c12');
                grad.addColorStop(1, '#945d03');
            } else {
                grad.addColorStop(0, '#fccb4e');
                grad.addColorStop(0.5, '#b47808');
                grad.addColorStop(1, '#784a00');
            }
            ctx.fillStyle = grad;
            ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);

            ctx.strokeStyle = 'rgba(70, 38, 0, 0.45)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, gridSize, gridSize);

            ctx.fillStyle = 'rgba(255, 235, 160, 0.65)';
            ctx.fillRect(x + 4, y + 4, 2, 2);
            ctx.fillRect(x + gridSize - 6, y + gridSize - 6, 2, 2);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
}

// 3. MLI BUMP HARİTASI
export function createMLIBumpMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    const gridSize = 32;
    for (let y = 0; y < 512; y += gridSize) {
        for (let x = 0; x < 512; x += gridSize) {
            const radGrad = ctx.createRadialGradient(
                x + gridSize / 2, y + gridSize / 2, 2,
                x + gridSize / 2, y + gridSize / 2, gridSize / 1.4
            );
            radGrad.addColorStop(0, '#ffffff');
            radGrad.addColorStop(0.7, '#888888');
            radGrad.addColorStop(1, '#2c2c2c');
            ctx.fillStyle = radGrad;
            ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
}

// 4. GÖVDE VE LOGO / DEKORASYON DOKUSU
export function createBodyDecalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#d5dce4';
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.strokeStyle = '#8593a2';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 984, 984);
    ctx.beginPath();
    ctx.moveTo(20, 512); ctx.lineTo(1004, 512);
    ctx.moveTo(512, 20); ctx.lineTo(512, 1004);
    ctx.stroke();

    ctx.fillStyle = '#4c5867';
    for (let i = 40; i < 1000; i += 60) {
        ctx.beginPath(); ctx.arc(i, 35, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(i, 989, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(35, i, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(989, i, 4, 0, Math.PI * 2); ctx.fill();
    }

    // TÜRK BAYRAĞI
    const flagX = 80;
    const flagY = 80;
    const flagW = 280;
    const flagH = 186;

    ctx.fillStyle = '#E30A17';
    ctx.fillRect(flagX, flagY, flagW, flagH);

    const moonCenterX = flagX + flagW * 0.42;
    const moonCenterY = flagY + flagH * 0.5;
    const outerR = flagH * 0.28;
    const innerR = flagH * 0.224;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(moonCenterX, moonCenterY, outerR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#E30A17';
    ctx.beginPath();
    ctx.arc(moonCenterX + outerR * 0.24, moonCenterY, innerR, 0, Math.PI * 2);
    ctx.fill();

    const starX = moonCenterX + outerR * 0.72;
    const starY = moonCenterY;
    const starR = flagH * 0.12;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 18) * Math.PI / 180;
        const innerAngle = (i * 72 + 18) * Math.PI / 180;
        const ox = starX + Math.cos(outerAngle) * starR;
        const oy = starY + Math.sin(outerAngle) * starR;
        const ix = starX + Math.cos(innerAngle) * (starR * 0.38);
        const iy = starY + Math.sin(innerAngle) * (starR * 0.38);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();

    // İMECE BAŞLIK
    ctx.fillStyle = '#0b2545';
    ctx.font = 'bold 78px "Segoe UI", Arial, sans-serif';
    ctx.fillText('İMECE', 430, 160);

    ctx.fillStyle = '#134074';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('YER GÖZLEM UYDUSU', 430, 205);

    ctx.fillStyle = '#556980';
    ctx.font = '600 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('SUB-METER HIGH RESOLUTION EARTH OBSERVATION', 430, 235);

    // TÜBİTAK UZAY
    ctx.fillStyle = '#091e3a';
    ctx.fillRect(80, 310, 480, 120);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.fillText('TÜBİTAK UZAY', 110, 365);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Uzay Teknolojileri Araştırma Enstitüsü', 110, 400);

    // TEKNİK PLAKET
    ctx.fillStyle = '#17202b';
    ctx.fillRect(80, 560, 400, 380);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 560, 400, 380);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "Consolas", monospace';
    ctx.fillText('IMECE MISSION SPECS', 105, 605);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px "Consolas", monospace';
    const specs = [
        'ALTITUDE: 680 KM SSO (98.2°)',
        'SPEED: 7.51 KM/S (27,036 KM/H)',
        'PAYLOAD: OPMER SUB-METER EO',
        'GSD: < 1.0 METER (PANCHROMATIC)',
        'SWATH: 13.9 KM PUSHBROOM',
        'DOWNLINK: X-BAND 320 MBPS',
        'LAUNCH: 15 APR 2023 (FALCON 9)',
        'GROUND STATION: ANKARA AOK'
    ];
    specs.forEach((text, idx) => {
        ctx.fillText(text, 105, 645 + idx * 34);
    });

    // RADYATÖR PANELİ
    ctx.fillStyle = '#202d38';
    ctx.fillRect(540, 560, 400, 380);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    for (let ly = 580; ly < 920; ly += 16) {
        ctx.beginPath();
        ctx.moveTo(560, ly);
        ctx.lineTo(920, ly);
        ctx.stroke();
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px "Consolas", monospace';
    ctx.fillText('THERMAL RADIATOR PANEL (OSR)', 610, 930);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// 5. KARBON FİBER DOKUSU
export function createCarbonFiberTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#101215';
    ctx.fillRect(0, 0, 128, 128);

    const step = 8;
    for (let y = 0; y < 128; y += step) {
        for (let x = 0; x < 128; x += step) {
            const isAlt = ((x / step) + (y / step)) % 2 === 0;
            ctx.fillStyle = isAlt ? '#202328' : '#131518';
            ctx.fillRect(x, y, step, step);

            ctx.strokeStyle = isAlt ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.4)';
            ctx.strokeRect(x, y, step, step);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
}

// 6. DÜNYA GÜNDÜZ YÜZEY DOKUSU (Earth Day Map)
export function createEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Derin okyanus mavisi gradyanı
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#0a2444');
    oceanGrad.addColorStop(0.5, '#071c38');
    oceanGrad.addColorStop(1, '#0a2444');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    function drawContinent(cx, cy, rx, ry, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.15) {
            const noise = 0.8 + 0.45 * Math.sin(a * 4 + cx * 0.05) * Math.cos(a * 3 + cy * 0.05);
            const x = cx + Math.cos(a) * rx * noise;
            const y = cy + Math.sin(a) * ry * noise;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    // Afrika & Anadolu & Akdeniz
    drawContinent(1100, 530, 180, 230, '#476332');
    drawContinent(1120, 430, 130, 110, '#b89d58'); // Sahra
    drawContinent(1160, 355, 80, 50, '#355312');   // Anadolu & Akdeniz
    drawContinent(1280, 420, 90, 80, '#9c7d50');   // Arap Yarımadası

    // Avrupa & Asya
    drawContinent(1120, 280, 150, 100, '#2c5925');
    drawContinent(1460, 340, 330, 190, '#244d34');
    drawContinent(1420, 430, 140, 100, '#628151'); // Hindistan

    // Amerika
    drawContinent(460, 310, 200, 140, '#2c5925'); // Kuzey Amerika
    drawContinent(600, 630, 130, 220, '#1d441e'); // Güney Amerika
    drawContinent(490, 370, 90, 80, '#897048');   // Kayalık Dağlar

    // Avustralya
    drawContinent(1680, 690, 120, 90, '#986341');

    // Kutuplar
    ctx.fillStyle = '#edf2f7';
    ctx.fillRect(0, 0, 2048, 80);
    ctx.fillRect(0, 940, 2048, 84);

    // Kıyı resifleri (Turkuaz parıltı)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 6;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// 7. DÜNYA GECE ŞEHİR IŞIKLARI DOKUSU (Earth Night Lights Texture)
export function createEarthNightTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Gece tarafı zifiri karanlık
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 2048, 1024);

    // Şehir ışık kümesi çizimi
    function drawCityCluster(cx, cy, count, radius, color) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.pow(Math.random(), 1.8) * radius;
            const x = cx + Math.cos(angle) * dist;
            const y = cy + Math.sin(angle) * dist;
            const intensity = 0.4 + Math.random() * 0.6;
            ctx.fillStyle = color || `rgba(255, 215, 120, ${intensity})`;
            ctx.fillRect(x, y, 1.5, 1.5);
        }
    }

    // Avrupa & Türkiye (Ankara, İstanbul, İzmir)
    drawCityCluster(1160, 355, 250, 45, 'rgba(255, 225, 140, 0.95)'); // Türkiye & Ankara
    drawCityCluster(1110, 290, 600, 90, 'rgba(255, 220, 130, 0.9)');  // Batı Avrupa
    drawCityCluster(1220, 360, 200, 50, 'rgba(255, 210, 120, 0.85)'); // Orta Doğu & Körfez
    
    // Kuzey Amerika Doğu ve Batı Yakası
    drawCityCluster(520, 330, 500, 80, 'rgba(255, 225, 140, 0.9)');
    drawCityCluster(410, 340, 300, 60, 'rgba(255, 215, 120, 0.85)');

    // Doğu Asya & Hindistan
    drawCityCluster(1550, 360, 600, 95, 'rgba(255, 220, 130, 0.9)');
    drawCityCluster(1390, 430, 350, 70, 'rgba(255, 205, 110, 0.85)');

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// 8. DÜNYA BULUT KATMANI DOKUSU
export function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 2048, 1024);

    for (let i = 0; i < 420; i++) {
        const x = Math.random() * 2048;
        const y = 110 + Math.random() * 800;
        const r = 25 + Math.random() * 65;
        const alpha = 0.16 + Math.random() * 0.48;

        const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.5, `rgba(235, 245, 255, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
