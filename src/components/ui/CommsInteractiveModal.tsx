import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Radio, Send, Download, CheckCircle2, Wifi, Signal } from 'lucide-react';

export const CommsInteractiveModal: React.FC = () => {
  const {
    signalMode,
    triggerUplink,
    triggerDownlink
  } = useSimulator();

  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const handleSendUplink = () => {
    triggerUplink();
    setLastCommand('Yeni Görev Koordinatları Gönderildi: [Ankara - 39.9°K, 32.8°D]');
  };

  const handleStartDownlink = () => {
    triggerDownlink();
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 18;
      });
    }, 400);
  };

  return (
    <div className="interactive-sub-card comms-card">
      <div className="card-top-header">
        <div className="card-title-badge">
          <Radio size={18} className="text-amber" />
          <strong>Haberleşme ve Veri İletim İstasyonu</strong>
        </div>
        <div className="station-status-pill">
          <Signal size={14} className="text-emerald" />
          <span>TÜBİTAK UZAY Yer İstasyonu (Ankara) İrtibatta</span>
        </div>
      </div>

      {/* İki Ayrı İşlevsel Düğme: Komut Gönder & Görüntü İndir */}
      <div className="comms-actions-grid">
        <div className="comms-action-box">
          <div className="action-box-header">
            <strong>1. Komuta Gönderme (Uplink)</strong>
            <small>Yer İstasyonu ➔ Uydu</small>
          </div>
          <p className="action-box-desc">
            Yeryüzündeki mühendisler uyduya yeni çekim hedefleri ve uçuş planı komutlarını radyo
            dalgalarıyla iletir.
          </p>
          <button
            onClick={handleSendUplink}
            disabled={signalMode === 'uplink'}
            className="comms-btn btn-uplink"
          >
            <Send size={16} />
            {signalMode === 'uplink' ? '📡 Komut İletiliyor (Uplink)...' : 'Komut Gönder'}
          </button>
          {lastCommand && (
            <div className="action-feedback-tag tag-uplink-success">
              <CheckCircle2 size={13} /> {lastCommand}
            </div>
          )}
        </div>

        <div className="comms-action-box">
          <div className="action-box-header">
            <strong>2. Görüntü İndirme (Downlink)</strong>
            <small>Uydu ➔ Yer İstasyonu (X-Bant)</small>
          </div>
          <p className="action-box-desc">
            Uydunun hafızasında saklanan yüksek çözünürlüklü uydu fotoğrafları 320 Mbps bant
            genişliğiyle Dünya'ya indirilir.
          </p>
          <button
            onClick={handleStartDownlink}
            disabled={signalMode === 'downlink'}
            className="comms-btn btn-downlink"
          >
            <Download size={16} />
            {signalMode === 'downlink' ? '🛰️ Görüntü İndiriliyor (Downlink)...' : 'Görüntü Verisi İndir'}
          </button>
          {signalMode === 'downlink' && (
            <div className="download-progress-box">
              <div className="progress-labels">
                <span>X-Bant Aktarım Hızı: 320 Mbps</span>
                <span>%{downloadProgress}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bilimsel Açıklama */}
      <div className="concept-callout">
        <Wifi size={16} className="text-amber" />
        <div className="concept-text">
          <p>
            <strong>Elektromanyetik Radyo Dalgaları:</strong> Uzay boşluğunda kablo çekilemeyeceği
            için veri aktarımı ışık hızında (300.000 km/s) yol alan mikrodalgalarla yapılır. İMECE'nin
            yönlendirilebilir X-bant çanak anteni, uydu 680 km yukarıda saatte 27.000 km hızla
            uçarken bile Ankara'daki yer istasyonuna kilitli kalır!
          </p>
        </div>
      </div>
    </div>
  );
};
