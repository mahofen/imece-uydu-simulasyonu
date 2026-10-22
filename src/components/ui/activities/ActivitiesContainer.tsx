import React from 'react';
import { useSimulator } from '../../../context/SimulatorContext';
import { PartFinderActivity } from './PartFinderActivity';
import { MissionMatchingActivity } from './MissionMatchingActivity';
import { MissionSimulatorActivity } from './MissionSimulatorActivity';
import { Target, Layers, Rocket } from 'lucide-react';

export const ActivitiesContainer: React.FC = () => {
  const { mode, activeActivity, setActiveActivity } = useSimulator();

  if (mode !== 'ACTIVITIES') return null;

  return (
    <div className="activities-overlay-container">
      {/* Etkinlik Sekmeleri */}
      <div className="activities-tabs-bar">
        <button
          onClick={() => setActiveActivity('FIND_PART')}
          className={`activity-tab-pill ${
            activeActivity === 'FIND_PART' ? 'active-pill' : ''
          }`}
        >
          <Target size={16} />
          <span>1. Parçayı Bul</span>
        </button>

        <button
          onClick={() => setActiveActivity('MISSION_MATCH')}
          className={`activity-tab-pill ${
            activeActivity === 'MISSION_MATCH' ? 'active-pill' : ''
          }`}
        >
          <Layers size={16} />
          <span>2. Görev Eşleştirme</span>
        </button>

        <button
          onClick={() => setActiveActivity('COMPLETE_MISSION')}
          className={`activity-tab-pill ${
            activeActivity === 'COMPLETE_MISSION' ? 'active-pill' : ''
          }`}
        >
          <Rocket size={16} />
          <span>3. Uydu Görevini Tamamla</span>
        </button>
      </div>

      {/* Aktif Etkinlik Bileşeni */}
      <div className="active-activity-wrapper">
        {activeActivity === 'FIND_PART' && <PartFinderActivity />}
        {activeActivity === 'MISSION_MATCH' && <MissionMatchingActivity />}
        {activeActivity === 'COMPLETE_MISSION' && <MissionSimulatorActivity />}
      </div>
    </div>
  );
};
