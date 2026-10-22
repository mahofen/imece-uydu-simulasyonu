import * as THREE from 'three';

// 1. Güneş Hücresi Dokusu (GaAs Triple-Junction Solar Cell Texture)
export function createSolarPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#030b18';
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

      // Hücre kristal mavisi gradyanı
      const cellGrad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
      cellGrad.addColorStop(0, '#0a2347');
      cellGrad.addColorStop(0.5, '#0e3972');
      cellGrad.addColorStop(1, '#071d3a');
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
      ctx.strokeStyle = 'rgba(180, 220, 255, 0.35)';
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
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2.5;
      const busbar1 = x + cellW * 0.33;
      const busbar2 = x + cellW * 0.67;
      ctx.beginPath();
      ctx.moveTo(busbar1, y + 1);
      ctx.lineTo(busbar1, y + cellH - 1);
      ctx.moveTo(busbar2, y + 1);
      ctx.lineTo(busbar2, y + cellH - 1);
      ctx.stroke();

      // Lehim noktaları
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(busbar1 - 2, y + 2, 4, 6);
      ctx.fillRect(busbar1 - 2, y + cellH - 8, 4, 6);
      ctx.fillRect(busbar2 - 2, y + 2, 4, 6);
      ctx.fillRect(busbar2 - 2, y + cellH - 8, 4, 6);
    }
  }

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 1020, 1020);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Çok Katmanlı Altın Yalıtım (Gold Kapton MLI) Dokusu
export function createGoldMLITexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#c98a12';
  ctx.fillRect(0, 0, 512, 512);

  const gridSize = 32;
  for (let y = 0; y < 512; y += gridSize) {
    for (let x = 0; x < 512; x += gridSize) {
      const grad = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
      grad.addColorStop(0, '#f5b025');
      grad.addColorStop(0.3, '#df9816');
      grad.addColorStop(0.7, '#b2750a');
      grad.addColorStop(1, '#825204');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);

      // Dikiş ve daktilo perçin noktaları
      ctx.fillStyle = '#452b04';
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 1.2, 0, Math.PI * 2);
      ctx.arc(x + gridSize - 2, y + 2, 1.2, 0, Math.PI * 2);
      ctx.arc(x + 2, y + gridSize - 2, 1.2, 0, Math.PI * 2);
      ctx.arc(x + gridSize - 2, y + gridSize - 2, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. MLI Kırışıklık Kabartma Haritası (Bump Map)
export function createMLIBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  const gridSize = 32;
  for (let y = 0; y < 512; y += gridSize) {
    for (let x = 0; x < 512; x += gridSize) {
      const grad = ctx.createRadialGradient(
        x + gridSize / 2, y + gridSize / 2, 2,
        x + gridSize / 2, y + gridSize / 2, gridSize / 1.5
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, '#888888');
      grad.addColorStop(1, '#333333');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. Gövde Logo ve Bayrak Dokusu (İMECE & TÜBİTAK UZAY)
export function createBodyDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Arka plan altın MLI
  ctx.fillStyle = '#c98a12';
  ctx.fillRect(0, 0, 1024, 1024);

  // Beyaz koruyucu radyatör plakası
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(160, 180, 704, 664);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 6;
  ctx.strokeRect(160, 180, 704, 664);

  // Türk Bayrağı
  const flagX = 362;
  const flagY = 240;
  const flagW = 300;
  const flagH = 200;

  ctx.fillStyle = '#E30A17';
  ctx.fillRect(flagX, flagY, flagW, flagH);

  // Hilal
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(flagX + flagW * 0.38, flagY + flagH * 0.5, flagH * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E30A17';
  ctx.beginPath();
  ctx.arc(flagX + flagW * 0.44, flagY + flagH * 0.5, flagH * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Yıldız
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  const starCx = flagX + flagW * 0.62;
  const starCy = flagY + flagH * 0.5;
  const rOuter = flagH * 0.12;
  const rInner = rOuter * 0.38;
  for (let i = 0; i < 5; i++) {
    const rot = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    const xO = starCx + Math.cos(rot) * rOuter;
    const yO = starCy + Math.sin(rot) * rOuter;
    if (i === 0) ctx.moveTo(xO, yO);
    else ctx.lineTo(xO, yO);

    const rotIn = rot + Math.PI / 5;
    const xI = starCx + Math.cos(rotIn) * rInner;
    const yI = starCy + Math.sin(rotIn) * rInner;
    ctx.lineTo(xI, yI);
  }
  ctx.closePath();
  ctx.fill();

  // İMECE Yazısı
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 78px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('İMECE', 512, 530);

  // TÜBİTAK UZAY
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TÜBİTAK UZAY', 512, 600);

  // Yer Gözlem Uydusu
  ctx.fillStyle = '#475569';
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('METRE-ALTI ELEKTRO-OPTİK UYDU', 512, 650);

  // Çözünürlük etiketi
  ctx.fillStyle = '#0284c7';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('680 KM SSO | GSD < 0.99M', 512, 720);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 5. Karbon Elyaf Kompozit (CFRP) Dokusu
export function createCarbonFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#1e242d';
  ctx.fillRect(0, 0, 128, 128);

  const size = 16;
  for (let y = 0; y < 128; y += size) {
    for (let x = 0; x < 128; x += size) {
      if ((x / size + y / size) % 2 === 0) {
        ctx.fillStyle = '#2d3748';
      } else {
        ctx.fillStyle = '#11161d';
      }
      ctx.fillRect(x, y, size, size);

      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, size, size);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// 6. 3D Dünya Gündüz Dokusu (Earth Day Texture)
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Okyanus rengi
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, '#0a2342');
  oceanGrad.addColorStop(0.5, '#0b3c68');
  oceanGrad.addColorStop(1, '#0a2342');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Kıtalar (Basitleştirilmiş organik şekiller)
  ctx.fillStyle = '#22543d'; // Ormanlar / yeşil alanlar
  ctx.strokeStyle = '#276749';

  function drawContinent(points: [number, number][], color: string) {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([x, y], idx) => {
      const px = (x / 360) * 2048;
      const py = ((90 - y) / 180) * 1024;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
  }

  // Avrupa & Anadolu & Orta Doğu
  drawContinent([
    [32, 42], [44, 40], [42, 36], [28, 36], [26, 41], [32, 42]
  ], '#38a169');

  // Afrika
  drawContinent([
    [-17, 15], [-5, 36], [12, 37], [32, 31], [43, 12], [51, 10],
    [40, -10], [35, -34], [18, -34], [10, 5], [-17, 15]
  ], '#b7791f'); // Sahra çölü ve savan

  // Asya & Sibirya
  drawContinent([
    [40, 40], [60, 60], [100, 70], [140, 65], [170, 60],
    [140, 35], [120, 25], [100, 15], [80, 20], [70, 30], [50, 35], [40, 40]
  ], '#2f855a');

  // Amerika kıtaları
  drawContinent([
    [-125, 48], [-120, 60], [-80, 65], [-65, 45], [-75, 25],
    [-90, 20], [-105, 25], [-125, 48]
  ], '#276749');

  drawContinent([
    [-80, 10], [-50, -5], [-35, -5], [-40, -22], [-60, -40],
    [-70, -55], [-75, -45], [-75, -15], [-80, 10]
  ], '#22543d');

  // Kutup buzulları
  ctx.fillStyle = '#edf2f7';
  ctx.fillRect(0, 0, 2048, 60);
  ctx.fillRect(0, 960, 2048, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 7. Dünya Gece Şehir Işıkları (Earth Night Texture)
export function createEarthNightTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#02050b';
  ctx.fillRect(0, 0, 2048, 1024);

  // Şehir ışıkları (Sarı/altın noktalar ve kümeler)
  const cityClusters = [
    { x: 33, y: 40, r: 18, count: 60 }, // Türkiye / Ankara / İstanbul
    { x: 10, y: 50, r: 25, count: 120 }, // Batı Avrupa
    { x: -75, y: 40, r: 30, count: 140 }, // Doğu ABD
    { x: 116, y: 39, r: 25, count: 110 }, // Doğu Asya
    { x: 77, y: 28, r: 25, count: 90 }, // Hindistan
    { x: 37, y: 55, r: 15, count: 50 } // Moskova
  ];

  cityClusters.forEach(cluster => {
    const cx = ((cluster.x + 180) / 360) * 2048;
    const cy = ((90 - cluster.y) / 180) * 1024;

    for (let i = 0; i < cluster.count; i++) {
      const rx = cx + (Math.random() - 0.5) * cluster.r * 8;
      const ry = cy + (Math.random() - 0.5) * cluster.r * 4;
      const alpha = Math.random() * 0.9 + 0.1;

      ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 8. Dünya Bulut Katmanı Dokusu (Cloud Texture)
export function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const w = 60 + Math.random() * 120;
    const h = 20 + Math.random() * 50;

    const grad = ctx.createRadialGradient(x, y, 4, x, y, w / 2);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, (Math.random() - 0.5) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
