import React, { useState } from 'react';
import { MATCHING_PAIRS, MatchingPair } from '../../../utils/subsystemsData';
import { soundFX } from '../../../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, Sparkles, Layers, ArrowRight } from 'lucide-react';

export const MissionMatchingActivity: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<MatchingPair | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Görevleri rastgele karıştırılmış bir listede tut
  const [shuffledTasks] = useState(() => {
    return [...MATCHING_PAIRS].sort(() => Math.random() - 0.5);
  });

  const handleSubsystemClick = (pair: MatchingPair) => {
    if (matchedIds.includes(pair.id)) return;
    soundFX.playClick();
    setSelectedSubsystem(pair);
    setFeedback(null);
  };

  const handleTaskClick = (targetPair: MatchingPair) => {
    if (!selectedSubsystem) {
      setFeedback({
        isSuccess: false,
        text: 'Önce sol taraftan bir uydu parçası seçmelisin!'
      });
      return;
    }

    if (matchedIds.includes(targetPair.id)) return;

    if (selectedSubsystem.id === targetPair.id) {
      soundFX.playSuccess();
      const newMatched = [...matchedIds, targetPair.id];
      setMatchedIds(newMatched);
      setFeedback({
        isSuccess: true,
        text: targetPair.explanation
      });
      setSelectedSubsystem(null);

      if (newMatched.length === MATCHING_PAIRS.length) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      soundFX.playWrong();
      setFeedback({
        isSuccess: false,
        text: `"${selectedSubsystem.subsystemName}" bu görevi yapmaz. Parçanın çalışma mantığını tekrar düşün!`
      });
    }
  };

  const resetGame = () => {
    setMatchedIds([]);
    setSelectedSubsystem(null);
    setFeedback(null);
  };

  const isAllMatched = matchedIds.length === MATCHING_PAIRS.length;

  return (
    <div className="activity-card-container">
      {/* Etkinlik Başlığı */}
      <div className="activity-header-bar">
        <div className="activity-title-group">
          <Layers size={20} className="text-cyan" />
          <div>
            <h3>Etkinlik 2: Görev Eşleştirme</h3>
            <small>Sol taraftan uydu parçasını seç, ardından sağ taraftaki doğru görevine tıkla!</small>
          </div>
        </div>
        <div className="activity-score-badge">
          <span>Eşleşen:</span> <strong>{matchedIds.length} / {MATCHING_PAIRS.length}</strong>
        </div>
      </div>

      {/* Geri Bildirim Bildirimi */}
      {feedback && (
        <div
          className={`feedback-alert-box ${
            feedback.isSuccess ? 'alert-success' : 'alert-retry'
          }`}
          style={{ marginBottom: '14px' }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback.text}</span>
        </div>
      )}

      {!isAllMatched ? (
        <div className="matching-columns-grid">
          {/* Sol Kolon: Uydu Parçaları */}
          <div className="matching-column">
            <h4 className="column-title">1. Uydu Bileşeni</h4>
            <div className="cards-stack">
              {MATCHING_PAIRS.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedSubsystem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSubsystemClick(item)}
                    className={`match-card part-card ${
                      isMatched ? 'card-matched' : ''
                    } ${isSelected ? 'card-selected' : ''}`}
                  >
                    <div className="card-indicator">
                      {isMatched ? '✅' : isSelected ? '👉' : '🔹'}
                    </div>
                    <strong>{item.subsystemName}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sağ Kolon: Görev Tanımları */}
          <div className="matching-column">
            <h4 className="column-title">2. Uzaydaki Görevi</h4>
            <div className="cards-stack">
              {shuffledTasks.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleTaskClick(item)}
                    className={`match-card task-card ${
                      isMatched ? 'card-matched' : ''
                    }`}
                  >
                    <div className="card-indicator">
                      {isMatched ? '✅' : '🎯'}
                    </div>
                    <span>{item.taskDescription}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Tamamlanma */
        <div className="quiz-completion-box">
          <Sparkles size={48} className="text-cyan pulse-anim" />
          <h2>Tüm Görevler Başarıyla Eşleştirildi!</h2>
          <p>
            İMECE'nin elektrik üretiminden görüntü indirmeye kadar tüm alt sistemlerinin hangi
            görevleri üstlendiğini kusursuz bir şekilde kavradın.
          </p>
          <button onClick={resetGame} className="restart-btn">
            <RotateCcw size={16} /> Yeniden Oyna
          </button>
        </div>
      )}
    </div>
  );
};
