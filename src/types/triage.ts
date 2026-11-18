export type Language = "vi" | "en";

export type TriageSeverity = "RED" | "YELLOW" | "GREEN";

export interface MedicalReference {
  title: string;
  organization: string;
  url: string;
}

export interface TriageResponse {
  severity: TriageSeverity;
  severityLabel: string;
  injuryType: string;
  summary: string;
  steps: string[];
  doNotDo: string[];
  whenToHospital: string[];
  recommendHospital: boolean;
  references: MedicalReference[];
  disclaimer: string;
}

export interface ImageAnalysisResponse extends TriageResponse {
  preliminaryVisualFindings: string;
  confidenceNote: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  triage?: TriageResponse;
  error?: string;
}

export interface HistoryEntry {
  id: string;
  type: "chat" | "image";
  createdAt: string;
  querySummary: string;
  result: TriageResponse | ImageAnalysisResponse;
  thumbnailCount?: number;
}

export interface InjuryGuide {
  id: string;
  category: "burn" | "bleeding" | "eye" | "ear" | "fracture" | "shock" | "smoke";
  severityDefault: TriageSeverity;
  title: Record<Language, string>;
  shortSummary: Record<Language, string>;
  firstAidSteps: Record<Language, string[]>;
  doNotDo: Record<Language, string[]>;
  hospitalRedFlags: Record<Language, string[]>;
  aiPrefillPrompt: Record<Language, string>;
  source: string;
}

export interface VideoSlide {
  startSec: number;
  endSec: number;
  caption: Record<Language, string>;
  instructionTitle: Record<Language, string>;
  imageUrl: string;
  actionTag: Record<Language, string>;
}

export interface VideoModule {
  id: string;
  durationSec: number;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  thumbnailUrl: string;
  hasBurnTimer?: boolean;
  slides: VideoSlide[];
}

export interface HospitalFacility {
  id: string;
  name: Record<Language, string>;
  city: string;
  specialty: Record<Language, string>;
  phone: string;
  address: string;
  mapsQuery: string;
}

export interface FaqItem {
  id: string;
  question: Record<Language, string>;
  answer: Record<Language, string>;
}
