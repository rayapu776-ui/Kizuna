# Kizuna (絆 — "Bond")

### A Passive Early-Warning + Family-Bridging Platform for Social Withdrawal Risk

#### 社会的孤立・ひきこもり早期支援および家族対話架橋基盤

> Purpose-built for _hikikomori_-pattern social withdrawal in young people, with generalizability to elderly isolation.
> Built on evidence-based passive sensing, interpretable machine learning (Random Forest + TreeSHAP), and the clinical **CRAFT / MHFA** caregiver framework.
> Designed with modern Japanese aesthetic principles (_Ma_ 間, _Shibui_ 渋い, _Sumi_ 墨, and _Ai-iro_ 藍色).

---

## 🌸 Japanese-Inspired Modern Design System (和の美意識)

Kizuna's 2026 user interface is designed with authentic Japanese visual harmony:

- **Ma (間 - Negative Space & Serenity)**: Generous, purposeful breathing room that avoids sensory overload and cognitive clutter.
- **Sumi & Aoi Color Palette**: Deep charcoal ink surfaces (`#060911`, `#0a0e18`), traditional Japanese Indigo (_Ai-iro_ 藍色), gentle Bamboo Sage (_Uguisu_ 鶯色), soft Cherry Blossom (_Sakura_ 桜色), and warm Rice Amber (_Kohaku_ 琥珀色).
- **Hanko Seal Accents (判子)**: Minimalist Japanese seal badges (`[ 絆 KIZUNA ]`, `[ 守護 PROTECT ]`, `[ 安定 LOW RISK ]`, `[ 自己主権合意 ]`).
- **Modern Sidebar + Topbar Architecture**: A professional SaaS product dashboard featuring collapsible sidebar navigation, Japanese breadcrumbs, live model status indicators, and an instant persona switcher.

---

## 🌟 Why Kizuna Wins (Ethical & Architectural Positioning)

Kizuna deliberately avoids the two primary failure modes in withdrawal-focused AI:

1. **The Avoidance-Enabling AI "Companion"**: Virtual chatbots and artificial friends replace real human connection, create unhealthy synthetic dependency, and deepen psychological isolation. **Kizuna explicitly refuses to be a chatbot companion**.
2. **The Black-Box Panic Alert**: Surveillance systems that send alarmist _"Your child is in danger"_ alerts trigger parental panic, hostile confrontations, and youth secrecy. **Kizuna uses the CRAFT / MHFA framework to coach parents on non-judgmental listening and positive reinforcement.**

---

## 🏛️ System Architecture

### 1. Passive Signal Layer (Edge Feature Fusion)

- **Smartphone**: Location entropy, radius of gyration (km), home confinement ratio, total screen time, late-night screen displacement (00:00–05:00), app-switching fragmentation rate, outbound/inbound call and text counts.
- **Wearables**: Circadian sleep midpoint shifts (day/night inversion), sleep quality index, daily step count.
- **Voice / Affect Prosody Sensing**: Paralinguistic prosody only (pitch variance, speech rate, pause length ratio, vocal energy). **Spoken content is never recorded or transcribed.**

### 2. Feature + Fusion Layer (Explainable AI)

- **Model**: Interpretable **Random Forest Classifier** (never an inscrutable black box).
- **Explainability**: Live **TreeSHAP-style attribution engine** that translates mathematical weights into human-readable plain-language explanations:
  > _"Noticeable pattern: Mobility radius has decreased by 42% over the past 14 days, while late-night screen use elevated to 3.8 hours."_

### 3. EMA-Informed Nudge Engine (Behavioral Activation)

- **10-Second Daily Check-in**: Actionable daily levers (mood energy, "did you have social contact today?", and internet use nature).
- **Pattern-Triggered Micro-Interventions**: Grounded real-world tasks (e.g., _"Open your window for 3 minutes"_, _"10-minute neighborhood walk"_, _"Message one friend with a photo"_). Strictly non-virtual.

### 4. Human Bridge Layer (CRAFT & MHFA)

- Built on **Community Reinforcement and Family Training (CRAFT)** and **Mental Health First Aid (MHFA)**.
- **5-Stage Guidance**: Assess without alarm, Listen non-judgmentally, Give information, Encourage help, Encourage support.
- **"Say This, Not That"**: Interactive script comparisons preventing accusatory confrontations.
- **Safe Gentle Invitations**: Parents can send zero-pressure meal or outing invitations without demanding replies.

### 5. Consent-by-Design & Relational Trust

- Granular opt-in switches for every sensor stream.
- **"What My Caregiver Sees" Live Mirror**: Youth can preview the exact de-escalated, aggregated view shown to parents, ensuring trust and preventing covert monitoring.

### 6. Population Generalization: Elderly Isolation Mode

- Demonstrates how Kizuna re-tunes feature baselines for elderly adults:
  - De-emphasizes screen hours.
  - Weights physical mobility collapse (45%) and communication silence (35%).
  - Adapts to adult-child caregiver dynamics.

### 7. Support Directory & Warm Hand-off

- Verified database of Japanese & international hikikomori centers (Shinken Tokyo, KHJ Family Association, TELL Lifeline, Kakehashi).
- 1-click **Clinically Safe Warm Hand-off Brief** generator to ease initial intake without repeating past trauma.

---

## 🐳 Docker Production Setup

You can run the complete full-stack Kizuna application with a single command using Docker Compose:

```bash
docker compose up --build
```

- **Frontend UI**: [http://localhost:5173](http://localhost:5173) (or `http://localhost`)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Database**: Persistent SQLite volume mounted at `sqlite_data`.

To stop the containers:

```bash
docker compose down
```

---

## 🚀 Local Development Quick Start

### Prerequisites

- Python 3.10+
- Node.js v18+ and npm

### One-Click Launch (Windows PowerShell)

```powershell
.\start_kizuna.ps1
```

Or run services individually:

#### 1. Backend Server

```powershell
.\run_backend.ps1
# API runs at http://127.0.0.1:8000
# Interactive Swagger docs: http://127.0.0.1:8000/docs
```

#### 2. Frontend Application

```powershell
.\run_frontend.ps1
# UI runs at http://localhost:5173
```

---

## 🎭 Pre-Configured Stakeholder Personas

Switch between personas using the top-right persona dropdown to evaluate different stakeholder perspectives:

| Persona                | Role      | Context                                                                 |
| ---------------------- | --------- | ----------------------------------------------------------------------- |
| **Ren Sato (19)**      | Youth     | Emerging Hikikomori trajectory with 30 days of longitudinal sensor data |
| **Keiko Sato (48)**    | Caregiver | Ren's mother using CRAFT/MHFA guidance and de-escalated status          |
| **Dr. Takahashi (52)** | Clinician | Clinical specialist handling support centers and warm hand-offs         |
| **Chiyo Tanaka (74)**  | Elderly   | Illustrating the adapted geriatric isolation model                      |

---

## 🧪 Automated Test Suite

Run the backend test suite covering authentication, ML scoring, SHAP plain-language generation, and consent isolation:

```powershell
$env:PYTHONPATH = "."
.\backend\venv\Scripts\python -m pytest backend\tests
```

_(All 14 unit and integration tests passing)._
