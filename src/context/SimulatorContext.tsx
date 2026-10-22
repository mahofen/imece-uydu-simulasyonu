import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as THREE from 'three';
import { SubsystemId, AppMode, ActivityType, GraphicsQuality, OrbitPresetId } from '../types/simulation';
import { ORBIT_PRESETS } from '../utils/orbitPresetsData';
import { soundFX } from '../utils/audio';

interface SimulatorContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  selectedSubsystem: SubsystemId | null;
  setSelectedSubsystem: (subsystem: SubsystemId | null) => void;
  hoveredSubsystem: SubsystemId | null;
  setHoveredSubsystem: (subsystem: SubsystemId | null) => void;
  
  // Güneş ve Güç Durumu
  sunActive: boolean;
  setSunActive: (active: boolean) => void;
  toggleSun: () => void;
  solarPower: number;
  batteryPct: number;

  // Gövde Kesit / Yarı Saydamlık
  cutawayActive: boolean;
  setCutawayActive: (active: boolean) => void;
  toggleCutaway: () => void;

  // 3D Parça Etiketleri
  labelsVisible: boolean;
  setLabelsVisible: (visible: boolean) => void;
  toggleLabels: () => void;

  // Yörünge Simülasyonu & Kepler Karşılaştırması
  orbitSpeed: number;
  setOrbitSpeed: (speed: number) => void;
  isOrbitPaused: boolean;
  setIsOrbitPaused: (paused: boolean) => void;
  toggleOrbitPause: () => void;
  orbitAngle: number;
  setOrbitAngle: React.Dispatch<React.SetStateAction<number>>;
  orbitPreset: OrbitPresetId;
  setOrbitPreset: (preset: OrbitPresetId) => void;

  // Kamera Görüş Konisi (Sensor FOV Swath)
  sensorFovVisible: boolean;
  setSensorFovVisible: (visible: boolean) => void;
  toggleSensorFov: () => void;

  // Termal Analiz Görünümü (FLIR / Sıcaklık Haritası)
  isThermalMode: boolean;
  setIsThermalMode: (thermal: boolean) => void;
  toggleThermalMode: () => void;

  // Sinematik Otomatik Tur (Kiosk / Sergi Modu)
  isCinematicTour: boolean;
  startCinematicTour: () => void;
  stopCinematicTour: () => void;
  tourStep: number;

  // Uzay Terimleri Sözlüğü
  glossaryOpen: boolean;
  setGlossaryOpen: (open: boolean) => void;
  toggleGlossary: () => void;

  // Kamera Odak, Yakınlaştırma ve Sıfırlama
  targetCamera: { pos: [number, number, number]; lookAt: [number, number, number] } | null;
  setTargetCamera: (target: { pos: [number, number, number]; lookAt: [number, number, number] } | null) => void;
  resetView: () => void;
  zoomTrigger: { dir: 'in' | 'out'; id: number } | null;
  zoomIn: () => void;
  zoomOut: () => void;

  // Yönelim (AOKS / Attitude) Manevraları
  adcsRotation: [number, number, number];
  setAdcsRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  triggerAttitudeSlew: (targetName: string) => void;

  // Haberleşme ve Sinyal Dalgaları
  signalMode: 'none' | 'uplink' | 'downlink';
  triggerUplink: () => void;
  triggerDownlink: () => void;

  // Optik Kamera ve Çözünürlük İnceleme
  photoModalOpen: boolean;
  setPhotoModalOpen: (open: boolean) => void;
  triggerPhotoCapture: () => void;

  // Etkinlikler
  activeActivity: ActivityType;
  setActiveActivity: (act: ActivityType) => void;

  // Sistem & Performans
  graphicsQuality: GraphicsQuality;
  setGraphicsQuality: (q: GraphicsQuality) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>('EXPLORATION');
  const [selectedSubsystem, setSelectedSubsystemState] = useState<SubsystemId | null>(null);
  const [hoveredSubsystem, setHoveredSubsystem] = useState<SubsystemId | null>(null);

  // Güç ve Güneş
  const [sunActive, setSunActive] = useState<boolean>(true);
  const [solarPower, setSolarPower] = useState<number>(1200);
  const [batteryPct, setBatteryPct] = useState<number>(100);

  // Gövde kesit
  const [cutawayActive, setCutawayActive] = useState<boolean>(false);

  // 3D Etiketler
  const [labelsVisible, setLabelsVisible] = useState<boolean>(false);

  // Yörünge
  const [orbitSpeed, setOrbitSpeed] = useState<number>(10);
  const [isOrbitPaused, setIsOrbitPaused] = useState<boolean>(false);
  const [orbitAngle, setOrbitAngle] = useState<number>(0.5);
  const [orbitPreset, setOrbitPresetState] = useState<OrbitPresetId>('IMECE_SSO');

  const setOrbitPreset = (preset: OrbitPresetId) => {
    soundFX.playClick();
    setOrbitPresetState(preset);
  };

  // Kamera Görüş Konisi (Sensor FOV Swath)
  const [sensorFovVisible, setSensorFovVisible] = useState<boolean>(true);
  const toggleSensorFov = () => {
    soundFX.playClick();
    setSensorFovVisible(prev => !prev);
  };

  // Termal Görünüm Modu (FLIR / Termal Analiz)
  const [isThermalMode, setIsThermalMode] = useState<boolean>(false);
  const toggleThermalMode = () => {
    soundFX.playClick();
    setIsThermalMode(prev => !prev);
  };

  // Sinematik Otomatik Tur (Kiosk / Sergi Modu)
  const [isCinematicTour, setIsCinematicTour] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  const startCinematicTour = () => {
    soundFX.playClick();
    setSelectedSubsystemState(null);
    setCutawayActive(false);
    setIsCinematicTour(true);
    setTourStep(0);
  };

  const stopCinematicTour = () => {
    soundFX.playClick();
    setIsCinematicTour(false);
    resetView();
  };

  // Sinematik tur adımları zamanlayıcısı
  useEffect(() => {
    if (!isCinematicTour) return;

    const tourStepsCount = 5;
    const interval = setInterval(() => {
      setTourStep(prev => (prev + 1) % tourStepsCount);
    }, 6500);

    return () => clearInterval(interval);
  }, [isCinematicTour]);

  // Tur adımına göre yumuşak kamera açıları
  useEffect(() => {
    if (!isCinematicTour) return;

    switch (tourStep) {
      case 0: // Genel görünüm
        setCutawayActive(false);
        setTargetCamera({ pos: [2.8, 1.8, 4.2], lookAt: [0, 0, 0] });
        break;
      case 1: // Güneş panelleri
        setCutawayActive(false);
        setTargetCamera({ pos: [3.4, 0.8, 1.6], lookAt: [1.2, 0.3, 0] });
        break;
      case 2: // Optik kamera ve lens
        setCutawayActive(false);
        setTargetCamera({ pos: [0, -1.8, 3.2], lookAt: [0, -0.4, 0.6] });
        break;
      case 3: // Elektrikli itki ve arka yüzey
        setCutawayActive(false);
        setTargetCamera({ pos: [0, -2.8, -1.8], lookAt: [0, -0.8, -0.4] });
        break;
      case 4: // İç kesit ve uçuş bilgisayarı
        setCutawayActive(true);
        setTargetCamera({ pos: [-1.4, 1.2, 2.8], lookAt: [0, 0.1, 0] });
        break;
    }
  }, [tourStep, isCinematicTour]);

  // Uzay Terimleri Sözlüğü
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const toggleGlossary = () => {
    soundFX.playClick();
    setGlossaryOpen(prev => !prev);
  };

  // Kamera hedefi & Zoom
  const [targetCamera, setTargetCamera] = useState<{ pos: [number, number, number]; lookAt: [number, number, number] } | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState<{ dir: 'in' | 'out'; id: number } | null>(null);

  const zoomIn = () => {
    soundFX.playClick();
    setZoomTrigger(prev => ({ dir: 'in', id: (prev?.id || 0) + 1 }));
  };

  const zoomOut = () => {
    soundFX.playClick();
    setZoomTrigger(prev => ({ dir: 'out', id: (prev?.id || 0) + 1 }));
  };

  // Yönelim (ADCS)
  const [adcsRotation, setAdcsRotation] = useState<[number, number, number]>([0.15, 0.35, 0]);

  // Sinyal
  const [signalMode, setSignalMode] = useState<'none' | 'uplink' | 'downlink'>('none');

  // Fotoğraf
  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);

  // Etkinlik
  const [activeActivity, setActiveActivity] = useState<ActivityType>('FIND_PART');

  // Grafikler & Ses
  const [graphicsQuality, setGraphicsQuality] = useState<GraphicsQuality>('high');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  const setMode = (newMode: AppMode) => {
    soundFX.playClick();
    setModeState(newMode);
    setSelectedSubsystemState(null);
    setCutawayActive(false);

    if (newMode === 'ORBIT') {
      // Yörünge görünümüne geniş açı
      setTargetCamera({ pos: [0, 22, 38], lookAt: [0, 0, 0] });
    } else {
      // Uydu yakından inceleme
      setTargetCamera({ pos: [0, 1.8, 4.8], lookAt: [0, 0, 0] });
    }
  };

  const setSelectedSubsystem = (subsystem: SubsystemId | null) => {
    setSelectedSubsystemState(subsystem);
    if (subsystem) {
      soundFX.playSelect();
      // Parçaya göre özel kamera konumu
      switch (subsystem) {
        case 'SOLAR_ARRAYS':
          setTargetCamera({ pos: [2.8, 1.6, 2.5], lookAt: [1.2, 0.3, 0] });
          break;
        case 'ELECTRO_OPTICAL_CAMERA':
          setTargetCamera({ pos: [0, -0.2, 3.4], lookAt: [0, -0.2, 1.2] });
          break;
        case 'COMMUNICATION_SYSTEM':
          setTargetCamera({ pos: [-2.2, -1.8, -1.5], lookAt: [-0.9, -1.2, -0.8] });
          break;
        case 'BUS_SYSTEM':
          setCutawayActive(true);
          setTargetCamera({ pos: [0, 0.5, 3.2], lookAt: [0, 0, 0] });
          break;
        case 'ADCS_SYSTEM':
          setTargetCamera({ pos: [1.4, 1.6, -1.2], lookAt: [0.8, 0.7, -0.4] });
          break;
        case 'PROPULSION_SYSTEM':
          setTargetCamera({ pos: [0, -2.6, -1.6], lookAt: [0, -1.3, -0.4] });
          break;
      }
    } else {
      setCutawayActive(false);
    }
  };

  const resetView = () => {
    soundFX.playClick();
    setSelectedSubsystemState(null);
    setCutawayActive(false);
    if (mode === 'ORBIT') {
      setTargetCamera({ pos: [0, 22, 38], lookAt: [0, 0, 0] });
    } else {
      setTargetCamera({ pos: [0, 1.8, 4.8], lookAt: [0, 0, 0] });
    }
  };

  const toggleSun = () => {
    soundFX.playClick();
    setSunActive(prev => !prev);
  };

  // Güneş durumuna göre dinamik güç ve batarya hesaplaması
  useEffect(() => {
    if (sunActive) {
      setSolarPower(1200);
      setBatteryPct(100);
    } else {
      setSolarPower(0);
      const interval = setInterval(() => {
        setBatteryPct(prev => Math.max(76, prev - 1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [sunActive]);

  const toggleCutaway = () => {
    soundFX.playClick();
    setCutawayActive(prev => !prev);
  };

  const toggleLabels = () => {
    soundFX.playClick();
    setLabelsVisible(prev => !prev);
  };

  const toggleOrbitPause = () => {
    soundFX.playClick();
    setIsOrbitPaused(prev => !prev);
  };

  const setSoundEnabled = (val: boolean) => {
    soundFX.enabled = val;
    setSoundEnabledState(val);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Yönelim manevrası
  const triggerAttitudeSlew = (targetName: string) => {
    soundFX.playThruster();
    if (targetName === 'TÜRKİYE_ANKARA') {
      setAdcsRotation([0.22, 0.1, 0.05]);
    } else if (targetName === 'VAN_GÖLÜ') {
      setAdcsRotation([0.35, 0.28, -0.15]);
    } else if (targetName === 'İSTANBUL_BOĞAZI') {
      setAdcsRotation([0.12, -0.22, 0.1]);
    } else {
      setAdcsRotation([0.0, 0.0, 0.0]);
    }
  };

  // Uplink ve Downlink
  const triggerUplink = () => {
    soundFX.playTelemetryPing();
    setSignalMode('uplink');
    setTimeout(() => {
      setSignalMode('none');
    }, 4500);
  };

  const triggerDownlink = () => {
    soundFX.playTelemetryPing();
    setSignalMode('downlink');
    setTimeout(() => {
      setSignalMode('none');
    }, 5500);
  };

  const triggerPhotoCapture = () => {
    soundFX.playShutter();
    setPhotoModalOpen(true);
  };

  return (
    <SimulatorContext.Provider
      value={{
        mode,
        setMode,
        selectedSubsystem,
        setSelectedSubsystem,
        hoveredSubsystem,
        setHoveredSubsystem,
        sunActive,
        setSunActive,
        toggleSun,
        solarPower,
        batteryPct,
        cutawayActive,
        setCutawayActive,
        toggleCutaway,
        labelsVisible,
        setLabelsVisible,
        toggleLabels,
        orbitSpeed,
        setOrbitSpeed,
        isOrbitPaused,
        setIsOrbitPaused,
        toggleOrbitPause,
        orbitAngle,
        setOrbitAngle,
        orbitPreset,
        setOrbitPreset,
        sensorFovVisible,
        setSensorFovVisible,
        toggleSensorFov,
        isThermalMode,
        setIsThermalMode,
        toggleThermalMode,
        isCinematicTour,
        startCinematicTour,
        stopCinematicTour,
        tourStep,
        glossaryOpen,
        setGlossaryOpen,
        toggleGlossary,
        targetCamera,
        setTargetCamera,
        resetView,
        zoomTrigger,
        zoomIn,
        zoomOut,
        adcsRotation,
        setAdcsRotation,
        triggerAttitudeSlew,
        signalMode,
        triggerUplink,
        triggerDownlink,
        photoModalOpen,
        setPhotoModalOpen,
        triggerPhotoCapture,
        activeActivity,
        setActiveActivity,
        graphicsQuality,
        setGraphicsQuality,
        soundEnabled,
        setSoundEnabled,
        toggleSound
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = (): SimulatorContextType => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
