"""
Stage 4 — XAI (Explainable AI) Engine
Uses TF-IDF keyword analysis to identify matched/missing skills
and generate plain-English explanations.
"""
import os
import logging
from sklearn.feature_extraction.text import TfidfVectorizer

logger = logging.getLogger(__name__)

MAX_POSITIVE = int(os.getenv("MAX_POSITIVE_PHRASES", "5"))
MAX_MISSING = int(os.getenv("MAX_MISSING_KEYWORDS", "5"))


def generate_xai_explanation(
    resume_text: str,
    jd_text: str,
    overall_score: float,
    section_scores: dict,
) -> dict:
    """
    Generate explainable AI output using TF-IDF keyword analysis.

    Returns: {
        'positive_phrases': [str],
        'missing_keywords': [str],
        'matched_skills': [str],
        'missing_skills': [str],
        'explanation_text': str,
        'improvement_suggestions': [str]
    }
    """
    # Build TF-IDF vectors to find important terms
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        max_features=500,
        stop_words="english",
        min_df=1,
    )

    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        feature_names = vectorizer.get_feature_names_out()

        # Get non-zero feature indices for resume and JD
        resume_features = set(tfidf_matrix[0].nonzero()[1])
        jd_features = set(tfidf_matrix[1].nonzero()[1])

        # Matched = intersection, Missing = in JD but not in resume
        matched_indices = resume_features & jd_features
        missing_indices = jd_features - resume_features

        # Sort by TF-IDF weight in JD (most important first)
        jd_weights = tfidf_matrix[1].toarray()[0]

        matched_terms = sorted(
            [(feature_names[i], jd_weights[i]) for i in matched_indices],
            key=lambda x: x[1],
            reverse=True,
        )
        missing_terms = sorted(
            [(feature_names[i], jd_weights[i]) for i in missing_indices],
            key=lambda x: x[1],
            reverse=True,
        )

        # Extract top terms
        positive_phrases = [t[0] for t in matched_terms[:MAX_POSITIVE]]
        missing_keywords = [t[0] for t in missing_terms[:MAX_MISSING]]

        # Skills are typically single words or bigrams
        matched_skills = [t[0] for t in matched_terms if len(t[0].split()) <= 2][:10]
        missing_skills = [t[0] for t in missing_terms if len(t[0].split()) <= 2][:10]

    except Exception as e:
        logger.warning(f"TF-IDF analysis failed: {e}, using fallback")
        positive_phrases = []
        missing_keywords = []
        matched_skills = []
        missing_skills = []

    # Generate explanation text
    explanation_text = _generate_explanation(
        overall_score, section_scores, positive_phrases, missing_keywords
    )

    # Generate improvement suggestions
    suggestions = _generate_suggestions(
        overall_score, missing_keywords, missing_skills, section_scores
    )

    return {
        "positive_phrases": positive_phrases,
        "missing_keywords": missing_keywords,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "explanation_text": explanation_text,
        "improvement_suggestions": suggestions,
    }


def _generate_explanation(
    score: float,
    section_scores: dict,
    matched: list,
    missing: list,
) -> str:
    """Generate a plain-English explanation paragraph."""
    if score >= 70:
        strength = "strong"
        assessment = "This resume demonstrates excellent alignment with the job requirements."
    elif score >= 45:
        strength = "moderate"
        assessment = "This resume shows partial alignment with the position. There are notable strengths but also significant gaps."
    else:
        strength = "weak"
        assessment = "This resume has limited alignment with the job requirements. Major areas need improvement."

    parts = [assessment]

    # Highlight strongest section
    if section_scores:
        best_section = max(section_scores, key=section_scores.get)
        best_score = section_scores[best_section]
        if best_score > 50:
            parts.append(
                f"The {best_section} section showed the strongest match at {best_score}%."
            )

    # Mention matched terms
    if matched:
        matched_str = ", ".join(f'"{m}"' for m in matched[:3])
        parts.append(f"Key matching factors include {matched_str}.")

    # Mention gaps
    if missing:
        missing_str = ", ".join(f'"{m}"' for m in missing[:3])
        parts.append(
            f"Notable gaps were found in areas such as {missing_str}, which are emphasized in the job description."
        )

    # Weakest section
    if section_scores:
        worst_section = min(section_scores, key=section_scores.get)
        worst_score = section_scores[worst_section]
        if worst_score < 50 and worst_section != best_section:
            parts.append(
                f"The {worst_section} section scored lowest at {worst_score}% and would benefit from targeted improvements."
            )

    return " ".join(parts)


def _generate_suggestions(
    score: float,
    missing_keywords: list,
    missing_skills: list,
    section_scores: dict,
) -> list:
    """Generate actionable improvement suggestions."""
    suggestions = []

    # Keyword-based suggestions
    if missing_keywords:
        kw_list = ", ".join(missing_keywords[:3])
        suggestions.append(
            f"Add experience or certifications related to: {kw_list}"
        )

    # Section-specific suggestions
    if section_scores:
        for section, score_val in sorted(section_scores.items(), key=lambda x: x[1]):
            if score_val < 50:
                if section == "skills":
                    suggestions.append(
                        "Enhance the Skills section with specific technologies and tools mentioned in the job description"
                    )
                elif section == "experience":
                    suggestions.append(
                        "Add more relevant work experience details with quantified achievements that align with this role"
                    )
                elif section == "education":
                    suggestions.append(
                        "Include relevant coursework, certifications, or academic projects that match the requirements"
                    )
                elif section == "summary":
                    suggestions.append(
                        "Rewrite the summary/objective to specifically target this position with role-specific keywords"
                    )

    # General suggestions
    if score < 45:
        suggestions.append(
            "Consider obtaining relevant certifications to strengthen your candidacy for this type of role"
        )
    if missing_skills:
        suggestions.append(
            f"Build portfolio projects demonstrating: {', '.join(missing_skills[:3])}"
        )

    return suggestions[:6]  # Cap at 6 suggestions
