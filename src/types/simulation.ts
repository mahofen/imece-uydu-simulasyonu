export type SubsystemId =
  | 'SOLAR_ARRAYS'
  | 'ELECTRO_OPTICAL_CAMERA'
  | 'COMMUNICATION_SYSTEM'
  | 'BUS_SYSTEM'
  | 'ADCS_SYSTEM'
  | 'PROPULSION_SYSTEM';

export type AppMode = 'EXPLORATION' | 'ORBIT' | 'ACTIVITIES';

export type ActivityType = 'FIND_PART' | 'MISSION_MATCH' | 'COMPLETE_MISSION';

export type GraphicsQuality = 'high' | 'medium' | 'low';

export interface SubsystemData {
  id: SubsystemId;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  specs: string[];
  scientificConcept: string;
  kidsExplanation: string;
  icon: string;
  color: string;
}

export interface InternalComponent {
  id: string;
  name: string;
  function: string;
  details: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export interface GroundStation {
  name: string;
  locationName: string;
  lat: number;
  lon: number;
  frequency: string;
  active: boolean;
}

export interface MissionStep {
  id: number;
  title: string;
  instruction: string;
  hint: string;
  actionType: 'POWER' | 'ATTITUDE' | 'IMAGE' | 'DOWNLINK';
  completed: boolean;
  explanation: string;
}

// ============================================
// YÖRÜNGE VE ASTRODİNAMİK KARŞILAŞTIRMA TİPLERİ
// ============================================
export type OrbitPresetId = 'LEO_ISS' | 'IMECE_SSO' | 'MEO_GPS' | 'GEO_TURKSAT';

export interface OrbitPresetData {
  id: OrbitPresetId;
  name: string;
  subtitle: string;
  altitudeKm: number;
  radiusUnits: number;
  velocityKmh: number;
  periodMinutes: number;
  inclinationDeg: number;
  speedMultiplier: number;
  description: string;
  keplerNote: string;
}

// ============================================
// UZAY VE UYDU TERİMLERİ SÖZLÜĞÜ
// ============================================
export interface GlossaryTerm {
  term: string;
  pronunciation?: string;
  category: 'Yörünge' | 'Optik' | 'Güç' | 'Aviyonik' | 'Haberleşme';
  definition: string;
  kidsAnalog: string;
}
