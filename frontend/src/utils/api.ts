import axios from "axios";
import {
  User,
  TelemetryDaily,
  TelemetryDifferential,
  RiskAssessment,
  EMACheckin,
  BehavioralNudge,
  ConsentSetting,
  WhatCaregiverSeesPreview,
  VoiceProsody,
  SupportResource,
} from "../types";

const API_BASE = "/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set bearer token from local storage if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("kizuna_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth & Roles
  async getMe(): Promise<User> {
    const res = await client.get<User>("/auth/me");
    return res.data;
  },
  async switchDemoRole(
    role: string,
  ): Promise<{ access_token: string; user: User }> {
    const res = await client.get(`/auth/switch-demo-role/${role}`);
    localStorage.setItem("kizuna_token", res.data.access_token);
    return res.data;
  },

  // Telemetry
  async getTelemetryHistory(days = 30): Promise<TelemetryDaily[]> {
    const res = await client.get<TelemetryDaily[]>(
      `/telemetry/history?days=${days}`,
    );
    return res.data;
  },
  async getDifferentials(): Promise<TelemetryDifferential[]> {
    const res = await client.get<TelemetryDifferential[]>(
      "/telemetry/differentials",
    );
    return res.data;
  },
  async logTelemetry(data: Partial<TelemetryDaily>): Promise<TelemetryDaily> {
    const res = await client.post<TelemetryDaily>("/telemetry/log", data);
    return res.data;
  },

  // Risk & Explainability (Random Forest & SHAP)
  async getLatestRisk(): Promise<RiskAssessment> {
    const res = await client.get<RiskAssessment>("/risk/latest");
    return res.data;
  },
  async simulateRisk(payload: any): Promise<any> {
    const res = await client.post("/risk/simulate", payload);
    return res.data;
  },

  // EMA Check-ins & Nudges
  async submitEMACheckin(payload: {
    mood_score: number;
    had_social_contact: boolean;
    social_enjoyment_score: number;
    internet_use_nature: string;
    internet_enjoyment_score: number;
    quick_note?: string;
  }): Promise<EMACheckin> {
    const res = await client.post<EMACheckin>("/ema/checkin", payload);
    return res.data;
  },
  async getNudges(statusFilter?: string): Promise<BehavioralNudge[]> {
    const url = statusFilter
      ? `/ema/nudges?status_filter=${statusFilter}`
      : "/ema/nudges";
    const res = await client.get<BehavioralNudge[]>(url);
    return res.data;
  },
  async updateNudge(
    nudgeId: number,
    status: "completed" | "skipped",
    reflection?: string,
  ): Promise<BehavioralNudge> {
    const res = await client.patch<BehavioralNudge>(`/ema/nudges/${nudgeId}`, {
      status,
      user_reflection: reflection,
    });
    return res.data;
  },
  async getEMAHistory(): Promise<EMACheckin[]> {
    const res = await client.get<EMACheckin[]>("/ema/history");
    return res.data;
  },

  // Caregiver CRAFT Portal
  async getCaregiverDashboardView(): Promise<any> {
    const res = await client.get("/caregiver/dashboard-view");
    return res.data;
  },
  async sendCaregiverInvite(
    inviteType: string,
    message?: string,
  ): Promise<any> {
    const res = await client.post("/caregiver/send-gentle-invite", null, {
      params: { invite_type: inviteType, custom_message: message },
    });
    return res.data;
  },

  // Consent & Transparency
  async getConsentSettings(): Promise<ConsentSetting> {
    const res = await client.get<ConsentSetting>("/consent/settings");
    return res.data;
  },
  async updateConsentSettings(
    settings: Partial<ConsentSetting>,
  ): Promise<ConsentSetting> {
    const res = await client.put<ConsentSetting>("/consent/settings", settings);
    return res.data;
  },
  async getWhatCaregiverSees(): Promise<WhatCaregiverSeesPreview> {
    const res = await client.get<WhatCaregiverSeesPreview>(
      "/consent/caregiver-preview",
    );
    return res.data;
  },

  // Voice Prosody
  async getLatestProsody(): Promise<VoiceProsody> {
    const res = await client.get<VoiceProsody>("/prosody/latest");
    return res.data;
  },
  async simulateProsody(params: {
    pitch_variance_hz: number;
    speech_rate_wpm: number;
    pause_length_ratio: number;
    vocal_energy_db: number;
  }): Promise<any> {
    const res = await client.post("/prosody/simulate", params);
    return res.data;
  },

  // Support Resources & Warm Hand-off
  async getSupportResources(): Promise<SupportResource[]> {
    const res = await client.get<SupportResource[]>("/resources/");
    return res.data;
  },
  async createWarmHandoff(
    resourceId: number,
    userId: number,
    notes?: string,
  ): Promise<any> {
    const res = await client.post("/resources/warm-handoff", {
      resource_id: resourceId,
      user_id: userId,
      notes_from_user_or_caregiver: notes,
    });
    return res.data;
  },
};
