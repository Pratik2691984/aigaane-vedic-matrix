export type Domain = 'Physical' | 'Mental' | 'Bridge' | 'Vedic' | 'Research';
export type EdgeKind = 'feedforward' | 'feedback' | 'bridge' | 'acoustic' | 'measurement';
export type LayaName = 'vilambita' | 'madhya' | 'druta';

export interface SubsystemNode {
  id: string;
  index: number;
  name: string;
  domain: Domain;
  icon: string;
  x: number;
  y: number;
  target: string;
  metric: string;
  level3_application: string;
  srutiHint: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  label: string;
  bidirectional: boolean;
}

export interface SimState {
  stress: number;
  vagalTone: number;
  layaBpm: number;
  cortisol: number;
  heartRate: number;
  hrvRmssd: number;
  bandwidth: number;
  inhibitionGain: number;
  cytokines: number;
  breathRate: number;
  coherence: number;
}

export interface WearableTelemetryPayload {
  timestamp: number;
  heartRateBpm: number;
  hrvRmssdMs: number;
  respiratoryRateBrpm: number;
  skinTemperatureCelsius: number;
  sleepPerformanceScore: number;
  derivedStates: {
    autonomicBalanceIndex: number;
    recommendedLayaTempo: LayaName;
    suggestedSrutiTuning: string;
  };
}

export interface QuizItem {
  id: string;
  prompt: string;
  answerId: string;
  distractorIds: string[];
  hint: string;
}
