"""GET /health — System health check."""
from fastapi import APIRouter, Request
from db.models import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(request: Request):
    db = request.app.state.db
    engine = getattr(request.app.state, "embedding_engine", None)

    return HealthResponse(
        status="ok",
        ml_model_loaded=engine is not None,
        db_connected=db is not None,
        version="1.0.0",
    )
