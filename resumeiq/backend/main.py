"""
ResumeIQ Backend — FastAPI Application
Smart Resume Screening Platform with SBERT + SHAP
"""
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=getattr(logging, os.getenv("LOG_LEVEL", "INFO")))
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: preload ML models and connect to MongoDB."""
    logger.info("🚀 Starting ResumeIQ Backend...")

    # Load SBERT model (singleton)
    from ml.embeddings import EmbeddingEngine
    engine = EmbeddingEngine()
    app.state.embedding_engine = engine
    logger.info(f"✅ SBERT model '{engine.model_name}' loaded ({engine.dimensions}d)")

    # Connect to MongoDB
    from db.connection import connect_db, close_db
    db = await connect_db()
    app.state.db = db
    if db is not None:
        logger.info("✅ MongoDB connected")
    else:
        logger.warning("⚠️ MongoDB not connected — running without database persistence")

    # Load spaCy model (optional — PDF parser works without it via regex)
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        app.state.nlp = nlp
        logger.info("✅ spaCy 'en_core_web_sm' loaded")
    except Exception as e:
        logger.warning(f"⚠️ spaCy unavailable ({type(e).__name__}). Using regex-based section detection.")
        app.state.nlp = None

    logger.info("🟢 ResumeIQ Backend ready on port 8000")
    yield

    # Shutdown
    await close_db()
    logger.info("🔴 ResumeIQ Backend shut down")


# Create FastAPI app
app = FastAPI(
    title="ResumeIQ API",
    description="AI-powered resume screening with Sentence-BERT and Explainable AI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
from routes.health import router as health_router
from routes.upload import router as upload_router
from routes.feedback import router as feedback_router
from routes.history import router as history_router
from routes.jobs import router as jobs_router
from routes.results import router as results_router
from routes.candidates import router as candidates_router

app.state.temp_results_store = {}

app.include_router(health_router)
app.include_router(upload_router)
app.include_router(feedback_router)
app.include_router(history_router)
app.include_router(jobs_router)
app.include_router(results_router)
app.include_router(candidates_router)
