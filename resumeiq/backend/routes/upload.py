"""
POST /upload — Primary Screening Endpoint
Accepts PDF resume + job description, runs full ML pipeline, stores result.
"""
import os
import uuid
import hashlib
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException
from db.models import ScreeningResponse, SectionScores, XAIResponse, ResumeMetadata
from ml.pdf_parser import extract_resume_data
from ml.scorer import compute_scores
from ml.xai_engine import generate_xai_explanation

logger = logging.getLogger(__name__)
router = APIRouter()

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", "5")) * 1024 * 1024  # bytes


@router.post("/upload", response_model=ScreeningResponse)
async def upload_resume(
    request: Request,
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    job_title: str = Form(default=""),
    company: str = Form(default=""),
):
    """Full screening pipeline: PDF → parse → embed → score → explain → store."""

    # === Validation ===
    if not resume_file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF accepted.")

    pdf_bytes = await resume_file.read()
    if len(pdf_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")

    if len(job_description) < 50:
        raise HTTPException(status_code=400, detail="Job description too short. Add more detail (min 50 characters).")

    if len(job_description) > 5000:
        raise HTTPException(status_code=400, detail="Job description too long. Maximum 5000 characters.")

    # === Stage 1: PDF Parsing ===
    try:
        resume_data = extract_resume_data(pdf_bytes, request.app.state.nlp)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # === Stage 2: Embeddings ===
    engine = request.app.state.embedding_engine
    embeddings = engine.generate_embeddings(resume_data["sections"], job_description)

    # === Stage 3: Scoring ===
    scores = compute_scores(embeddings, engine)

    # === Stage 4: XAI ===
    xai_result = generate_xai_explanation(
        resume_text=resume_data["full_text"],
        jd_text=job_description,
        overall_score=scores["overall_score"],
        section_scores=scores["section_scores"],
    )

    # === Build Response ===
    screening_id = str(uuid.uuid4())[:12]
    timestamp = datetime.now(timezone.utc).isoformat()
    file_hash = hashlib.md5(pdf_bytes).hexdigest()

    result = ScreeningResponse(
        screening_id=screening_id,
        timestamp=timestamp,
        overall_score=scores["overall_score"],
        confidence=scores["confidence"],
        section_scores=SectionScores(**scores["section_scores"]),
        matched_skills=xai_result.get("matched_skills", []),
        missing_skills=xai_result.get("missing_skills", []),
        xai=XAIResponse(
            positive_phrases=xai_result["positive_phrases"],
            missing_keywords=xai_result["missing_keywords"],
            explanation_text=xai_result["explanation_text"],
            improvement_suggestions=xai_result["improvement_suggestions"],
        ),
        resume_metadata=ResumeMetadata(
            filename=resume_file.filename,
            word_count=resume_data["word_count"],
            sections_found=resume_data["sections_found"],
        ),
    )

    # === Store to MongoDB (async, non-blocking) ===
    db = request.app.state.db
    doc = result.model_dump()
    
    # Save to memory cache for local testing without DB
    temp_store = getattr(request.app.state, "temp_results_store", {})
    temp_store[screening_id] = doc
    request.app.state.temp_results_store = temp_store
    
    if db is not None:
        try:
            doc["job_id"] = ""  # Optional: link to jobs collection
            doc["job_title"] = job_title
            doc["company"] = company
            doc["resume_file_hash"] = file_hash
            doc["is_shortlisted"] = False
            await db["screenings"].insert_one(doc)
            logger.info(f"Screening {screening_id} stored to MongoDB")
        except Exception as e:
            logger.error(f"MongoDB write failed: {e}")
            # Don't fail the request if DB write fails

    logger.info(
        f"Screening complete: {resume_file.filename} → score={scores['overall_score']}%, "
        f"confidence={scores['confidence']}"
    )
    return result
