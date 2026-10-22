import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { SUBSYSTEMS_DATA } from '../../utils/subsystemsData';
import { SolarInteractiveCard } from './SolarInteractiveCard';
import { CameraInteractiveModal } from './CameraInteractiveModal';
import { CommsInteractiveModal } from './CommsInteractiveModal';
import { ADCSInteractiveCard } from './ADCSInteractiveCard';
import { X, Sparkles, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

export const SubsystemDetailPanel: React.FC = () => {
  const {
    selectedSubsystem,
    setSelectedSubsystem,
    cutawayActive,
    toggleCutaway
  } = useSimulator();

  if (!selectedSubsystem) return null;

  const data = SUBSYSTEMS_DATA[selectedSubsystem];
  if (!data) return null;

  return (
    <aside className="subsystem-drawer-panel" role="dialog" aria-label="Alt Sistem Detayı">
      <div className="drawer-inner-scroll">
        {/* Başlık ve Kapatma */}
        <div className="drawer-header">
          <div>
            <span className="drawer-category-tag" style={{ color: data.color }}>
              {data.category}
            </span>
            <h2 className="drawer-title">{data.title}</h2>
          </div>
          <button
            onClick={() => setSelectedSubsystem(null)}
            className="drawer-close-btn"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Öğrenciler İçin Kolay Anlatım */}
        <div className="drawer-kids-box">
          <div className="kids-box-badge">
            <Sparkles size={16} /> <strong>Ortaokul Fen Rehberi</strong>
          </div>
          <p>{data.kidsExplanation}</p>
        </div>

        {/* Alt Sisteme Özel Etkileşimli Deney Modülü */}
        {selectedSubsystem === 'SOLAR_ARRAYS' && <SolarInteractiveCard />}
        {selectedSubsystem === 'ELECTRO_OPTICAL_CAMERA' && <CameraInteractiveModal />}
        {selectedSubsystem === 'COMMUNICATION_SYSTEM' && <CommsInteractiveModal />}
        {selectedSubsystem === 'ADCS_SYSTEM' && <ADCSInteractiveCard />}

        {selectedSubsystem === 'BUS_SYSTEM' && (
          <div className="interactive-sub-card bus-card">
            <div className="card-top-header">
              <div className="card-title-badge">
                <Cpu size={18} className="text-amber" />
                <strong>Gövde Kesit ve İç Aviyonik Sistemler</strong>
              </div>
              <button
                onClick={toggleCutaway}
                className="cutaway-toggle-btn"
              >
                {cutawayActive ? 'Dış Zırhı Göster' : 'İç Kesiti Göster (Yarı Saydam)'}
              </button>
            </div>
            <p className="card-instruction-text">
              İMECE'nin altın çok katmanlı yalıtım battaniyesinin altında yer alan elektronik
              beyinleri, bataryaları ve veri hafızasını inceleyebilirsiniz:
            </p>
            <div className="internal-parts-list">
              <div className="internal-part-card">
                <strong>🧠 Uçuş Bilgisayarı (OBC):</strong> Uydunun beyni olup yer komutlarını işler.
              </div>
              <div className="internal-part-card">
                <strong>🔋 Li-Ion Batarya Paketi:</strong> Dünya'nın gölgesinde elektriği sağlar.
              </div>
              <div className="internal-part-card">
                <strong>⚡ Güç Dağıtım Ünitesi (PDU):</strong> Sistemlere gereken voltajı düzenler.
              </div>
              <div className="internal-part-card">
                <strong>💾 Katı Hal Kayıt Birimi (SSMM):</strong> Metre-altı fotoğrafları depolar.
              </div>
              <div className="internal-part-card">
                <strong>🔄 Tepki Tekerlekleri:</strong> Açısal momentumla uydunun yönünü çevirir.
              </div>
            </div>
            <div className="disclaimer-alert-box">
              <ShieldCheck size={16} />
              <span>
                <strong>Önemli Bilimsel Not:</strong> İç sistemlerin yerleşimi ve şekli öğrencilerin
                temel çalışma prensibini anlaması amacıyla hazırlanmış basitleştirilmiş temsili bir
                modeldir.
              </span>
            </div>
          </div>
        )}

        {/* Bilimsel Konsept ve Detaylı Açıklama */}
        <div className="drawer-section">
          <h3 className="section-title">
            <BookOpen size={16} /> Bilimsel Çalışma İlkesi
          </h3>
          <p className="scientific-concept-text">{data.scientificConcept}</p>
          <p className="full-desc-text">{data.fullDesc}</p>
        </div>

        {/* Teknik Nitelikler */}
        <div className="drawer-section">
          <h3 className="section-title">Teknik Nitelikler &amp; Özellikler</h3>
          <ul className="specs-items-list">
            {data.specs.map((spec, sIdx) => (
              <li key={sIdx}>{spec}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
