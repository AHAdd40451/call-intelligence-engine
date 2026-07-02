// ---------------------------------------------------------------------------
// Core domain types for the AI Call Intelligence & Content Engine
// ---------------------------------------------------------------------------

export type CallOutcome =
  | "booked"
  | "not_interested"
  | "callback"
  | "no_answer"
  | "voicemail";

export type CallSource = "trellus" | "ghl";

export interface Call {
  id: string;
  lead_name: string;
  phone: string;
  setter: string;
  setter_id: string;
  date: string;
  duration: number; // seconds
  outcome: CallOutcome;
  recording_url?: string;
  transcript?: string;
  ai_summary?: string;
  source: CallSource;
  raw_id: string;
  created_at?: string;
  updated_at?: string;
}

export type BuyingIntent = "very_high" | "high" | "medium" | "low";

export interface AIAnalysis {
  call_id: string;
  overall_score: number;
  rapport: number;
  qualification: number;
  discovery: number;
  objection_handling: number;
  urgency: number;
  closing: number;
  script_compliance: number;
  communication: number;
  buying_intent: BuyingIntent;
  buying_intent_reason: string;
  pain_points: string[];
  goals: string[];
  objections: string[];
  sentiment: string[];
  missed_opportunities: string[];
  coaching_suggestions: string[];
  created_at?: string;
}

export type ContentIdeaType =
  | "instagram_reel"
  | "email"
  | "podcast"
  | "webinar"
  | "faq"
  | "marketing_copy";

export type ContentIdeaStatus = "new" | "reviewed" | "used";

export interface ContentIdea {
  id: string;
  type: ContentIdeaType;
  title: string;
  description: string;
  source_call_ids: string[];
  created_at: string;
  status: ContentIdeaStatus;
}

export interface Setter {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  active: boolean;
  created_at?: string;
}

export interface SetterStats {
  setter_id: string;
  setter_name: string;
  total_calls: number;
  avg_score: number;
  booking_rate: number;
  top_objection?: string;
  trend: number; // % change vs prior period
}

export interface MarketPhrase {
  id: string;
  phrase: string;
  category: "pain_point" | "goal" | "objection" | "sentiment" | "keyword";
  frequency: number;
  call_ids: string[];
  created_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  frequency: number;
  source_call_ids: string[];
  created_at?: string;
}

export interface DailyBriefing {
  id: string;
  date: string;
  summary: string;
  total_calls: number;
  avg_score: number;
  booking_rate: number;
  top_performer?: string;
  top_objection?: string;
  highlights: string[];
  created_at?: string;
}

export interface PainPoint {
  id: string;
  label: string;
  frequency: number;
}

export interface Goal {
  id: string;
  label: string;
  frequency: number;
}

export interface Objection {
  id: string;
  label: string;
  frequency: number;
}

// ---------------------------------------------------------------------------
// Aggregate / view-model types used across dashboard + charts
// ---------------------------------------------------------------------------

export interface KPISummary {
  total_calls: number;
  avg_score: number;
  booking_rate: number;
  total_duration: number;
  calls_delta: number; // % change
  score_delta: number;
  booking_delta: number;
}

export interface HeatmapCell {
  day: number; // 0-6 (Sun-Sat)
  hour: number; // 0-23
  calls: number;
  bookings: number;
  conversion_rate: number;
}

export interface FunnelStage {
  label: string;
  value: number;
  percent: number;
}

export interface TrendPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SentimentPoint {
  index: number;
  timestamp: string;
  sentiment_score: number; // -1 to 1
  speaker: "setter" | "lead";
}

export interface ScoreRadarPoint {
  metric: string;
  value: number;
  fullMark: number;
}

export interface TagCloudItem {
  text: string;
  weight: number;
  category?: string;
}

export interface CallFilters {
  search: string;
  setter_id: string | "all";
  outcome: CallOutcome | "all";
  source: CallSource | "all";
  date_from: string | null;
  date_to: string | null;
  min_score: number | null;
  buying_intent: BuyingIntent | "all";
}

export interface CallWithAnalysis extends Call {
  analysis?: AIAnalysis;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SyncResult {
  synced: number;
  created: number;
  updated: number;
  errors: number;
  duration_ms: number;
}
