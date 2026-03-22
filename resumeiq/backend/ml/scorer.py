"""
Stage 3 — Similarity Scoring Engine
Computes cosine similarity between resume and JD embeddings.
Normalizes to 0-100 scale with confidence classification.
"""
import logging

logger = logging.getLogger(__name__)


def compute_scores(embeddings: dict, engine) -> dict:
    """
    Compute overall and section-level similarity scores.

    Args:
        embeddings: Output from EmbeddingEngine.generate_embeddings()
        engine: EmbeddingEngine instance (for cosine_sim utility)

    Returns: {
        'overall_score': float (0-100),
        'section_scores': {'skills': float, 'experience': float, ...},
        'confidence': 'High' | 'Medium' | 'Low'
    }
    """
    # Overall score
    overall_raw = engine.cosine_sim(embeddings["resume_full"], embeddings["jd"])
    overall_score = round(overall_raw * 100, 1)

    # Section scores
    section_scores = {}
    jd_vec = embeddings["jd"]
    for section, s_vec in embeddings["sections"].items():
        sim = engine.cosine_sim(s_vec, jd_vec)
        section_scores[section] = round(sim * 100, 1)

    # Ensure all 4 sections exist (default to 0)
    for key in ["skills", "experience", "education", "summary"]:
        if key not in section_scores:
            section_scores[key] = 0.0

    confidence = get_confidence(overall_score)

    logger.info(f"Scoring complete: overall={overall_score}%, confidence={confidence}")
    return {
        "overall_score": overall_score,
        "section_scores": section_scores,
        "confidence": confidence,
    }


def get_confidence(score: float) -> str:
    """Classify confidence based on score thresholds per TRD §4.4."""
    if score >= 70:
        return "High"
    elif score >= 45:
        return "Medium"
    else:
        return "Low"
