from supabase import create_client, Client
from config import settings
import logging
import json
from typing import Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

_client: Optional[Client] = None


def get_supabase() -> Optional[Client]:
    global _client
    if _client is None and settings.supabase_url and settings.supabase_key:
        try:
            _client = create_client(settings.supabase_url, settings.supabase_key)
            logger.info("Supabase client initialized")
        except Exception as e:
            logger.warning(f"Supabase init failed: {e}. Running without DB.")
    return _client


async def create_session(session_data: dict) -> Optional[dict]:
    client = get_supabase()
    if not client:
        return None
    try:
        result = client.table("sessions").insert(session_data).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"create_session error: {e}")
        return None


async def update_session_status(session_id: str, status: str) -> None:
    client = get_supabase()
    if not client:
        return
    try:
        client.table("sessions").update({"status": status, "updated_at": datetime.utcnow().isoformat()}).eq("id", session_id).execute()
    except Exception as e:
        logger.error(f"update_session_status error: {e}")


async def upsert_agent_result(session_id: str, agent_name: str, result: dict, status: str = "completed") -> None:
    client = get_supabase()
    if not client:
        return
    try:
        client.table("agent_results").upsert({
            "session_id": session_id,
            "agent_name": agent_name,
            "status": status,
            "progress": 100,
            "result": result,
            "completed_at": datetime.utcnow().isoformat(),
        }).execute()
    except Exception as e:
        logger.error(f"upsert_agent_result error: {e}")


async def get_agent_results(session_id: str) -> dict:
    client = get_supabase()
    if not client:
        return {}
    try:
        result = client.table("agent_results").select("*").eq("session_id", session_id).execute()
        return {row["agent_name"]: row["result"] for row in (result.data or [])}
    except Exception as e:
        logger.error(f"get_agent_results error: {e}")
        return {}


async def get_cached_result(cache_key: str) -> Optional[dict]:
    client = get_supabase()
    if not client:
        return None
    try:
        result = client.table("api_cache").select("response").eq("cache_key", cache_key).execute()
        if result.data:
            return result.data[0]["response"]
        return None
    except Exception as e:
        logger.error(f"get_cached_result error: {e}")
        return None


async def set_cached_result(cache_key: str, response: dict, source: str) -> None:
    client = get_supabase()
    if not client:
        return
    try:
        client.table("api_cache").upsert({
            "cache_key": cache_key,
            "response": response,
            "source": source,
        }).execute()
    except Exception as e:
        logger.error(f"set_cached_result error: {e}")
