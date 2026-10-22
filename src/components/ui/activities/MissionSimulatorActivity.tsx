import React, { useState } from 'react';
import { SATELLITE_MISSION_STEPS } from '../../../utils/subsystemsData';
import { useSimulator } from '../../../context/SimulatorContext';
import { soundFX } from '../../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Rocket,
  Sun,
  Compass,
  Camera,
  Radio,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const MissionSimulatorActivity: React.FC = () => {
  const {
    setSelectedSubsystem,
    setSunActive,
    triggerAttitudeSlew,
    triggerPhotoCapture,
    triggerDownlink
  } = useSimulator();

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [isMissionComplete, setIsMissionComplete] = useState<boolean>(false);

  const currentStep = SATELLITE_MISSION_STEPS[currentStepIdx];

  const handleStepAction = () => {
    soundFX.playClick();

    if (currentStep.id === 1) {
      // 1. Enerji sistemi
      setSunActive(true);
      setSelectedSubsystem('SOLAR_ARRAYS');
      soundFX.playSuccess();
      setActiveFeedback(currentStep.successMsg);
    } else if (currentStep.id === 2) {
      // 2. Yönelim manevrası
      setSelectedSubsystem('ADCS_SYSTEM');
      triggerAttitudeSlew('TÜRKİYE_ANKARA');
      soundFX.playSuccess();
      setActiveFeedback(currentStep.successMsg);
    } else if (currentStep.id === 3) {
      // 3. Görüntü yakalama
      setSelectedSubsystem('ELECTRO_OPTICAL_CAMERA');
      triggerPhotoCapture();
      soundFX.playSuccess();
      setActiveFeedback(currentStep.successMsg);
    } else if (currentStep.id === 4) {
      // 4. Veri indirme
      setSelectedSubsystem('COMMUNICATION_SYSTEM');
      triggerDownlink();
      soundFX.playSuccess();
      setActiveFeedback(currentStep.successMsg);
    }

    const updated = [...completedSteps, currentStep.id];
    setCompletedSteps(updated);

    // Bir sonraki aşamaya geçiş
    setTimeout(() => {
      if (currentStepIdx + 1 < SATELLITE_MISSION_STEPS.length) {
        setCurrentStepIdx(prev => prev + 1);
        setActiveFeedback(null);
      } else {
        setIsMissionComplete(true);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }, 2800);
  };

  const resetMission = () => {
    setCurrentStepIdx(0);
    setCompletedSteps([]);
    setActiveFeedback(null);
    setIsMissionComplete(false);
    setSelectedSubsystem(null);
  };

  return (
    <div className="activity-card-container">
      {/* Etkinlik Başlığı */}
      <div className="activity-header-bar">
        <div className="activity-title-group">
          <Rocket size={20} className="text-purple" />
          <div>
            <h3>Etkinlik 3: Gerçek Uydu Görevini Tamamla</h3>
            <small>Uydunun 4 ana operasyonel aşamasını sırasıyla yönet ve görev rozetini kazan!</small>
          </div>
        </div>
        <div className="activity-score-badge">
          <span>Aşama:</span> <strong>{completedSteps.length} / 4</strong>
        </div>
      </div>

      {/* 4 Aşamalı İlerleme Çubuğu */}
      <div className="mission-stepper-row">
        {SATELLITE_MISSION_STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = currentStepIdx === idx && !isMissionComplete;
          return (
            <div
              key={step.id}
              className={`stepper-node ${isDone ? 'node-done' : ''} ${
                isCurrent ? 'node-current' : ''
              }`}
            >
              <div className="node-circle">
                {isDone ? <CheckCircle2 size={16} /> : <span>{step.id}</span>}
              </div>
              <span className="node-label">
                {idx === 0
                  ? 'Güç'
                  : idx === 1
                  ? 'Yönelim'
                  : idx === 2
                  ? 'Görüntü'
                  : 'İndirme'}
              </span>
            </div>
          );
        })}
      </div>

      {!isMissionComplete ? (
        <div className="mission-stage-card">
          <div className="stage-header">
            <span className="stage-num-tag">{currentStep.title}</span>
            <h4 className="stage-instruction">{currentStep.instruction}</h4>
          </div>

          <div className="stage-concept-box">
            <strong>Mühendislik Açıklaması:</strong>
            <p>{currentStep.concept}</p>
          </div>

          {activeFeedback ? (
            <div className="feedback-alert-box alert-success" style={{ marginTop: '12px' }}>
              <CheckCircle2 size={18} />
              <span>{activeFeedback}</span>
            </div>
          ) : (
            <button
              onClick={handleStepAction}
              className="mission-action-exec-btn"
            >
              <ArrowRight size={18} />
              <span>{currentStep.actionLabel}</span>
            </button>
          )}
        </div>
      ) : (
        /* Görev Başarı Rozeti / Sertifikası */
        <div className="quiz-completion-box mission-certificate-box">
          <div className="certificate-badge-ring">
            <Trophy size={54} className="text-amber" />
          </div>
          <h2>GÖREV BAŞARIYLA TAMAMLANDI!</h2>
          <p className="cert-subtitle">TÜBİTAK UZAY İMECE UYDU OPERASYON MERKEZİ</p>
          <div className="cert-card-frame">
            <div className="cert-title">GENÇ UYDU MÜHENDİSİ BAŞARI ROZETİ</div>
            <p>
              Tüm görev aşamalarını (Enerji yönetimi, hedefe yönelim, 0.99 m metre-altı optik görüntü
              tarama ve X-bant yer indirmesi) başarıyla icra ettin!
            </p>
            <div className="cert-specs-row">
              <span>🛰️ İrtifa: 680 km SSO</span>
              <span>📸 Çözünürlük: &lt; 0.99 m</span>
              <span>📡 Veri Hızı: 320 Mbps</span>
            </div>
          </div>
          <button onClick={resetMission} className="restart-btn">
            <RotateCcw size={16} /> Görevi Baştan Başlat
          </button>
        </div>
      )}
    </div>
  );
};
