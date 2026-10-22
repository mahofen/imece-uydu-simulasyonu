import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../../context/SimulatorContext';
import { SubsystemId } from '../../../types/simulation';
import { soundFX } from '../../../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, HelpCircle, Trophy, RotateCcw, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  prompt: string;
  targetSubsystem: SubsystemId;
  hint: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: 'İMECE uydusunun uzayda elektrik enerjisi ürettiği "Açılabilir Güneş Panelleri"ni bul ve 3D model üzerinden tıkla!',
    targetSubsystem: 'SOLAR_ARRAYS',
    hint: 'İpucu: Uydunun sağında ve solunda uzanan, üzerinde koyu mavi güneş hücreleri olan kanatlara bak.',
    explanation: 'Harika! Güneş panelleri fotovoltaik etkiyle güneş ışığını 1200 Watt elektriğe dönüştürür.'
  },
  {
    id: 2,
    prompt: 'Yeryüzünü 680 km yukarıdan 0,99 metre detayında fotoğraflayan "Metre-Altı Optik Kamera"yı bul ve tıkla!',
    targetSubsystem: 'ELECTRO_OPTICAL_CAMERA',
    hint: 'İpucu: Uydunun ön yüzünde yer alan, içi aynalarla dolu koyu renkli silindirik optik namluya tıkla.',
    explanation: 'Tebrikler! TÜBİTAK UZAY yapımı optik kamera sıfır genleşmeli Zerodur aynalarla yeryüzünü tarar.'
  },
  {
    id: 3,
    prompt: 'Çekilen devasa uydu fotoğraflarını Dünya\'ya yüksek hızla (320 Mbps) indiren "X-Bant Çanak Anten"i bul ve tıkla!',
    targetSubsystem: 'COMMUNICATION_SYSTEM',
    hint: 'İpucu: Uydunun alt köşesinde yer alan, yönlendirilebilir hareketli çanak antene bak.',
    explanation: 'Süper! 2 eksenli gimbal mekanizmalı X-bant çanak anten fotoğrafları yer istasyonuna ışık hızında indirir.'
  },
  {
    id: 4,
    prompt: 'Uydunun uzayda yönünü hassasça belirlemesini sağlayan ark-saniye hassasiyetli "Yıldız İzler (Star Tracker)" kamerasını bul!',
    targetSubsystem: 'ADCS_SYSTEM',
    hint: 'İpucu: Uydunun gövdesinin üst köşelerinde çapraz olarak uzaya bakan küçük konik optik duyargalara tıkla.',
    explanation: 'Çok iyi! Yıldız izler gökyüzündeki yıldız haritalarını tanıyarak uydunun baktığı yönü hesaplar.'
  },
  {
    id: 5,
    prompt: 'Uydunun 680 km irtifada kalmasını ve yörünge manevrası yapmasını sağlayan "Yerli İtki Motoru"nu bul!',
    targetSubsystem: 'PROPULSION_SYSTEM',
    hint: 'İpucu: Uydunun en alt tabanında yer alan roket nozulu ve küçük manevra memelerine bak.',
    explanation: 'Kusursuz! Elektrikli itki ve soğuk gaz motorları uydunun uzay çöpleriyle çarpışmasını önler ve irtifasını korur.'
  }
];

export const PartFinderActivity: React.FC = () => {
  const { selectedSubsystem, setSelectedSubsystem } = useSimulator();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = QUESTIONS[currentIdx];

  // Öğrenci 3D model üzerinde bir parçaya tıkladığında kontrol et
  useEffect(() => {
    if (!selectedSubsystem || isCompleted) return;

    if (selectedSubsystem === currentQ.targetSubsystem) {
      soundFX.playSuccess();
      setIsCorrect(true);
      setFeedback(currentQ.explanation);
      setScore(prev => prev + 20);

      // 2 saniye sonra sonraki soruya geç
      const timer = setTimeout(() => {
        if (currentIdx + 1 < QUESTIONS.length) {
          setCurrentIdx(prev => prev + 1);
          setIsCorrect(null);
          setFeedback(null);
          setShowHint(false);
          setSelectedSubsystem(null);
        } else {
          setIsCompleted(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 2200);

      return () => clearTimeout(timer);
    } else {
      soundFX.playWrong();
      setIsCorrect(false);
      setFeedback('Farklı bir parça seçtin. Yönergeyi ve ipucunu tekrar oku ve 3D model üzerinden doğru parçayı bul!');
    }
  }, [selectedSubsystem]);

  const restartQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setIsCompleted(false);
    setIsCorrect(null);
    setFeedback(null);
    setShowHint(false);
    setSelectedSubsystem(null);
  };

  return (
    <div className="activity-card-container">
      {/* Etkinlik Üst Bilgisi */}
      <div className="activity-header-bar">
        <div className="activity-title-group">
          <Trophy size={20} className="text-amber" />
          <div>
            <h3>Etkinlik 1: Uydu Parçasını Bul</h3>
            <small>Yönergeyi oku ve 3D uydu modeli üzerinde doğru parçaya tıkla!</small>
          </div>
        </div>
        <div className="activity-score-badge">
          <span>Puan:</span> <strong>{score} / 100</strong>
        </div>
      </div>

      {!isCompleted ? (
        <div className="quiz-question-box">
          <div className="question-number-pill">
            Soru {currentIdx + 1} / {QUESTIONS.length}
          </div>
          <h4 className="question-prompt-text">{currentQ.prompt}</h4>

          {/* İpucu Butonu */}
          <div className="hint-section">
            <button
              onClick={() => setShowHint(!showHint)}
              className="hint-toggle-btn"
            >
              <HelpCircle size={15} /> {showHint ? 'İpucunu Gizle' : 'İpucu Al'}
            </button>
            {showHint && <p className="hint-text">{currentQ.hint}</p>}
          </div>

          {/* Geri Bildirim Bildirimi */}
          {feedback && (
            <div
              className={`feedback-alert-box ${
                isCorrect ? 'alert-success' : 'alert-retry'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 size={18} className="text-emerald" />
              ) : (
                <HelpCircle size={18} className="text-amber" />
              )}
              <span>{feedback}</span>
            </div>
          )}

          <div className="touch-helper-note">
            💡 <em>Fareyle veya ekrana dokunarak uyduyu döndürebilir ve yaklaştırabilirsiniz.</em>
          </div>
        </div>
      ) : (
        /* Tebrikler ve Tamamlanma Ekranı */
        <div className="quiz-completion-box">
          <Sparkles size={48} className="text-amber pulse-anim" />
          <h2>Tebrikler Genç Uydu Kaşifi!</h2>
          <p>
            Tüm İMECE parçalarını 3D model üzerinde başarıyla buldun ve görevlerini keşfettin!
          </p>
          <div className="final-score-display">
            Toplam Puanın: <strong>{score} / 100</strong>
          </div>
          <button onClick={restartQuiz} className="restart-btn">
            <RotateCcw size={16} /> Etkinliği Yeniden Başlat
          </button>
        </div>
      )}
    </div>
  );
};
