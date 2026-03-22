// === API Response Types (TRD §5.2) ===

export interface SectionScores {
  skills: number;
  experience: number;
  education: number;
  summary: number;
}

export interface XAIExplanation {
  positive_phrases: string[];
  missing_keywords: string[];
  explanation_text: string;
  improvement_suggestions: string[];
}

export interface ResumeMetadata {
  filename: string;
  word_count: number;
  sections_found: string[];
}

export interface ScreeningResult {
  screening_id: string;
  job_id: string;
  timestamp: string;
  overall_score: number;
  confidence: 'Low' | 'Medium' | 'High';
  section_scores: SectionScores;
  matched_skills: string[];
  missing_skills: string[];
  xai: XAIExplanation;
  resume_metadata: ResumeMetadata;
  candidate_name?: string;
  candidate_title?: string;
  is_shortlisted?: boolean;
}

export interface ScreeningSummary {
  screening_id: string;
  timestamp: string;
  overall_score: number;
  confidence: 'Low' | 'Medium' | 'High';
  resume_filename: string;
  candidate_name?: string;
  job_title?: string;
}

export interface JobOpening {
  job_id: string;
  title: string;
  company: string;
  department: string;
  description: string;
  created_at: string;
  is_active: boolean;
  screening_count: number;
}

export interface FeedbackResult {
  section_ratings: SectionScores;
  skill_gaps: string[];
  keyword_suggestions: string[];
  action_plan: string[];
  format_issues: string[];
  overall_score: number;
  confidence: 'Low' | 'Medium' | 'High';
}

export interface HealthCheck {
  status: string;
  ml_model_loaded: boolean;
  db_connected: boolean;
  version: string;
}
