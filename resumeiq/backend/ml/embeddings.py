"""
Stage 2 — SBERT Embedding Generation
Singleton loader for the all-MiniLM-L6-v2 model.
Generates 384-dimensional dense vectors for semantic matching.
"""
import os
import logging
from sentence_transformers import SentenceTransformer, util

logger = logging.getLogger(__name__)


class EmbeddingEngine:
    """Singleton-style embedding engine. Load once at startup, reuse for all requests."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.model_name = os.getenv("SBERT_MODEL", "all-MiniLM-L6-v2")
        logger.info(f"Loading SBERT model: {self.model_name}...")
        self.model = SentenceTransformer(self.model_name)
        self.dimensions = self.model.get_sentence_embedding_dimension()
        self._initialized = True
        logger.info(f"SBERT model loaded: {self.dimensions} dimensions")

    def encode(self, text: str):
        """Encode a single text string into a dense vector."""
        return self.model.encode(text, convert_to_tensor=True)

    def encode_batch(self, texts: list):
        """Encode multiple texts at once."""
        return self.model.encode(texts, convert_to_tensor=True)

    def generate_embeddings(self, resume_sections: dict, job_description: str) -> dict:
        """
        Generate full-document and section-level embeddings.
        Returns: {
            'resume_full': tensor,
            'jd': tensor,
            'sections': {'skills': tensor, 'experience': tensor, ...}
        }
        """
        # Full document embedding
        resume_full_text = " ".join(v for v in resume_sections.values() if v)
        resume_embedding = self.encode(resume_full_text)
        jd_embedding = self.encode(job_description)

        # Section-level embeddings
        section_embeddings = {}
        for section, text in resume_sections.items():
            if text and len(text.split()) > 5:  # Only embed non-trivial sections
                section_embeddings[section] = self.encode(text)

        return {
            "resume_full": resume_embedding,
            "jd": jd_embedding,
            "sections": section_embeddings,
        }

    @staticmethod
    def cosine_sim(vec_a, vec_b) -> float:
        """Compute cosine similarity between two tensors."""
        return float(util.cos_sim(vec_a, vec_b)[0][0])
