"""Global Signals seeder. Metre lock L=0: 16-13-18-16-7. Exactly five acts."""
import math
from datetime import datetime
from typing import Any, Dict, Tuple

PRIME_WEIGHTS = {"year": 7919, "month": 701, "day": 101, "doy": 47, "week": 13, "weekday": 7, "lunar": 19}
RASAS = ["Shringara", "Hasya", "Karuna", "Raudra", "Vira", "Bhayanaka", "Bibhatsa", "Adbhuta", "Santa"]

LOCKED_5_ACT_PANELS = [
    {"index": 1, "act": "Setup", "rasa": "Bhayanaka", "verse": "ghoram ghoram netram pasyet", "trans": "Threshold warning: the algorithmic eye awakens.", "meter": "GGGGGGGG", "syllables": 8, "matras": 16, "target_bpm": 72, "base_freq": 220.0, "jnd_drift_hz": 1.8},
    {"index": 2, "act": "Rise", "rasa": "Hasya", "verse": "hartum na sakyam vittam ca", "trans": "Algorithmic absurdity: liquidity glitched, folly stays.", "meter": "GGLGGLGL", "syllables": 8, "matras": 13, "target_bpm": 96, "base_freq": 247.5, "jnd_drift_hz": 0.5},
    {"index": 3, "act": "Climax", "rasa": "Karuna", "verse": "gitam sada mriyate na kadapi", "trans": "Timeless resonance: melody outliving structural decay.", "meter": "GLGLGLGLGLGL", "syllables": 12, "matras": 18, "target_bpm": 128, "base_freq": 330.0, "jnd_drift_hz": 0.2},
    {"index": 4, "act": "Decel", "rasa": "Vira", "verse": "dhavatu dhavatu laksya-samipam", "trans": "Target sprint: athletic agency accelerating.", "meter": "GLLGLLGLLGG", "syllables": 11, "matras": 16, "target_bpm": 100, "base_freq": 293.33, "jnd_drift_hz": 0.8},
    {"index": 5, "act": "Settle", "rasa": "Santa", "verse": "jagati samatara", "trans": "Universal calm: dynamic equilibrium restored.", "meter": "LLLLLLL", "syllables": 7, "matras": 7, "target_bpm": 60, "base_freq": 220.0, "jnd_drift_hz": 0.0},
]


def calculate_seed(date: datetime) -> int:
    doy = date.timetuple().tm_yday
    week = date.isocalendar()[1]
    weekday = date.weekday()
    lunar_phase = doy % 29.5
    return (
        date.year * PRIME_WEIGHTS["year"]
        + date.month * PRIME_WEIGHTS["month"]
        + date.day * PRIME_WEIGHTS["day"]
        + doy * PRIME_WEIGHTS["doy"]
        + week * PRIME_WEIGHTS["week"]
        + weekday * PRIME_WEIGHTS["weekday"]
        + int(lunar_phase * PRIME_WEIGHTS["lunar"])
    ) % (2**32)


def calculate_rasas(seed: int) -> Dict[str, float]:
    phi = (1 + math.sqrt(5)) / 2
    raw = [math.sin((seed % 100000) * (i + 1) * phi + (i * math.pi) / 9.0) + 1.0 for i in range(9)]
    total = sum(raw)
    return {RASAS[i]: round((raw[i] / total) * 100, 2) for i in range(9)}


def calculate_psychoacoustics(rasas: Dict[str, float]) -> Dict[str, Any]:
    brightness = (
        rasas.get("Vira", 0) * 1.5 + rasas.get("Raudra", 0) * 2.0 + rasas.get("Hasya", 0) * 1.2
        - (rasas.get("Karuna", 0) * 1.3 + rasas.get("Santa", 0) * 1.8 + rasas.get("Bhayanaka", 0) * 0.8)
    )
    spectral = round(max(600.0, min(4500.0, 1800.0 + brightness * 25.0)), 2)
    volatility = rasas.get("Bhayanaka", 0) + rasas.get("Raudra", 0)
    calm = rasas.get("Santa", 0)
    dyn = round(max(6.0, min(24.0, 12.0 + (volatility - calm) * 0.25)), 1)
    return {
        "spectral_centroid_hz": spectral,
        "dynamic_range_db": dyn,
        "compression_ratio": "4:1" if dyn < 10.0 else "1.5:1",
        "spatial_reverb_decay_sec": round(1.2 + rasas.get("Santa", 0) / 20.0, 2),
    }


def get_signal_ranks(rasas: Dict[str, float]) -> Tuple[str, str, str]:
    ranked = sorted(rasas.items(), key=lambda x: x[1], reverse=True)
    return ranked[0][0], ranked[1][0], ranked[2][0]


def verification_loss() -> int:
    loss = 0
    for p in LOCKED_5_ACT_PANELS:
        matras = sum(2 if c == "G" else 1 for c in p["meter"])
        loss += abs(matras - p["matras"]) + abs(len(p["meter"]) - p["syllables"])
    return loss
