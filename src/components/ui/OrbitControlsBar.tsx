import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Play, Pause, FastForward, Info, Globe, Compass, Radio } from 'lucide-react';

export const OrbitControlsBar: React.FC = () => {
  const {
    mode,
    orbitSpeed,
    setOrbitSpeed,
    isOrbitPaused,
    toggleOrbitPause,
    orbitAngle
  } = useSimulator();

  if (mode !== 'ORBIT') return null;

  // Anlık zemin koordinatları yaklaşık hesabı
  const R_orb = 15.5;
  const inc = 98.2 * (Math.PI / 180);
  const satY = R_orb * Math.sin(orbitAngle) * Math.sin(inc);
  const satX = R_orb * Math.cos(orbitAngle);
  const satZ = R_orb * Math.sin(orbitAngle) * Math.cos(inc);

  const lat = Math.asin(satY / R_orb) * (180 / Math.PI);
  const lon = (Math.atan2(satZ, satX) * (180 / Math.PI)) % 360;

  // Ankara yer istasyonu ile görüş mesafesi kontrolü
  const distToAnkara = Math.sqrt(Math.pow(lat - 39.9, 2) + Math.pow(lon - 32.8, 2));
  const isGroundStationContact = distToAnkara < 35;

  return (
    <div className="orbit-controls-overlay">
      {/* 1. Üst Telemetri ve Bilgi Kartları */}
      <div className="orbit-telemetry-strip">
        <div className="telemetry-badge">
          <span className="telemetry-lbl">Yörünge Tipi</span>
          <strong className="telemetry-val text-cyan">Güneş Eşzamanlı (SSO)</strong>
        </div>
        <div className="telemetry-badge">
          <span className="telemetry-lbl">İrtifa (Yükseklik)</span>
          <strong className="telemetry-val">~680 km LEO</strong>
        </div>
        <div className="telemetry-badge">
          <span className="telemetry-lbl">Yörünge Periyodu</span>
          <strong className="telemetry-val">~98.4 Dakika</strong>
        </div>
        <div className="telemetry-badge">
          <span className="telemetry-lbl">Yörüngesel Hız</span>
          <strong className="telemetry-val">7.53 km/s (~27.100 km/h)</strong>
        </div>
        <div className="telemetry-badge">
          <span className="telemetry-lbl">Yer Koordinatı</span>
          <strong className="telemetry-val text-amber">
            {Math.abs(lat).toFixed(1)}° {lat >= 0 ? 'K' : 'G'}, {Math.abs(lon).toFixed(1)}° {lon >= 0 ? 'D' : 'B'}
          </strong>
        </div>
        <div className="telemetry-badge">
          <span className="telemetry-lbl">Ankara İstasyonu</span>
          <strong className={`telemetry-val ${isGroundStationContact ? 'text-emerald' : 'text-slate'}`}>
            {isGroundStationContact ? '📡 İrtibat Kuruldu' : 'Ufuk Altında'}
          </strong>
        </div>
      </div>

      {/* 2. Alt Simülasyon Oynatıcı Kontrolleri ve Açıklama */}
      <div className="orbit-bottom-bar">
        {/* Hızlandırma & Duraklatma */}
        <div className="playback-controls">
          <button
            onClick={toggleOrbitPause}
            className={`play-pause-btn ${isOrbitPaused ? 'is-paused' : ''}`}
            title={isOrbitPaused ? 'Simülasyonu Devam Ettir' : 'Simülasyonu Duraklat'}
          >
            {isOrbitPaused ? <Play size={18} /> : <Pause size={18} />}
            <span>{isOrbitPaused ? 'Oynat' : 'Duraklat'}</span>
          </button>

          <div className="speed-chips-group">
            <span className="speed-title">Zaman Hızı:</span>
            {[1, 5, 10, 25, 50].map((spd) => (
              <button
                key={spd}
                onClick={() => setOrbitSpeed(spd)}
                className={`speed-chip ${orbitSpeed === spd ? 'active' : ''}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Güneş Eşzamanlı Yörünge (SSO) Rehberi */}
        <div className="sso-explanation-box">
          <div className="sso-header">
            <Globe size={16} className="text-cyan" />
            <strong>Güneş Eşzamanlı Yörünge (SSO) Nedir?</strong>
          </div>
          <p>
            İMECE kutuplara yakın (98.2° eğimli) uçar. Dünya dönerken uydu her gün aynı bölgenin
            üzerinden <strong>hep aynı yerel güneş saatinde (yaklaşık saat 10:30)</strong> geçer. Bu sayede
            çekilen fotoğraflardaki gölgeler hep aynı boyda kalır ve arazideki değişimler kolayca
            fark edilir!
          </p>
        </div>
      </div>

      {/* 3. İrtifa Cetveli (Kaç km yüksekte olduğunu gösteren dikey cetvel) */}
      <div className="altitude-scale-ruler">
        <div className="ruler-title">İrtifa Cetveli</div>
        <div className="ruler-track">
          <div className="ruler-point marker-geo">
            <span className="dot" />
            <div className="label">
              <strong>35.786 km</strong>
              <small>GEO (Türksat Haberleşme)</small>
            </div>
          </div>
          <div className="ruler-point marker-leo">
            <span className="dot" />
            <div className="label">
              <strong>2.000 km</strong>
              <small>LEO Üst Sınırı</small>
            </div>
          </div>
          <div className="ruler-point marker-imece active-orbit-dot">
            <span className="dot pulse" />
            <div className="label">
              <strong className="text-cyan">680 km</strong>
              <span className="badge-active">İMECE (Gözlem Uydusu)</span>
            </div>
          </div>
          <div className="ruler-point marker-iss">
            <span className="dot" />
            <div className="label">
              <strong>408 km</strong>
              <small>ISS Uzay İstasyonu</small>
            </div>
          </div>
          <div className="ruler-point marker-karman">
            <span className="dot" />
            <div className="label">
              <strong>100 km</strong>
              <small>Kármán Hattı (Uzay Sınırı)</small>
            </div>
          </div>
          <div className="ruler-point marker-earth">
            <span className="dot" />
            <div className="label">
              <strong>0 km</strong>
              <small>Yeryüzü</small>
            </div>
          </div>
        </div>
      </div>

      {/* Yasal & Bilimsel Uyarı */}
      <div className="orbit-disclaimer-toast">
        <Info size={14} />
        <span>
          Bu simülasyon eğitim amaçlı yaklaşık bir modeldir; anlık gerçek zamanlı uydu takip verisi
          değildir.
        </span>
      </div>
    </div>
  );
};
