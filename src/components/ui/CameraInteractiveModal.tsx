import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Camera, Eye, Sliders, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

interface TargetArea {
  id: string;
  name: string;
  type: string;
  description: string;
  sampleImg099: string; // SVG data uri for crisp procedural illustration of 0.99m resolution
  sampleImg10m: string;
}

const TARGETS: TargetArea[] = [
  {
    id: 'ankara',
    name: 'Ankara (Anıtkabir & Şehir Dokusu)',
    type: 'Kentsel Alan',
    description: 'Binaların çatıları, sokaklar, stadyumlar ve yoldaki otomobiller net bir şekilde ayırt edilir.',
    sampleImg099: 'urban-099',
    sampleImg10m: 'urban-10'
  },
  {
    id: 'vango',
    name: 'Van Gölü & Akdamar Adası',
    type: 'Doğal Coğrafya & Su Kaynağı',
    description: 'Göl kıyı çizgisi, su seviyesi değişimleri ve tarihi ada yapıları yüksek doğrulukla haritalanır.',
    sampleImg099: 'lake-099',
    sampleImg10m: 'lake-10'
  },
  {
    id: 'tarim',
    name: 'Konya Ovası Tarım Arazileri',
    type: 'Tarım ve Bitki Örtüsü',
    description: 'Dairesel sulama tarlaları, ekin sağlığı, rekolte tahmini ve kuraklık takibi hassasiyetle yapılır.',
    sampleImg099: 'agri-099',
    sampleImg10m: 'agri-10'
  }
];

