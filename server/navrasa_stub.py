"""Optional FastAPI hook. Do not enable until daily_comic_runner.py exists.
POST /api/build-reel?date=YYYY-MM-DD queues a background render.
"""

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pathlib import Path

router = APIRouter(prefix="/api", tags=["Navrasa"])


@router.post("/build-reel")
async def trigger_reel_build(date: str, background_tasks: BackgroundTasks):
    script = Path("./daily_comic_runner.py")
    if not script.exists():
        raise HTTPException(status_code=501, detail="daily_comic_runner.py not mounted")

    def run_build_task():
        import subprocess

        subprocess.run(["python3", str(script)], cwd=str(script.parent), check=False)

    background_tasks.add_task(run_build_task)
    return {"status": "QUEUED", "date": date, "target": f"/dist_{date}/navrasa_reel_{date}.mp4"}
