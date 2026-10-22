import React from 'react';
import { Html } from '@react-three/drei';
import { useSimulator } from '../../../context/SimulatorContext';
import { SubsystemId } from '../../../types/simulation';

interface LabelItem {
  id: SubsystemId;
  title: string;
  icon: string;
  position: [number, number, number];
}

const LABELS: LabelItem[] = [
  {
    id: 'SOLAR_ARRAYS',
    title: 'Güneş Panelleri',
    icon: '⚡',
    position: [2.3, 1.4, 0]
  },
  {
    id: 'ELECTRO_OPTICAL_CAMERA',
    title: 'Optik Kamera',
    icon: '📸',
    position: [0, -0.2, 2.2]
  },
  {
    id: 'COMMUNICATION_SYSTEM',
    title: 'X-Bant Anten',
    icon: '📡',
    position: [-1.4, -1.5, -0.9]
  },
  {
    id: 'BUS_SYSTEM',
    title: 'Gövde & İç Sistemler',
    icon: '🛰️',
    position: [0, 1.4, 0.4]
  },
  {
    id: 'ADCS_SYSTEM',
    title: 'Yıldız İzler (AOKS)',
    icon: '⭐',
    position: [1.1, 1.0, -0.4]
  },
  {
    id: 'PROPULSION_SYSTEM',
    title: 'İtki Motoru',
    icon: '🚀',
    position: [0, -1.8, -0.4]
  }
];

export const Labels3D: React.FC = () => {
  const {
    labelsVisible,
    selectedSubsystem,
    setSelectedSubsystem,
    setHoveredSubsystem
  } = useSimulator();

  if (!labelsVisible) return null;

  return (
    <group name="3D_LABELS">
      {LABELS.map((item) => {
        const isSelected = selectedSubsystem === item.id;
        return (
          <group key={item.id} position={item.position}>
            <Html center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSubsystem(item.id);
                }}
                onMouseEnter={() => setHoveredSubsystem(item.id)}
                onMouseLeave={() => setHoveredSubsystem(null)}
                className={`label-3d-badge ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  background: isSelected
                    ? 'rgba(56, 189, 248, 0.95)'
                    : 'rgba(15, 23, 42, 0.88)',
                  color: isSelected ? '#030712' : '#f8fafc',
                  border: isSelected
                    ? '2px solid #ffffff'
                    : '1px solid rgba(56, 189, 248, 0.45)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 0 16px rgba(56, 189, 248, 0.8)'
                    : '0 4px 12px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  transform: 'scale(1)',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
              >
                <span style={{ fontSize: '13px' }}>{item.icon}</span>
                <span>{item.title}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
