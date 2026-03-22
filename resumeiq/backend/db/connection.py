"""
MongoDB Connection Manager
Uses motor (async driver) to connect to MongoDB Atlas.
"""
import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient = None
_db = None


async def connect_db():
    """Connect to MongoDB Atlas. Returns the database instance or None."""
    global _client, _db
    uri = os.getenv("MONGODB_URI", "")
    db_name = os.getenv("DB_NAME", "smart_resume_db")

    if not uri or "xxxxx" in uri:
        logger.warning("MongoDB URI not configured. Running without database.")
        return None

    try:
        _client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
        # Verify connection
        await _client.admin.command("ping")
        _db = _client[db_name]

        # Create indexes
        await _create_indexes(_db)
        return _db
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        return None


async def _create_indexes(db):
    """Create indexes per TRD §6.5."""
    try:
        screenings = db["screenings"]
        await screenings.create_index([("job_id", 1), ("timestamp", -1)])
        await screenings.create_index([("scores.overall", -1)])
        await screenings.create_index("is_shortlisted")

        jobs = db["jobs"]
        await jobs.create_index("job_id", unique=True)
        await jobs.create_index("is_active")

        logger.info("MongoDB indexes created")
    except Exception as e:
        logger.warning(f"Index creation skipped: {e}")


async def close_db():
    """Close the MongoDB connection."""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed")


def get_db():
    """Get the current database instance."""
    return _db
