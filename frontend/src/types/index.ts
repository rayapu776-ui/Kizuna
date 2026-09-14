export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: "youth" | "caregiver" | "clinician";
  age: number;
  is_minor: boolean;
  population_type: "youth_hikikomori" | "elderly_isolation";
  avatar_url?: string;
  linked_user_id?: number;
}

export interface TelemetryDaily {
  id: number;
  user_id: number;
  log_date: string;
  location_entropy: number;
  radius_of_gyration_km: number;
  time_spent_home_ratio: number;
  total_screen_time_hours: number;
  late_night_screen_hours: number;
  app_switching_frequency: number;
  sleep_duration_hours: number;
  sleep_midpoint_hour: number;
  sleep_quality_score: number;
  step_count: number;
  outgoing_call_count: number;
  incoming_call_count: number;
  sms_or_message_count: number;
  distinct_contacts_interacted: number;
}

export interface TelemetryDifferential {
  metric_name: string;
  current_avg: number;
  previous_avg: number;
  percentage_change: number;
  plain_description: string;
  risk_direction: "worsening" | "improving" | "stable";
}

export interface SHAPFeatureImpact {
  feature_name: string;
  display_name: string;
  feature_value: number;
  unit: string;
  impact_points: number;
  direction: "increases_risk" | "protects_against_risk";
  plain_explanation: string;
}

export interface RiskAssessment {
  id: number;
  user_id: number;
  assessment_date: string;
  overall_risk_score: number;
  risk_tier: "low" | "emerging" | "moderate" | "elevated";
  mobility_subscore: number;
  circadian_subscore: number;
  social_subscore: number;
  digital_subscore: number;
  plain_language_summary: string;
  key_drivers: string[];
  shap_breakdown: SHAPFeatureImpact[];
  recommended_action_tier: string;
  created_at: string;
}

export interface EMACheckin {
  id: number;
  user_id: number;
  checkin_date: string;
  checkin_time_slot: string;
  mood_score: number;
  had_social_contact: boolean;
  social_enjoyment_score: number;
  internet_use_nature: string;
  internet_enjoyment_score: number;
  quick_note?: string;
  created_at: string;
}

export interface BehavioralNudge {
  id: number;
  user_id: number;
  title: string;
  category: "physical" | "social_micro" | "sensory" | "hobby";
  description: string;
  rationale: string;
  graduated_difficulty: number;
  estimated_minutes: number;
  status: "pending" | "completed" | "skipped";
  user_reflection?: string;
  completed_at?: string;
  created_at: string;
}

export interface ConsentSetting {
  id: number;
  youth_id: number;
  caregiver_id?: number;
  share_risk_level: boolean;
  share_plain_language_summary: boolean;
  share_subscores: boolean;
  share_exact_screen_time: boolean;
  share_location_entropy: boolean;
  share_sleep_timing: boolean;
  share_social_counts: boolean;
  share_voice_prosody: boolean;
  share_nudge_completions: boolean;
  allow_caregiver_nudge_invites: boolean;
}

export interface WhatCaregiverSeesPreview {
  youth_name: string;
  risk_level_visible?: string;
  plain_summary_visible?: string;
  subscores_visible?: {
    mobility: number;
    circadian: number;
    social: number;
    digital: number;
  };
  screen_time_visible?: number;
  mobility_entropy_visible?: number;
  sleep_timing_visible?: string;
  social_counts_visible?: Record<string, any>;
  prosody_visible?: Record<string, any>;
  nudges_completed_count?: number;
  redacted_streams: string[];
  trust_index_message: string;
}

export interface VoiceProsody {
  id: number;
  user_id: number;
  sample_date: string;
  pitch_variance_hz: number;
  speech_rate_wpm: number;
  pause_length_ratio: number;
  vocal_energy_db: number;
  affect_flatness_score: number;
  zero_content_guarantee: boolean;
  call_duration_seconds: number;
  prosody_interpretation: string;
}

export interface SupportResource {
  id: number;
  name: string;
  organization_type:
    | "hikikomori_center"
    | "crisis_hotline"
    | "family_support_group"
    | "youth_clinic";
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  operating_hours: string;
  location: string;
  languages: string;
  crisis_ready: string;
}
