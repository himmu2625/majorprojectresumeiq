"""
POST /feedback — Candidate Resume Feedback
Text-only analysis (no PDF upload needed).
"""
import logging
from fastapi import APIRouter, Request, HTTPException
from db.models import FeedbackRequest, FeedbackResponse, SectionScores
from ml.scorer import compute_scores
from ml.xai_engine import generate_xai_explanation

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(request: Request, body: FeedbackRequest):
    """Analyze resume text against a job description without file upload."""

    engine = request.app.state.embedding_engine

    # Create simulated sections from plain text
    sections = {
        "skills": "",
        "experience": "",
        "education": "",
        "summary": body.resume_text,  # Treat entire text as summary for embedding
    }

    # Generate embeddings & score
    embeddings = engine.generate_embeddings(sections, body.job_description)
    scores = compute_scores(embeddings, engine)

    # XAI for feedback
    xai = generate_xai_explanation(
        resume_text=body.resume_text,
        jd_text=body.job_description,
        overall_score=scores["overall_score"],
        section_scores=scores["section_scores"],
    )

    # Check for format issues
    format_issues = []
    word_count = len(body.resume_text.split())
    if word_count < 150:
        format_issues.append("Resume is very short — aim for 300-600 words for optimal results.")
    if not any(kw in body.resume_text.lower() for kw in ["experience", "work", "project"]):
        format_issues.append("No experience/work section detected — add professional experience details.")
    if not any(kw in body.resume_text.lower() for kw in ["education", "degree", "university"]):
        format_issues.append("No education section detected — add academic qualifications.")

    return FeedbackResponse(
        overall_score=scores["overall_score"],
        confidence=scores["confidence"],
        section_ratings=SectionScores(**scores["section_scores"]),
        skill_gaps=xai.get("missing_skills", []),
        keyword_suggestions=xai.get("missing_keywords", []),
        action_plan=xai.get("improvement_suggestions", []),
        format_issues=format_issues,
    )
