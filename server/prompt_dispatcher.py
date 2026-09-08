"""Dispatch 5-cell prompts. Never emit a 2x3 sixth box."""
from datetime import datetime
from typing import Any, Dict
from global_signals_engine import (
    LOCKED_5_ACT_PANELS,
    calculate_psychoacoustics,
    calculate_rasas,
    calculate_seed,
    get_signal_ranks,
    verification_loss,
)

STYLE_SPECIFICATIONS = {
    "comic_panel": {
        "style": "Graphic novel comic strip, 5-panel sequential narrative, bold ink, Ben-Day dots",
        "format": "16:9",
        "grid_layout": "Asymmetric 5-box grid (top 2, bottom 3). Exactly 5 panels. No sixth cell. No duplicate acts.",
        "color_space": "CMYK pop with deep black shadows",
    },
    "cinematic": {
        "style": "35mm anamorphic still, atmospheric haze, film grain",
        "format": "2.35:1",
        "grid_layout": "One wide frame, five focal points left to right. Not a 2x3 grid.",
        "color_space": "Teal and amber split tone",
    },
    "academic": {
        "style": "Scientific plate, vector annotations, scansion waveforms",
        "format": "1:1",
        "grid_layout": "Five modular segments only",
        "color_space": "Slate and gold traces",
    },
    "cyberpunk": {
        "style": "Neon-noir, wet asphalt, holographic HUD",
        "format": "16:9",
        "grid_layout": "Five vertical split frames, not a 2x3 page",
        "color_space": "Cyan and magenta on obsidian",
    },
    "retro_wave": {
        "style": "1984 arcade, wireframe horizon, CRT glow",
        "format": "16:9",
        "grid_layout": "Five sequential viewports",
        "color_space": "Purple, pink, sunset orange",
    },
}


def generate_global_signal_prompts(date_str: str, style_key: str = "comic_panel") -> Dict[str, Any]:
    assert verification_loss() == 0
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    seed = calculate_seed(dt)
    rasas = calculate_rasas(seed)
    dom, sec, tert = get_signal_ranks(rasas)
    psycho = calculate_psychoacoustics(rasas)
    spec = STYLE_SPECIFICATIONS.get(style_key, STYLE_SPECIFICATIONS["comic_panel"])
    panels = []
    for p in LOCKED_5_ACT_PANELS:
        panels.append({
            "panel": p["index"],
            "act": p["act"],
            "rasa": p["rasa"],
            "bpm": p["target_bpm"],
            "scansion": p["meter"],
            "matras": p["matras"],
            "audio_carrier_hz": round(p["base_freq"] + p["jnd_drift_hz"], 2),
            "prompt": (
                f"/imagine prompt: Panel {p['index']} of 5 [{p['act']} - {p['rasa']}]: {p['trans']} "
                f"Sanskrit anchor: '{p['verse']}'. Atmosphere: {spec['style']}. "
                f"Technical: {spec['color_space']}, 8k --ar {spec['format']} --v 6.0"
            ),
        })
    master = (
        f"/imagine prompt: Complete 5-panel sequential page for Global Signal #{seed} on {date_str}. "
        f"Composition: {spec['grid_layout']} "
        f"Panel 1 Setup Bhayanaka bunker red alerts. "
        f"Panel 2 Rise Hasya glitching servers. "
        f"Panel 3 Climax Karuna golden gramophone in ruins. "
        f"Panel 4 Decel Vira athletes on salt flats. "
        f"Panel 5 Settle Santa figure over still water. "
        f"Style: {spec['style']}. Palette: {spec['color_space']}. "
        f"Crisp borders, captions under each act, exactly five boxes, no duplicate Vira, no copied Panel 1 "
        f"--ar {spec['format']} --v 6.0"
    )
    return {
        "date": date_str,
        "seed": seed,
        "panel_count": 5,
        "grid": "2+3 or 5-across, never 2x3",
        "dominant_signal": dom,
        "secondary_signal": sec,
        "tertiary_signal": tert,
        "distribution": rasas,
        "psychoacoustics": psycho,
        "master_prompt": master,
        "panel_prompts": panels,
        "L": 0,
    }
