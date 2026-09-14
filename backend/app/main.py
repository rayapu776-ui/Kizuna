"""
Kizuna (絆) Full-Stack Application Server.
Passive early-warning + family-bridging platform for social withdrawal risk.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base
from backend.app.api import (
    auth,
    telemetry,
    risk_engine,
    ema_nudges,
    caregiver,
    consent,
    prosody,
    resources
)

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kizuna (絆) API Platform",
    description="Passive early-warning and CRAFT/MHFA family-bridging platform for social withdrawal (hikikomori & elderly isolation).",
    version="2.0.26"
)

# Enable CORS for local and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include core routers
app.include_router(auth.router)
app.include_router(telemetry.router)
app.include_router(risk_engine.router)
app.include_router(ema_nudges.router)
app.include_router(caregiver.router)
app.include_router(consent.router)
app.include_router(prosody.router)
app.include_router(resources.router)

@app.get("/")
def root():
    return {
        "platform": "Kizuna (絆)",
        "purpose": "A Passive Early-Warning + Family-Bridging Platform for Social Withdrawal Risk",
        "ethical_principles": [
            "Never an avoidance-enabling AI companion",
            "Interpretable Random Forest & SHAP (not a black box)",
            "Grounded non-virtual behavioral activation",
            "CRAFT/MHFA non-alarmist caregiver bridge",
            "Strict zero audio content retention guarantee (affect-from-prosody only)"
        ],
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "kizuna-backend"}

