"""GET /history — Screening History."""
import logging
from fastapi import APIRouter, Request, Query
from db.models import HistorySummary

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/history")
async def get_history(
    request: Request,
    limit: int = Query(default=20, ge=1, le=100),
    job_id: str = Query(default=None),
):
    """Return paginated screening history from MongoDB."""
    db = request.app.state.db
    if db is None:
        return []

    query = {}
    if job_id:
        query["job_id"] = job_id

    cursor = db["screenings"].find(
        query,
        {
            "screening_id": 1,
            "timestamp": 1,
            "overall_score": 1,
            "confidence": 1,
            "resume_metadata.filename": 1,
            "job_title": 1,
            "_id": 0,
        },
    ).sort("timestamp", -1).limit(limit)

    results = []
    async for doc in cursor:
        results.append(HistorySummary(
            screening_id=doc.get("screening_id", ""),
            timestamp=doc.get("timestamp", ""),
            overall_score=doc.get("overall_score", 0),
            confidence=doc.get("confidence", "Low"),
            resume_filename=doc.get("resume_metadata", {}).get("filename", "unknown.pdf"),
            job_title=doc.get("job_title", ""),
        ))

    return results
