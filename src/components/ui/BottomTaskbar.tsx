import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { ORBIT_PRESETS } from '../../utils/orbitPresetsData';
import { OrbitPresetId } from '../../types/simulation';
import {
  Play,
  Pause,
  Plus,
  Minus,
  RotateCcw,
  Zap,
  Radio,
  Layers,
  StopCircle
} from 'lucide-react';

export const BottomTaskbar: React.FC = () => {
  const {
    mode,
    orbitSpeed,
    setOrbitSpeed,
    isOrbitPaused,
    toggleOrbitPause,
    orbitAngle,
    solarPower,
    batteryPct,
    sunActive,
    zoomIn,
    zoomOut,
    resetView,
    orbitPreset,
    setOrbitPreset,
    isCinematicTour,
    stopCinematicTour,
    tourStep
  } = useSimulator();

  const currentPreset = ORBIT_PRESETS[orbitPreset] || ORBIT_PRESETS.IMECE_SSO;

  // Yörünge modunda anlık yaklaşık telemetri ve yer istasyonu görünürlüğü
  const R_orb = currentPreset.radiusUnits;
  const inc = currentPreset.inclinationDeg * (Math.PI / 180);
  const satY = R_orb * Math.sin(orbitAngle) * Math.sin(inc);
  const satX = R_orb * Math.cos(orbitAngle);
  const satZ = R_orb * Math.sin(orbitAngle) * Math.cos(inc);

  const lat = Math.asin(satY / R_orb) * (180 / Math.PI);
  const lon = (Math.atan2(satZ, satX) * (180 / Math.PI)) % 360;

  const distToAnkara = Math.sqrt(Math.pow(lat - 39.9, 2) + Math.pow(lon - 32.8, 2));
  const isGroundStationContact = distToAnkara < 32;

  // Sinematik Tur Anlatım Metinleri
  const tourCaptions = [
    {
      title: 'İMECE — Uzaydaki Millî Gözümüz',
      sub: 'TÜBİTAK UZAY tarafından tasarlanan ve üretilen ilk yerli ve millî metre-altı yer gözlem uydumuz.'
    },
    {
      title: 'GaAs Güneş Panelleri & Güç Sistemi',
      sub: 'Üç eklemli yüksek verimli galyum arsenit hücreler uydunun tüm aviyonik ve kamera sistemlerini besler.'
    },
    {
      title: 'Metre-Altı Elektro-Optik Kamera Sistemi',
      sub: 'TÜBİTAK UZAY tasarımı Korsch optik konfigürasyonu ile 0,99 metreden daha yüksek keskinlikte görüntüleme.'
    },
    {
      title: 'Yerli Elektrikli İtki Motoru (Hall İticisi)',
      sub: 'Ksenon gazı iyonlarını hızlandırarak uydunun 680 km irtifasını yıllarca hassasiyetle korur.'
    },
    {
      title: 'İç Aviyonik & Millî Uçuş Bilgisayarı (BİLGE)',
      sub: 'Radyasyona dayanıklı bileşenler, katı hâl görüntü hafızası ve 3 eksenli tepki tekerlekleri.'
    }
  ];

  return (
    <footer className="hud-bottom-taskbar">
      {/* 1. Sol Kısım: Mod Bilgisi, Oynatma Kontrolleri veya İrtifa Seçicisi */}
      <div className="taskbar-left-cluster">
        {mode === 'ORBIT' ? (
          <div className="orbit-playback-cluster">
            <button
              onClick={toggleOrbitPause}
              className={`taskbar-play-btn ${isOrbitPaused ? 'is-paused' : ''}`}
              title={isOrbitPaused ? 'Simülasyonu Devam Ettir' : 'Simülasyonu Duraklat'}
            >
              {isOrbitPaused ? <Play size={15} /> : <Pause size={15} />}
              <span>{isOrbitPaused ? 'Oynat' : 'Duraklat'}</span>
            </button>

            <div className="speed-pills-row">
              <span className="speed-label">Hız:</span>
              {[1, 5, 10, 25, 50].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setOrbitSpeed(spd)}
                  className={`taskbar-speed-pill ${orbitSpeed === spd ? 'active' : ''}`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Kepler Yörünge İrtifa Karşılaştırma Hapları */}
            <div className="orbit-preset-pills-row">
              <span className="speed-label">İrtifa:</span>
              {(['LEO_ISS', 'IMECE_SSO', 'MEO_GPS', 'GEO_TURKSAT'] as OrbitPresetId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setOrbitPreset(id)}
                  className={`taskbar-orbit-pill ${orbitPreset === id ? 'active' : ''}`}
                  title={ORBIT_PRESETS[id].description}
                >
                  {id === 'LEO_ISS' && 'LEO 400km'}
                  {id === 'IMECE_SSO' && 'İMECE 680km'}
                  {id === 'MEO_GPS' && 'MEO 20.200km'}
                  {id === 'GEO_TURKSAT' && 'GEO 35.786km'}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="satellite-status-cluster">
            <div className="status-pill status-power">
              <Zap size={14} className={sunActive ? 'text-amber' : 'text-slate'} />
              <span>Güç: <strong>{solarPower} W</strong></span>
              <span className="dot-sep">•</span>
              <span>Batarya: <strong>%{batteryPct}</strong></span>
            </div>
            <div className="status-pill status-mission">
              <Radio size={14} className="text-cyan" />
              <span>İMECE: <strong>680 km SSO Yer Gözlem Uydusu</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Orta Kısım: Telemetri Verileri veya Sinematik Tur Alt Yazısı */}
      <div className="taskbar-center-cluster">
        {isCinematicTour ? (
          <div className="cinematic-tour-caption-bar">
            <span className="tour-badge">SİNEMATİK TUR ({tourStep + 1}/5)</span>
            <strong className="tour-title">{tourCaptions[tourStep]?.title}</strong>
            <span className="tour-sub">{tourCaptions[tourStep]?.sub}</span>
            <button onClick={stopCinematicTour} className="tour-stop-btn">
              <StopCircle size={14} /> Turu Bitir
            </button>
          </div>
        ) : mode === 'ORBIT' ? (
          <div className="telemetry-compact-row">
            <span className="telem-item">
              İrtifa: <strong className="text-cyan">{currentPreset.altitudeKm.toLocaleString('tr-TR')} km</strong>
            </span>
            <span className="dot-sep">•</span>
            <span className="telem-item">
              Hız: <strong>{(currentPreset.velocityKmh / 3600).toFixed(2)} km/s</strong> ({currentPreset.velocityKmh.toLocaleString('tr-TR')} km/h)
            </span>
            <span className="dot-sep">•</span>
            <span className="telem-item">
              Periyot: <strong>{currentPreset.periodMinutes >= 60 ? `${(currentPreset.periodMinutes / 60).toFixed(1)} saat` : `${currentPreset.periodMinutes} dk`}</strong>
            </span>
            <span className="dot-sep">•</span>
            <span className="telem-item">
              Ankara Yer İstasyonu:{' '}
              <strong className={isGroundStationContact ? 'text-emerald' : 'text-slate'}>
                {isGroundStationContact ? '📡 İrtibat Aktif (AOS)' : 'Ufuk Altı (LOS)'}
              </strong>
            </span>
          </div>
        ) : (
          <div className="hint-compact-row">
            <span>🖱️ <strong>360° Çevir:</strong> Sol Tık / Sürükle</span>
            <span className="dot-sep">•</span>
            <span>🔍 <strong>Yakınlaş:</strong> Fare Tekerleği veya Zoom Düğmeleri</span>
          </div>
        )}
      </div>

      {/* 3. Sağ Kısım: Yakınlaştırma ve Uzaklaştırma (Zoom) Görev Araçları */}
      <div className="taskbar-right-cluster">
        <div className="zoom-controls-group" aria-label="Yakınlaştırma Kontrolleri">
          <button
            onClick={zoomIn}
            className="zoom-btn"
            title="Kamerayı Yakınlaştır (+)"
          >
            <Plus size={16} />
            <span className="zoom-btn-label">Yakınlaş</span>
          </button>

          <button
            onClick={zoomOut}
            className="zoom-btn"
            title="Kamerayı Uzaklaştır (-)"
          >
            <Minus size={16} />
            <span className="zoom-btn-label">Uzaklaş</span>
          </button>

          <button
            onClick={resetView}
            className="zoom-btn zoom-reset-btn"
            title="Görünümü Sıfırla ve Merkeze Odakla"
          >
            <RotateCcw size={15} />
            <span className="zoom-btn-label">Odakla</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
