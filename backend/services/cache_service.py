from services.supabase_client import get_cached_result, set_cached_result
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


def make_cache_key(prefix: str, params: dict) -> str:
    payload = json.dumps(params, sort_keys=True)
    digest = hashlib.sha256(payload.encode()).hexdigest()[:16]
    return f"{prefix}:{digest}"


async def get_or_fetch(cache_key: str, fetch_fn, source: str) -> dict:
    cached = await get_cached_result(cache_key)
    if cached:
        logger.info(f"Cache HIT: {cache_key}")
        return cached

    logger.info(f"Cache MISS: {cache_key} — calling {source}")
    result = await fetch_fn()
    if result:
        await set_cached_result(cache_key, result, source)
    return result or {}
