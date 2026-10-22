import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { SubsystemId } from '../../types/simulation';
import { Sun, Camera, Radio, Box, Compass, Flame } from 'lucide-react';

interface NavItem {
  id: SubsystemId;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const ITEMS: NavItem[] = [
  { id: 'SOLAR_ARRAYS', name: 'Güneş Panelleri', icon: <Sun size={17} />, color: '#38bdf8' },
  { id: 'ELECTRO_OPTICAL_CAMERA', name: 'Optik Kamera', icon: <Camera size={17} />, color: '#10b981' },
  { id: 'COMMUNICATION_SYSTEM', name: 'X-Bant Anten', icon: <Radio size={17} />, color: '#f59e0b' },
  { id: 'BUS_SYSTEM', name: 'Gövde & İç Kesit', icon: <Box size={17} />, color: '#eab308' },
  { id: 'ADCS_SYSTEM', name: 'Yıldız İzler (AOKS)', icon: <Compass size={17} />, color: '#8b5cf6' },
  { id: 'PROPULSION_SYSTEM', name: 'İtki Motoru', icon: <Flame size={17} />, color: '#ef4444' }
];

export const SubsystemsSidebar: React.FC = () => {
  const { mode, selectedSubsystem, setSelectedSubsystem } = useSimulator();

  if (mode !== 'EXPLORATION') return null;

  return (
    <aside className="subsystems-sidebar-dock" aria-label="Uydu Alt Sistemleri Menüsü">
      <div className="sidebar-title">
        <span>Alt Sistemler</span>
      </div>
      <div className="sidebar-buttons-stack">
        {ITEMS.map((item) => {
          const isSelected = selectedSubsystem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedSubsystem(item.id)}
              className={`sidebar-subsystem-btn ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: isSelected ? item.color : undefined
              }}
            >
              <span className="btn-icon" style={{ color: item.color }}>
                {item.icon}
              </span>
              <span className="btn-name">{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-hint-box">
        🖱️ <strong>360° Çevir:</strong> Sol Tık / Kaydır<br />
        🔍 <strong>Yakınlaş:</strong> Tekerlek / Çimdik<br />
        👆 <strong>Parça Seç:</strong> Doğrudan 3D modele tıkla
      </div>
    </aside>
  );
};
