import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { SUBSYSTEMS_DATA } from '../../utils/subsystemsData';
import { ORBIT_PRESETS, GLOSSARY_TERMS } from '../../utils/orbitPresetsData';
import { OrbitPresetId } from '../../types/simulation';
import { SolarInteractiveCard } from './SolarInteractiveCard';
import { CameraInteractiveModal } from './CameraInteractiveModal';
import { CommsInteractiveModal } from './CommsInteractiveModal';
import { ADCSInteractiveCard } from './ADCSInteractiveCard';
import { PartFinderActivity } from './activities/PartFinderActivity';
import { MissionMatchingActivity } from './activities/MissionMatchingActivity';
import { MissionSimulatorActivity } from './activities/MissionSimulatorActivity';
import {
  X,
  Sparkles,
  BookOpen,
  Cpu,
  ShieldCheck,
  Globe,
  ChevronRight,
  ChevronLeft,
  Target,
  Layers,
  Rocket,
  Compass,
  Thermometer,
  Zap
} from 'lucide-react';

export const RightDockPanel: React.FC = () => {
  const {
    mode,
    selectedSubsystem,
    setSelectedSubsystem,
    cutawayActive,
    toggleCutaway,
    activeActivity,
    setActiveActivity,
    orbitPreset,
    setOrbitPreset,
    glossaryOpen,
    setGlossaryOpen,
    isThermalMode
  } = useSimulator();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [glossaryCategory, setGlossaryCategory] = useState<string>('Hepsi');

  // Panel ne zaman görünmeli?
  // 1) Alt sistem seçildiğinde
  // 2) Terimler sözlüğü açıkken
  // 3) Etkinlikler modundayken
  // 4) Yörünge modundayken irtifa cetveli ve Kepler laboratuvarı için
  const shouldRender =
    selectedSubsystem !== null ||
    glossaryOpen ||
    mode === 'ACTIVITIES' ||
    mode === 'ORBIT';

  if (!shouldRender) return null;

  const currentSubsystemData = selectedSubsystem ? SUBSYSTEMS_DATA[selectedSubsystem] : null;
  const currentPresetData = ORBIT_PRESETS[orbitPreset] || ORBIT_PRESETS.IMECE_SSO;

  const filteredGlossary = glossaryCategory === 'Hepsi'
    ? GLOSSARY_TERMS
    : GLOSSARY_TERMS.filter(item => item.category === glossaryCategory);

  return (
    <aside
      className={`hud-right-dock ${isCollapsed ? 'is-collapsed' : ''}`}
      role="region"
      aria-label="Sağ Görev Paneli"
    >
      {/* Paneli Daralt / Genişlet Küçük Tutamacı */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="dock-toggle-handle"
        title={isCollapsed ? 'Görev Panelini Aç' : 'Görev Panelini Gizle (Tam Ekran)'}
      >
        {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {!isCollapsed && (
        <div className="dock-content-scroller">
          {/* Termal FLIR Bilgi Bandı */}
          {isThermalMode && (
            <div className="thermal-legend-badge">
              <div className="thermal-legend-title">
                <Thermometer size={14} className="text-amber" />
                <span>FLIR Termal Dağılım Ölçeği</span>
              </div>
              <div className="thermal-gradient-bar" />
              <div className="thermal-labels-row">
                <span className="label-cold">-80°C (Gölge)</span>
                <span className="label-mid">0°C</span>
                <span className="label-hot">+120°C (Güneş)</span>
              </div>
            </div>
          )}

          {/* ========================================================
              DURUM SÖZLÜK: UZAY VE UYDU TERİMLERİ SÖZLÜĞÜ AÇIKSA
              ======================================================== */}
          {glossaryOpen ? (
            <div className="dock-glossary-view">
              <div className="dock-header">
                <div>
                  <span className="dock-category-tag text-emerald">Rehber & Ansiklopedi</span>
                  <h3 className="dock-title">Uzay Terimleri Sözlüğü</h3>
                </div>
                <button
                  onClick={() => setGlossaryOpen(false)}
                  className="dock-close-btn"
                  title="Sözlüğü Kapat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Kategori Filtresi */}
              <div className="glossary-category-pills">
                {['Hepsi', 'Yörünge', 'Optik', 'Aviyonik', 'Güç', 'Haberleşme'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGlossaryCategory(cat)}
                    className={`glossary-pill ${glossaryCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Terim Kartları Listesi */}
              <div className="glossary-terms-list">
                {filteredGlossary.map((item, idx) => (
                  <div key={idx} className="glossary-term-card">
                    <div className="term-card-header">
                      <strong className="term-name">{item.term}</strong>
                      <span className="term-badge">{item.category}</span>
                    </div>
                    {item.pronunciation && (
                      <div className="term-pronounce">{item.pronunciation}</div>
                    )}
                    <p className="term-definition">{item.definition}</p>
                    <div className="term-kid-analogy">
                      <Sparkles size={13} className="text-amber" />
                      <span><strong>Kolay Anlatım:</strong> {item.kidsAnalog}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedSubsystem && currentSubsystemData ? (
            /* ========================================================
               DURUM A: BİR ALT SİSTEM SEÇİLDİYSE (UYDU KEŞFİ DETAYI)
               ======================================================== */
            <div className="dock-subsystem-view">
              <div className="dock-header">
                <div>
                  <span
                    className="dock-category-tag"
                    style={{ color: currentSubsystemData.color }}
                  >
                    {currentSubsystemData.category}
                  </span>
                  <h3 className="dock-title">{currentSubsystemData.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedSubsystem(null)}
                  className="dock-close-btn"
                  title="Detayı Kapat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Ortaokul Fen Rehberi Kolay Anlatım */}
              <div className="dock-kids-card">
                <div className="kids-card-badge">
                  <Sparkles size={14} /> <strong>Ortaokul Fen Rehberi</strong>
                </div>
                <p>{currentSubsystemData.kidsExplanation}</p>
              </div>

              {/* Alt Sisteme Özel İnteraktif Deney Modülü */}
              {selectedSubsystem === 'SOLAR_ARRAYS' && <SolarInteractiveCard />}
              {selectedSubsystem === 'ELECTRO_OPTICAL_CAMERA' && <CameraInteractiveModal />}
              {selectedSubsystem === 'COMMUNICATION_SYSTEM' && <CommsInteractiveModal />}
              {selectedSubsystem === 'ADCS_SYSTEM' && <ADCSInteractiveCard />}

              {selectedSubsystem === 'BUS_SYSTEM' && (
                <div className="interactive-sub-card bus-card">
                  <div className="card-top-header">
                    <div className="card-title-badge">
                      <Cpu size={16} className="text-amber" />
                      <strong>İç Aviyonik Sistemleri</strong>
                    </div>
                    <button onClick={toggleCutaway} className="cutaway-toggle-btn">
                      {cutawayActive ? 'Dış Zırhı Göster' : 'İç Kesiti Göster'}
                    </button>
                  </div>
                  <div className="internal-parts-list">
                    <div className="internal-part-card">
                      <strong>🧠 Uçuş Bilgisayarı (OBC):</strong> Uydunun beynidir.
                    </div>
                    <div className="internal-part-card">
                      <strong>🔋 Li-Ion Batarya:</strong> Gece geçişinde enerjiyi sağlar.
                    </div>
                    <div className="internal-part-card">
                      <strong>⚡ Güç Ünitesi (PDU):</strong> 28V voltaj dağıtır.
                    </div>
                    <div className="internal-part-card">
                      <strong>💾 Katı Hal Hafıza:</strong> Fotoğrafları depolar.
                    </div>
                    <div className="internal-part-card">
                      <strong>🔄 Tepki Tekerleği:</strong> Uydunun yönünü çevirir.
                    </div>
                  </div>
                  <div className="disclaimer-alert-box">
                    <ShieldCheck size={14} />
                    <span>⚠️ Temsili kesit modelidir (öğrenme amaçlı basitleştirilmiştir).</span>
                  </div>
                </div>
              )}

              {/* Bilimsel Çalışma İlkesi */}
              <div className="dock-section">
                <h4 className="section-title">
                  <BookOpen size={14} /> Bilimsel Çalışma İlkesi
                </h4>
                <p className="scientific-concept-text">{currentSubsystemData.scientificConcept}</p>
                <p className="full-desc-text">{currentSubsystemData.fullDesc}</p>
              </div>

              {/* Teknik Nitelikler */}
              <div className="dock-section">
                <h4 className="section-title">Teknik Nitelikler</h4>
                <ul className="specs-items-list">
                  {currentSubsystemData.specs.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : mode === 'ACTIVITIES' ? (
            /* ========================================================
               DURUM B: ÖĞRENME ETKİNLİKLERİ MODUNDAYSA
               ======================================================== */
            <div className="dock-activities-view">
              <div className="dock-header">
                <div>
                  <span className="dock-category-tag text-purple">İnteraktif STEM Modülü</span>
                  <h3 className="dock-title">Öğrenme Etkinlikleri</h3>
                </div>
              </div>

              {/* Etkinlik Sekmeleri */}
              <div className="dock-activity-tabs">
                <button
                  onClick={() => setActiveActivity('FIND_PART')}
                  className={`dock-tab-pill ${activeActivity === 'FIND_PART' ? 'active' : ''}`}
                >
                  <Target size={14} />
                  <span>1. Parçayı Bul</span>
                </button>
                <button
                  onClick={() => setActiveActivity('MISSION_MATCH')}
                  className={`dock-tab-pill ${activeActivity === 'MISSION_MATCH' ? 'active' : ''}`}
                >
                  <Layers size={14} />
                  <span>2. Görev Eşleştir</span>
                </button>
                <button
                  onClick={() => setActiveActivity('COMPLETE_MISSION')}
                  className={`dock-tab-pill ${activeActivity === 'COMPLETE_MISSION' ? 'active' : ''}`}
                >
                  <Rocket size={14} />
                  <span>3. Görevi Bitir</span>
                </button>
              </div>

              {/* Seçilen Etkinlik İçeriği */}
              <div className="dock-active-activity">
                {activeActivity === 'FIND_PART' && <PartFinderActivity />}
                {activeActivity === 'MISSION_MATCH' && <MissionMatchingActivity />}
                {activeActivity === 'COMPLETE_MISSION' && <MissionSimulatorActivity />}
              </div>
            </div>
          ) : mode === 'ORBIT' ? (
            /* ========================================================
               DURUM C: YÖRÜNGE MODUNDAYSA (KEPLER VE İRTİFA LABORATUVARI)
               ======================================================== */
            <div className="dock-orbit-view">
              <div className="dock-header">
                <div>
                  <span className="dock-category-tag text-cyan">Astrodinamik & Kepler Laboratuvarı</span>
                  <h3 className="dock-title">{currentPresetData.name}</h3>
                </div>
              </div>

              {/* 4 Ana Yörünge Kuşağı Seçicisi */}
              <div className="orbit-preset-selector-box">
                <div className="selector-label">Yörünge Kuşağını Değiştir:</div>
                <div className="preset-buttons-grid">
                  {(['LEO_ISS', 'IMECE_SSO', 'MEO_GPS', 'GEO_TURKSAT'] as OrbitPresetId[]).map((id) => (
                    <button
                      key={id}
                      onClick={() => setOrbitPreset(id)}
                      className={`orbit-select-btn ${orbitPreset === id ? 'active' : ''}`}
                    >
                      <strong>{id === 'LEO_ISS' ? 'LEO' : id === 'IMECE_SSO' ? 'SSO' : id === 'MEO_GPS' ? 'MEO' : 'GEO'}</strong>
                      <small>{ORBIT_PRESETS[id].altitudeKm.toLocaleString('tr-TR')} km</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seçilen Yörünge Özeti */}
              <div className="sso-explanation-box">
                <div className="sso-header">
                  <Globe size={15} className="text-cyan" />
                  <strong>{currentPresetData.subtitle}</strong>
                </div>
                <p>{currentPresetData.description}</p>
              </div>

              {/* Kepler Kanunu ve Fen Eğitimi Kutusu */}
              <div className="kepler-physics-box">
                <div className="kepler-header">
                  <Compass size={15} className="text-purple" />
                  <strong>Kepler Kanunu: İrtifa vs. Hız</strong>
                </div>
                <p className="kepler-explanation">{currentPresetData.keplerNote}</p>
                <div className="kepler-formula-badge">
                  <span>Dairesel Hız: <strong>v = √(G·M / r)</strong></span>
                  <span className="dot-sep">•</span>
                  <span>Periyot: <strong>T = 2π√(r³ / G·M)</strong></span>
                </div>
              </div>

              {/* Dinamik İrtifa Cetveli */}
              <div className="altitude-scale-ruler">
                <div className="ruler-title">Uzay ve İrtifa Karşılaştırması</div>
                <div className="ruler-track">
                  <div className={`ruler-point marker-geo ${orbitPreset === 'GEO_TURKSAT' ? 'active-orbit-dot' : ''}`}>
                    <span className={`dot ${orbitPreset === 'GEO_TURKSAT' ? 'pulse' : ''}`} />
                    <div className="label">
                      <strong className={orbitPreset === 'GEO_TURKSAT' ? 'text-cyan' : ''}>35.786 km</strong>
                      <small>GEO (Türksat 6A - 24 saat)</small>
                    </div>
                  </div>
                  <div className={`ruler-point marker-meo ${orbitPreset === 'MEO_GPS' ? 'active-orbit-dot' : ''}`}>
                    <span className={`dot ${orbitPreset === 'MEO_GPS' ? 'pulse' : ''}`} />
                    <div className="label">
                      <strong className={orbitPreset === 'MEO_GPS' ? 'text-cyan' : ''}>20.200 km</strong>
                      <small>MEO (GPS - 12 saat)</small>
                    </div>
                  </div>
                  <div className={`ruler-point marker-imece ${orbitPreset === 'IMECE_SSO' ? 'active-orbit-dot' : ''}`}>
                    <span className={`dot ${orbitPreset === 'IMECE_SSO' ? 'pulse' : ''}`} />
                    <div className="label">
                      <strong className={orbitPreset === 'IMECE_SSO' ? 'text-cyan' : ''}>680 km</strong>
                      <span className="badge-active">İMECE (98.4 dk)</span>
                    </div>
                  </div>
                  <div className={`ruler-point marker-iss ${orbitPreset === 'LEO_ISS' ? 'active-orbit-dot' : ''}`}>
                    <span className={`dot ${orbitPreset === 'LEO_ISS' ? 'pulse' : ''}`} />
                    <div className="label">
                      <strong className={orbitPreset === 'LEO_ISS' ? 'text-cyan' : ''}>400 km</strong>
                      <small>ISS / Alçak Yörünge (92 dk)</small>
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

              {/* Eğitim Uyarısı */}
              <div className="orbit-disclaimer-toast" style={{ marginTop: '10px' }}>
                <span>
                  ℹ️ Kepler yasalarına göre modellenmiştir; uzay gözlemleri için interaktif yaklaşık modeldir.
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </aside>
  );
};
