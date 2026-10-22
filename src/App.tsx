import React from 'react';
import { SimulatorProvider } from './context/SimulatorContext';
import { SceneContainer } from './components/3d/SceneContainer';
import { Header } from './components/ui/Header';
import { SubsystemsSidebar } from './components/ui/SubsystemsSidebar';
import { RightDockPanel } from './components/ui/RightDockPanel';
import { BottomTaskbar } from './components/ui/BottomTaskbar';
import './index.css';

export const App: React.FC = () => {
  return (
    <SimulatorProvider>
      <div className="simulator-app-root">
        {/* 3D WebGL Sahnesi (Arka plan derin uzay yıldızları, Dünya ve İMECE uydusu) */}
        <SceneContainer />

        {/* Kenar Görev Çubukları Katmanı (Merkezde hiçbir pencere veya engelleyici araç olmadan) */}
        <div className="hud-layer">
          <Header />
          <SubsystemsSidebar />
          <RightDockPanel />
          <BottomTaskbar />
        </div>
      </div>
    </SimulatorProvider>
  );
};

export default App;
