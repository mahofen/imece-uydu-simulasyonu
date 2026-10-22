import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Sun, Moon, Zap, BatteryCharging, AlertCircle } from 'lucide-react';

export const SolarInteractiveCard: React.FC = () => {
  const { sunActive, toggleSun, solarPower, batteryPct } = useSimulator();

  return (
    <div className="interactive-sub-card solar-card">
      <div className="card-top-header">
        <div className="card-title-badge">
          <Zap size={18} className="text-amber" />
          <strong>Güneş Enerjisi ve Güç Deneyi</strong>
        </div>
        <button
          onClick={toggleSun}
          className={`sun-toggle-btn ${sunActive ? 'btn-sun-on' : 'btn-sun-off'}`}
        >
          {sunActive ? (
            <>
              <Sun size={16} /> Güneş Işığını Kapat (Geceye Gir)
            </>
          ) : (
            <>
              <Moon size={16} /> Güneş Işığını Aç (Gündüze Çık)
            </>
          )}
        </button>
      </div>

      {/* Dinamik Göstergeler (Güç & Batarya) */}
      <div className="power-gauges-grid">
        <div className="gauge-item">
          <span className="gauge-label">Güneş Paneli Üretimi</span>
          <div className="gauge-value" style={{ color: sunActive ? '#38bdf8' : '#94a3b8' }}>
            {solarPower} W
          </div>
          <div className="gauge-progress-bar">
            <div
              className="gauge-fill solar-fill"
              style={{ width: `${(solarPower / 1200) * 100}%` }}
            />
          </div>
          <small className="gauge-sub">
            {sunActive ? '☀️ Güneş ışığı elektrik enerjisine dönüştürülüyor' : '🌑 Işık kesildi, üretim 0W'}
          </small>
        </div>

        <div className="gauge-item">
          <span className="gauge-label">Batarya Durumu (Li-Ion)</span>
          <div className="gauge-value" style={{ color: sunActive ? '#4ade80' : '#f59e0b' }}>
            %{batteryPct} {sunActive ? '(Şarj Oluyor)' : '(Devrede / Deşarj)'}
          </div>
          <div className="gauge-progress-bar">
            <div
              className="gauge-fill battery-fill"
              style={{
                width: `${batteryPct}%`,
                background: sunActive ? '#10b981' : '#f59e0b'
              }}
            />
          </div>
          <small className="gauge-sub">
            {sunActive ? '🔋 Bataryalar tam dolu bekletiliyor' : '⚠️ Uydu batarya enerjisiyle çalışıyor!'}
          </small>
        </div>
      </div>

      {/* Açıklama Kutusu */}
      <div className="concept-callout">
        <AlertCircle size={16} className="text-cyan" />
        <div className="concept-text">
          {sunActive ? (
            <p>
              <strong>Güneş ışığı elektrik enerjisine dönüştürülür:</strong> Paneller üzerindeki
              üç eklemeli fotovoltaik hücreler, uzaydaki güneş fotonlarını doğrudan elektron
              akışına (elektrik akımına) çevirir ve 1200 Watt güç üretir.
            </p>
          ) : (
            <p>
              <strong>Batarya Enerjisiyle Çalışma (Tutulma Geçişi):</strong> İMECE Dünya'nın
              arkasına geçtiğinde güneş ışığı tamamen kesilir. Bu yaklaşık 35 dakikalık karanlık
              süresince uydunun bilgisayarları ve kameraları gövde içindeki lityum-iyon bataryalarla
              kesintisiz çalışmaya devam eder!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
