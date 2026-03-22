import logging
from fastapi import APIRouter, Request, HTTPException
from db.models import ScreeningResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/results/{screening_id}", response_model=ScreeningResponse)
async def get_result(request: Request, screening_id: str):
    """Fetch a specific screening result."""
    # First check memory cache (for when DB is not connected)
    temp_store = getattr(request.app.state, "temp_results_store", {})
    if screening_id in temp_store:
        return temp_store[screening_id]

    # Check MongoDB
    db = request.app.state.db
    if db is not None:
        doc = await db["screenings"].find_one({"screening_id": screening_id}, {"_id": 0})
        if doc:
            return doc
            
    # Not found
    raise HTTPException(status_code=404, detail="Screening result not found")
