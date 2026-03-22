"""POST /jobs + GET /jobs — Job Openings CRUD."""
import uuid
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Request
from db.models import JobCreateRequest, JobResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/jobs", response_model=JobResponse, status_code=201)
async def create_job(request: Request, body: JobCreateRequest):
    """Create a new job posting and optionally pre-cache its embedding."""
    job_id = str(uuid.uuid4())[:12]
    now = datetime.now(timezone.utc).isoformat()

    job = JobResponse(
        job_id=job_id,
        title=body.title,
        company=body.company,
        department=body.department,
        description=body.description,
        created_at=now,
        is_active=True,
        screening_count=0,
    )

    db = request.app.state.db
    if db is not None:
        doc = job.model_dump()

        # Pre-cache JD embedding for faster future screenings
        try:
            engine = request.app.state.embedding_engine
            jd_vec = engine.encode(body.description)
            doc["jd_embedding"] = jd_vec.tolist()
        except Exception as e:
            logger.warning(f"JD embedding cache failed: {e}")

        try:
            await db["jobs"].insert_one(doc)
            logger.info(f"Job '{body.title}' created with ID {job_id}")
        except Exception as e:
            logger.error(f"Failed to save job: {e}")

    return job


@router.get("/jobs")
async def list_jobs(request: Request):
    """List all job openings."""
    db = request.app.state.db
    if db is None:
        return []

    cursor = db["jobs"].find(
        {},
        {"_id": 0, "jd_embedding": 0},  # Exclude large embedding array
    ).sort("created_at", -1)

    results = []
    async for doc in cursor:
        results.append(JobResponse(**doc))

    return results
