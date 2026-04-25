"""
POST /bulk-upload — Bulk Resume Screening Endpoint
Accepts multiple PDF resumes + a single job description.
Runs embed+score pipeline on each file (no per-file XAI for speed).
Returns a ranked list sorted by overall_score descending.
"""
import os
import uuid
import logging
from typing import List

from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException
from db.models import (
    BulkScreeningResult,
    BulkUploadResponse,
    SectionScores,
)
from ml.pdf_parser import extract_resume_data
from ml.scorer import compute_scores
from ml.xai_engine import generate_xai_explanation

logger = logging.getLogger(__name__)
router = APIRouter()

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", "5")) * 1024 * 1024
MAX_BULK_FILES = int(os.getenv("MAX_BULK_FILES", "20"))


@router.post("/bulk-upload", response_model=BulkUploadResponse)
async def bulk_upload_resumes(
    request: Request,
    resume_files: List[UploadFile] = File(...),
    job_description: str = Form(...),
    job_title: str = Form(default=""),
    company: str = Form(default=""),
):
    """
    Bulk screening pipeline:
    For each PDF: parse → embed → score → lightweight skill extraction.
    Results are sorted by overall_score descending with integer ranks.
    """

    # === Validation ===
    if not resume_files:
        raise HTTPException(status_code=400, detail="No files uploaded.")

    if len(resume_files) > MAX_BULK_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Too many files. Maximum allowed is {MAX_BULK_FILES}.",
        )

    if len(job_description) < 50:
        raise HTTPException(
            status_code=400,
            detail="Job description too short. Add more detail (min 50 characters).",
        )

    if len(job_description) > 5000:
        raise HTTPException(
            status_code=400,
            detail="Job description too long. Maximum 5000 characters.",
        )

    engine = request.app.state.embedding_engine
    nlp = request.app.state.nlp

    # Pre-embed the JD once (reused for all resumes — big speed win)
    jd_embedding = engine.encode(job_description)

    raw_results = []
    failed_count = 0

    for resume_file in resume_files:
        filename = resume_file.filename or "unknown.pdf"

        # Validate file type
        if not filename.lower().endswith(".pdf"):
            logger.warning(f"Skipping non-PDF file: {filename}")
            failed_count += 1
            continue

        try:
            pdf_bytes = await resume_file.read()

            if len(pdf_bytes) > MAX_FILE_SIZE:
                logger.warning(f"Skipping oversized file: {filename}")
                failed_count += 1
                continue

            # === Stage 1: PDF Parsing ===
            resume_data = extract_resume_data(pdf_bytes, nlp)

            # === Stage 2: Embeddings (reuse pre-computed JD embedding) ===
            resume_full_text = " ".join(v for v in resume_data["sections"].values() if v)
            resume_embedding = engine.encode(resume_full_text)

            # Section-level embeddings
            section_embeddings = {}
            for section, text in resume_data["sections"].items():
                if text and len(text.split()) > 5:
                    section_embeddings[section] = engine.encode(text)

            embeddings = {
                "resume_full": resume_embedding,
                "jd": jd_embedding,
                "sections": section_embeddings,
            }

            # === Stage 3: Scoring ===
            scores = compute_scores(embeddings, engine)

            # === Stage 4: Lightweight Skill Extraction (no full XAI) ===
            xai_result = generate_xai_explanation(
                resume_text=resume_data["full_text"],
                jd_text=job_description,
                overall_score=scores["overall_score"],
                section_scores=scores["section_scores"],
            )

            screening_id = str(uuid.uuid4())[:12]

            # Store to memory cache so individual results are viewable
            result_doc = {
                "screening_id": screening_id,
                "timestamp": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
                "overall_score": scores["overall_score"],
                "confidence": scores["confidence"],
                "section_scores": scores["section_scores"],
                "matched_skills": xai_result.get("matched_skills", []),
                "missing_skills": xai_result.get("missing_skills", []),
                "xai": {
                    "positive_phrases": xai_result.get("positive_phrases", []),
                    "missing_keywords": xai_result.get("missing_keywords", []),
                    "explanation_text": xai_result.get("explanation_text", ""),
                    "improvement_suggestions": xai_result.get("improvement_suggestions", []),
                },
                "resume_metadata": {
                    "filename": filename,
                    "word_count": resume_data.get("word_count", 0),
                    "sections_found": resume_data.get("sections_found", []),
                },
                "job_title": job_title,
                "company": company,
            }

            temp_store = getattr(request.app.state, "temp_results_store", {})
            temp_store[screening_id] = result_doc
            request.app.state.temp_results_store = temp_store

            # Optional MongoDB persistence
            db = request.app.state.db
            if db is not None:
                try:
                    await db["screenings"].insert_one({**result_doc, "is_bulk": True})
                except Exception as e:
                    logger.error(f"MongoDB write failed for {filename}: {e}")

            raw_results.append(
                BulkScreeningResult(
                    screening_id=screening_id,
                    filename=filename,
                    overall_score=scores["overall_score"],
                    confidence=scores["confidence"],
                    section_scores=SectionScores(**scores["section_scores"]),
                    matched_skills=xai_result.get("matched_skills", []),
                    missing_skills=xai_result.get("missing_skills", []),
                )
            )

            logger.info(f"Bulk: {filename} → score={scores['overall_score']}%")

        except Exception as e:
            logger.error(f"Failed to process {filename}: {e}")
            failed_count += 1
            continue

    if not raw_results:
        raise HTTPException(
            status_code=422,
            detail="No resumes could be processed. Check file formats.",
        )

    # Sort descending by score and assign ranks
    ranked = sorted(raw_results, key=lambda r: r.overall_score, reverse=True)
    for idx, item in enumerate(ranked, start=1):
        item.rank = idx

    logger.info(
        f"Bulk screening complete: {len(ranked)} processed, {failed_count} failed"
    )

    return BulkUploadResponse(
        results=ranked,
        job_title=job_title,
        company=company,
        total_processed=len(ranked),
        failed=failed_count,
    )