export const CameraInteractiveModal: React.FC = () => {
  const {
    photoModalOpen,
    setPhotoModalOpen,
    triggerPhotoCapture
  } = useSimulator();

  const [selectedTarget, setSelectedTarget] = useState<TargetArea>(TARGETS[0]);
  const [resolutionMode, setResolutionMode] = useState<'0.99m' | '10m' | '30m'>('0.99m');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const handleCapture = () => {
    setIsCapturing(true);
    triggerPhotoCapture();
    setTimeout(() => {
      setIsCapturing(false);
    }, 600);
  };

  return (
    <div className="interactive-sub-card camera-card">
      <div className="card-top-header">
        <div className="card-title-badge">
          <Camera size={18} className="text-emerald" />
          <strong>Metre-Altı Optik Görüntüleme Deneyi</strong>
        </div>
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="capture-btn"
        >
          <Camera size={16} />
          {isCapturing ? 'Görüntü Taranıyor...' : 'Fotoğraf Çek (Görüntüle)'}
        </button>
      </div>

      {/* Hedef Seçimi */}
      <div className="target-selection-row">
        <span className="target-select-label">
          <MapPin size={14} /> Dünya Üzerindeki Hedef Bölge:
        </span>
        <div className="target-chips-container">
          {TARGETS.map((target) => (
            <button
              key={target.id}
              onClick={() => setSelectedTarget(target)}
              className={`target-chip ${selectedTarget.id === target.id ? 'active' : ''}`}
            >
              {target.name}
            </button>
          ))}
        </div>
      </div>

      {/* Çözünürlük Karşılaştırma Alanı */}
      <div className="resolution-comparison-container">
        <div className="resolution-switcher-bar">
          <span className="res-switch-title">
            <Sliders size={14} /> Çözünürlük Seviyesi (GSD):
          </span>
          <div className="res-buttons">
            <button
              className={`res-btn ${resolutionMode === '0.99m' ? 'active-imece' : ''}`}
              onClick={() => setResolutionMode('0.99m')}
            >
              🌟 0.99 m (İMECE)
            </button>
            <button
              className={`res-btn ${resolutionMode === '10m' ? 'active' : ''}`}
              onClick={() => setResolutionMode('10m')}
            >
              10 m (Orta)
            </button>
            <button
              className={`res-btn ${resolutionMode === '30m' ? 'active' : ''}`}
              onClick={() => setResolutionMode('30m')}
            >
              30 m (Düşük)
            </button>
          </div>
        </div>

        {/* Temsili Uydu Görüntüsü Önizleme Tuvali */}
        <div className="satellite-photo-viewer">
          <div
            className={`photo-canvas-display ${
              resolutionMode === '10m' ? 'blur-medium' : resolutionMode === '30m' ? 'blur-heavy' : ''
            }`}
          >
            {/* Temsili Yüksek Detaylı Simülatör Sahnesi */}
            <svg viewBox="0 0 400 240" className="simulated-satellite-svg">
              <rect width="400" height="240" fill={selectedTarget.id === 'vango' ? '#0284c7' : '#064e3b'} />
              
              {selectedTarget.id === 'ankara' && (
                <g>
                  {/* Binalar ve sokak dokusu */}
                  <rect x="20" y="30" width="70" height="50" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
                  <rect x="110" y="30" width="120" height="70" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
                  <rect x="250" y="40" width="120" height="50" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
                  <rect x="50" y="120" width="90" height="90" fill="#f8fafc" stroke="#dc2626" strokeWidth="3" />
                  <circle cx="95" cy="165" r="24" fill="#0284c7" />
                  {/* Yoldaki araçlar (0.99m GSD ile ayırt edilebilir) */}
                  <rect x="160" y="140" width="12" height="6" fill="#eab308" rx="2" />
                  <rect x="190" y="140" width="14" height="7" fill="#ef4444" rx="2" />
                  <rect x="230" y="140" width="12" height="6" fill="#ffffff" rx="2" />
                  {/* Yollar */}
                  <line x1="0" y1="110" x2="400" y2="110" stroke="#64748b" strokeWidth="14" />
                  <line x1="240" y1="0" x2="240" y2="240" stroke="#64748b" strokeWidth="12" />
                </g>
              )}

              {selectedTarget.id === 'vango' && (
                <g>
                  {/* Su dalgaları ve Akdamar adası */}
                  <path d="M 60 140 Q 120 70 240 90 T 360 160 Q 280 230 140 210 Z" fill="#ca8a04" />
                  <circle cx="180" cy="140" r="16" fill="#e2e8f0" stroke="#78350f" strokeWidth="2" />
                  <path d="M 175 130 L 185 130 L 180 120 Z" fill="#dc2626" />
                </g>
              )}

              {selectedTarget.id === 'tarim' && (
                <g>
                  {/* Dairesel sulama tarlaları */}
                  <circle cx="80" cy="80" r="55" fill="#15803d" stroke="#84cc16" strokeWidth="3" />
                  <circle cx="210" cy="80" r="65" fill="#166534" stroke="#84cc16" strokeWidth="3" />
                  <circle cx="340" cy="80" r="50" fill="#a16207" stroke="#eab308" strokeWidth="3" />
                  <circle cx="140" cy="180" r="45" fill="#15803d" stroke="#84cc16" strokeWidth="3" />
                  <circle cx="280" cy="180" r="50" fill="#16a34a" stroke="#84cc16" strokeWidth="3" />
                </g>
              )}
            </svg>

            {/* Çözünürlük Damgası */}
            <div className="photo-res-badge">
              <Sparkles size={14} />
              <span>
                {resolutionMode === '0.99m'
                  ? 'İMECE Pankromatik: 0.99 m GSD (Tek Bir Otomobil Bile Görünür)'
                  : resolutionMode === '10m'
                  ? '10 m GSD (Yalnızca Büyük Binalar)'
                  : '30 m GSD (Bulanık, Yalnızca Şehir Hatları)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bilimsel Açıklama Kutusu */}
      <div className="concept-callout">
        <Eye size={16} className="text-emerald" />
        <div className="concept-text">
          <p>
            <strong>Yer Örnekleme Mesafesi (GSD):</strong> İMECE uydusunun çektiği fotoğraftaki tek
            bir piksel, yeryüzünde <strong>0,99 metreye (yaklaşık 1 adım)</strong> karşılık gelir.
            Bu sayede yoldaki arabalar, binaların çatıları, tarla sınırları ve doğal afet hasarları
            uzaydan santimetre hassasiyetinde tespit edilebilir!
          </p>
        </div>
      </div>
    </div>
  );
};
