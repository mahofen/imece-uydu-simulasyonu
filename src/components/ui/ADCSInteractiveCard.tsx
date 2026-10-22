import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Compass, RotateCw, Target, Navigation, Info } from 'lucide-react';

export const ADCSInteractiveCard: React.FC = () => {
  const { triggerAttitudeSlew } = useSimulator();

  return (
    <div className="interactive-sub-card adcs-card">
      <div className="card-top-header">
        <div className="card-title-badge">
          <Compass size={18} className="text-purple" />
          <strong>Yönelim ve Duruş Kontrolü (AOKS Deneyi)</strong>
        </div>
      </div>

      <p className="card-instruction-text">
        Aşağıdaki hedef butonlarına basarak İMECE'nin içindeki tepki tekerleklerini çalıştırın ve
        uydunun burnunu Dünya üzerindeki farklı hedeflere yöneltin:
      </p>

      {/* Yönelim Manevra Butonları */}
      <div className="adcs-buttons-grid">
        <button
          onClick={() => triggerAttitudeSlew('TÜRKİYE_ANKARA')}
          className="adcs-target-btn"
        >
          <Target size={16} />
          <span>Türkiye / Ankara'ya Yönel</span>
        </button>

        <button
          onClick={() => triggerAttitudeSlew('VAN_GÖLÜ')}
          className="adcs-target-btn"
        >
          <Target size={16} />
          <span>Van Gölü'ne Yönel</span>
        </button>

        <button
          onClick={() => triggerAttitudeSlew('İSTANBUL_BOĞAZI')}
          className="adcs-target-btn"
        >
          <Target size={16} />
          <span>İstanbul Boğazı'na Yönel</span>
        </button>

        <button
          onClick={() => triggerAttitudeSlew('NADIR')}
          className="adcs-target-btn btn-nadir"
        >
          <Navigation size={16} />
          <span>Tam Nadir (Dünya Merkezine Dön)</span>
        </button>
      </div>

      {/* Ortaokul Fizik Kavramı Karşılaştırması */}
      <div className="concept-callout">
        <Info size={16} className="text-purple" />
        <div className="concept-text">
          <p>
            <strong>Çok Önemli Fark: Yönelim Değişimi vs. Yörünge Hareketi</strong>
          </p>
          <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
            <li>
              <strong>Yönelim (Attitude):</strong> Uydunun yörüngesini değiştirmeden, sadece kendi
              ağırlık merkezi etrafında dönerek kamerasını istediğimiz şehre çevirmesidir (Tepki
              tekerlekleri ile yapılır, yakıt harcamaz).
            </li>
            <li>
              <strong>Yörünge Hareketi (Orbit):</strong> Uydunun Dünya etrafındaki 680 km'lik yolu
              boyunca saniyede 7.5 kilometre hızla ilerlemesidir.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
