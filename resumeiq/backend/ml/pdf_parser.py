"""
Stage 1 — PDF Parsing & Section Segmentation
Uses pdfplumber for text extraction and keyword rules for section detection.
"""
import io
import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Section keyword triggers per TRD §4.2
SECTION_KEYWORDS = {
    "skills": [
        r"skills", r"technical\s+skills", r"core\s+competencies",
        r"technologies", r"tools", r"proficiencies", r"tech\s+stack",
    ],
    "experience": [
        r"experience", r"work\s+history", r"employment",
        r"professional\s+background", r"work\s+experience", r"career\s+history",
    ],
    "education": [
        r"education", r"academic\s+background", r"qualifications",
        r"degrees", r"certifications", r"academic",
    ],
    "summary": [
        r"summary", r"objective", r"profile", r"about\s+me",
        r"career\s+objective", r"professional\s+summary", r"overview",
    ],
}


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract raw text from a PDF file using pdfplumber."""
    import pdfplumber

    full_text = ""
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text(x_tolerance=3, y_tolerance=3)
                if page_text:
                    full_text += page_text + "\n"
    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        raise ValueError(f"Cannot read PDF: {str(e)}")

    if not full_text.strip():
        raise ValueError("Cannot read PDF. Use a text-based PDF, not a scanned image.")

    return full_text.strip()


def segment_sections(full_text: str, nlp=None) -> dict:
    """
    Segment resume text into sections using keyword-based rules.
    Returns dict with keys: skills, experience, education, summary.
    """
    lines = full_text.split("\n")
    sections = {"skills": "", "experience": "", "education": "", "summary": ""}
    current_section: Optional[str] = None

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Check if this line is a section header
        detected = _detect_section_header(stripped)
        if detected:
            current_section = detected
            continue

        # Append to current section
        if current_section and current_section in sections:
            sections[current_section] += stripped + " "

    # If no sections were detected, put everything in summary
    if not any(sections.values()):
        sections["summary"] = full_text

    # Clean up whitespace
    sections = {k: v.strip() for k, v in sections.items()}
    return sections


def _detect_section_header(line: str) -> Optional[str]:
    """Check if a line matches any known section header pattern."""
    clean = line.strip().rstrip(":").strip()
    # Short lines (< 50 chars) that match keywords are likely headers
    if len(clean) > 60:
        return None

    for section, patterns in SECTION_KEYWORDS.items():
        for pattern in patterns:
            if re.match(rf"^{pattern}$", clean, re.IGNORECASE):
                return section
    return None


def extract_resume_data(pdf_bytes: bytes, nlp=None) -> dict:
    """
    Full extraction pipeline: PDF → raw text → segmented sections.
    Returns: {
        'full_text': str,
        'sections': {'skills': str, 'experience': str, ...},
        'word_count': int,
        'sections_found': [str]
    }
    """
    full_text = extract_text_from_pdf(pdf_bytes)
    sections = segment_sections(full_text, nlp)
    sections_found = [k for k, v in sections.items() if v]
    word_count = len(full_text.split())

    return {
        "full_text": full_text,
        "sections": sections,
        "word_count": word_count,
        "sections_found": sections_found,
    }
