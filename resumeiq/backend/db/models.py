"""
Pydantic models for request/response validation.
Matches TRD §5.2 API contracts.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# === Request Models ===

class FeedbackRequest(BaseModel):
    resume_text: str = Field(..., min_length=50, max_length=20000)
    job_description: str = Field(..., min_length=50, max_length=5000)


class JobCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    company: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=50, max_length=5000)
    department: str = Field(default="", max_length=100)


# === Response Models ===

class SectionScores(BaseModel):
    skills: float = 0.0
    experience: float = 0.0
    education: float = 0.0
    summary: float = 0.0


class XAIResponse(BaseModel):
    positive_phrases: list[str] = []
    missing_keywords: list[str] = []
    explanation_text: str = ""
    improvement_suggestions: list[str] = []


class ResumeMetadata(BaseModel):
    filename: str = ""
    word_count: int = 0
    sections_found: list[str] = []


class ScreeningResponse(BaseModel):
    screening_id: str
    timestamp: str
    overall_score: float
    confidence: str
    section_scores: SectionScores
    matched_skills: list[str] = []
    missing_skills: list[str] = []
    xai: XAIResponse
    resume_metadata: ResumeMetadata


class HistorySummary(BaseModel):
    screening_id: str
    timestamp: str
    overall_score: float
    confidence: str
    resume_filename: str
    candidate_name: Optional[str] = None
    job_title: Optional[str] = None


class FeedbackResponse(BaseModel):
    overall_score: float
    confidence: str
    section_ratings: SectionScores
    skill_gaps: list[str] = []
    keyword_suggestions: list[str] = []
    action_plan: list[str] = []
    format_issues: list[str] = []


class JobResponse(BaseModel):
    job_id: str
    title: str
    company: str
    department: str = ""
    description: str = ""
    created_at: str
    is_active: bool = True
    screening_count: int = 0


class HealthResponse(BaseModel):
    status: str
    ml_model_loaded: bool
    db_connected: bool
    version: str
