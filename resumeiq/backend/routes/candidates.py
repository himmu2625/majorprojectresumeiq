import logging
from fastapi import APIRouter, Request, Query
from typing import List
from db.models import ScreeningResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/candidates", response_model=List[ScreeningResponse])
async def get_candidates(request: Request, job_id: str = Query(default=None)):
    """Fetch all candidate screening results."""
    # Check memory cache first (for local testing without MongoDB)
    temp_store = getattr(request.app.state, "temp_results_store", {})
    results = list(temp_store.values())

    # Check MongoDB
    db = request.app.state.db
    if db is not None:
        query = {}
        if job_id:
            query["job_id"] = job_id
            
        cursor = db["screenings"].find(query, {"_id": 0}).sort("timestamp", -1)
        async for doc in cursor:
            # Avoid duplicate if it's already in memory cache
            if doc["screening_id"] not in temp_store:
                results.append(doc)

    return results
