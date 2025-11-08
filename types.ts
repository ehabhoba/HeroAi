export interface LocalizedString {
  en: string;
  ar: string;
}

export interface MuseumArtifact {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  era: LocalizedString;
  location: LocalizedString;
  discoveryYear: number;
  imageUrl: string;
  modelUrl?: string;
}

// For Supabase History
export interface AnalysisRecord {
  id: string;
  type: 'translation' | 'render';
  prompt: string;
  result_url: string; // URL to original image for translations, or rendered image for renders
  created_at: string;
}

// For structured Gemini responses
export interface HieroglyphTranslation {
  translation: string;
  context: string;
  symbolism: string;
  artifact_type: string;
}

export interface QuizFeedback {
  is_correct: boolean;
  explanation: string;
}