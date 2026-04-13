import chromadb
from chromadb.config import Settings as ChromaSettings
import logging
from typing import Optional

logger = logging.getLogger(__name__)

_client: Optional[chromadb.Client] = None


def get_chroma() -> chromadb.Client:
    global _client
    if _client is None:
        try:
            _client = chromadb.Client(ChromaSettings(anonymized_telemetry=False))
            logger.info("ChromaDB client initialized (in-memory)")
        except Exception as e:
            logger.warning(f"ChromaDB init failed: {e}")
            _client = chromadb.Client()
    return _client


def get_or_create_collection(name: str):
    try:
        client = get_chroma()
        return client.get_or_create_collection(name)
    except Exception as e:
        logger.error(f"ChromaDB collection error: {e}")
        return None


def add_event_embedding(event_data: dict, event_id: str) -> None:
    collection = get_or_create_collection("past_events")
    if not collection:
        return
    try:
        collection.add(
            documents=[str(event_data)],
            metadatas=[event_data],
            ids=[event_id],
        )
    except Exception as e:
        logger.error(f"add_event_embedding error: {e}")


def search_similar_events(query: str, n_results: int = 5) -> list[dict]:
    collection = get_or_create_collection("past_events")
    if not collection:
        return []
    try:
        results = collection.query(query_texts=[query], n_results=n_results)
        return results.get("metadatas", [[]])[0]
    except Exception as e:
        logger.error(f"search_similar_events error: {e}")
        return []
