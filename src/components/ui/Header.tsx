import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Box,
  Layers,
  Sparkles,
  Globe2,
  Trophy,
  Thermometer,
  Film,
  BookOpen,
  Eye
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    cutawayActive,
    toggleCutaway,
    soundEnabled,
    toggleSound,
    graphicsQuality,
    setGraphicsQuality,
    resetView,
    isThermalMode,
    toggleThermalMode,
    isCinematicTour,
    startCinematicTour,
    stopCinematicTour,
    glossaryOpen,
    toggleGlossary,
    sensorFovVisible,
    toggleSensorFov
  } = useSimulator();

  return (
    <header className="hud-header">
      {/* 1. Başlık ve Misyon Logosu */}
      <div className="header-brand-section">
        <div className="brand-logo-row">
          {/* Mini Türk Bayrağı SVG */}
          <div className="flag-icon-box" title="Türkiye Cumhuriyeti">
            <svg viewBox="0 0 1200 800" className="mini-turkey-flag">
              <rect width="1200" height="800" fill="#E30A17" />
              <circle cx="425" cy="400" r="200" fill="#FFFFFF" />
              <circle cx="475" cy="400" r="160" fill="#E30A17" />
              <polygon
                points="583.33,400 660,424.9 612.6,359.5 612.6,440.5 660,375.1"
                fill="#FFFFFF"
              />
            </svg>
          </div>

          <div>
            <div className="title-badges-row">
              <h1 className="header-title">İMECE</h1>
              <span className="badge-tag tag-tubitak">TÜBİTAK UZAY</span>
              <span className="badge-tag tag-orbit">680 KM SSO</span>
              <span className="badge-tag tag-res">GSD &lt; 0.99M</span>
            </div>
            <p className="header-subtitle">
              Uzaydaki Gözümüz: Etkileşimli Uydu Keşif Laboratuvarı
            </p>
          </div>
        </div>
      </div>

      {/* 2. Ana Mod Navigasyon Butonları */}
      <nav className="mode-nav-tabs" aria-label="Ana Bölümler">
        <button
          className={`mode-tab-btn ${mode === 'EXPLORATION' ? 'active' : ''}`}
          onClick={() => setMode('EXPLORATION')}
          title="Uydunun 3D modelini ve tüm alt sistemlerini yakından incele"
        >
          <Layers size={18} />
          <span>Uyduyu Keşfet</span>
        </button>

        <button
          className={`mode-tab-btn ${mode === 'ORBIT' ? 'active' : ''}`}
          onClick={() => setMode('ORBIT')}
          title="İMECE'nin Dünya etrafındaki 680 km Güneş Eşzamanlı Yörüngesini gözlemle"
        >
          <Globe2 size={18} />
          <span>Yörüngeyi Keşfet</span>
        </button>

        <button
          className={`mode-tab-btn ${mode === 'ACTIVITIES' ? 'active' : ''}`}
          onClick={() => setMode('ACTIVITIES')}
          title="Eğlenceli görevler, parça bulma ve görev eşleştirme etkinlikleri"
        >
          <Trophy size={18} />
          <span>Öğrenme Etkinlikleri</span>
        </button>
      </nav>

      {/* 3. Hızlı Araçlar ve Ayarlar */}
      <div className="header-quick-tools">
        {/* Yörünge Modunda Görüş Konisi (Swath FOV) Aç/Kapat */}
        {mode === 'ORBIT' && (
          <button
            className={`quick-icon-btn ${sensorFovVisible ? 'active' : ''}`}
            onClick={toggleSensorFov}
            title={sensorFovVisible ? 'Kamera Tarama Konisini Gizle' : 'Kamera Tarama Konisini ve Ayak İzini Göster'}
          >
            <Eye size={16} />
            <span className="btn-text">Görüş Konisi</span>
          </button>
        )}

        {/* Termal FLIR Analiz Görünümü */}
        <button
          className={`quick-icon-btn ${isThermalMode ? 'active' : ''}`}
          onClick={toggleThermalMode}
          title={isThermalMode ? 'Gerçekçi Görünüme Dön' : 'Termal Analiz Modu (+120°C / -80°C Isı Dağılım Haritası)'}
        >
          <Thermometer size={16} />
          <span className="btn-text">Termal FLIR</span>
        </button>

        {/* Sinematik Otomatik Tur (Kiosk / Sergi Modu) */}
        <button
          className={`quick-icon-btn ${isCinematicTour ? 'active' : ''}`}
          onClick={isCinematicTour ? stopCinematicTour : startCinematicTour}
          title={isCinematicTour ? 'Sinematik Turu Durdur' : 'Sinematik Otomatik Turu Başlat (TÜBİTAK & Akıllı Tahta Vitrini)'}
        >
          <Film size={16} />
          <span className="btn-text">{isCinematicTour ? 'Turu Bitir' : 'Sinematik Tur'}</span>
        </button>

        {/* Terimler Sözlüğü */}
        <button
          className={`quick-icon-btn ${glossaryOpen ? 'active' : ''}`}
          onClick={toggleGlossary}
          title="Uzay ve Uydu Terimleri Sözlüğü"
        >
          <BookOpen size={16} />
          <span className="btn-text">Sözlük</span>
        </button>

        {/* Gövde Kesit / Yarı Saydamlık */}
        <button
          className={`quick-icon-btn ${cutawayActive ? 'active' : ''}`}
          onClick={toggleCutaway}
          title="Uydu gövdesini yarı saydam yaparak iç sistemleri (uçuş bilgisayarı, batarya, hafıza) göster"
        >
          <Box size={16} />
          <span className="btn-text">İç Kesit</span>
        </button>

        {/* Görünümü Sıfırla */}
        <button
          className="quick-icon-btn"
          onClick={resetView}
          title="Kamerayı sıfırla ve merkez kadraja dön"
        >
          <RotateCcw size={16} />
          <span className="btn-text">Sıfırla</span>
        </button>

        {/* Ses Aç/Kapat */}
        <button
          className={`quick-icon-btn ${soundEnabled ? 'active' : ''}`}
          onClick={toggleSound}
          title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Grafik Kalitesi */}
        <button
          className="quick-icon-btn"
          onClick={() => {
            const next = graphicsQuality === 'high' ? 'low' : 'high';
            setGraphicsQuality(next);
          }}
          title={`Grafik Kalitesi: ${graphicsQuality === 'high' ? 'Yüksek' : 'Düşük (Tasarruf)'}`}
        >
          <Sparkles size={16} />
          <span className="btn-text">{graphicsQuality === 'high' ? 'HD' : 'Performans'}</span>
        </button>
      </div>
    </header>
  );
};
