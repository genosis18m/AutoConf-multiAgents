"""
Cache loader for pre-generated conference plans.
JSON files live in data/cache/<slug>.json — not in Python source code.
This avoids hardcoding data in the codebase while providing instant responses
for popular demo geographies.
"""
import json
import re
from pathlib import Path

_CACHE_DIR = Path(__file__).parent.parent / "data" / "cache"

# Mapping of geography keyword substrings → cache file name (without .json)
_GEO_ALIASES: dict[str, str] = {
    "pune":     "pune_india",
    "mumbai":   "mumbai_india",
    "bombay":   "mumbai_india",
    "new york": "new_york_usa",
    "nyc":      "new_york_usa",
    "new york city": "new_york_usa",
}


def _normalise(geography: str) -> str:
    return geography.strip().lower()


def get_cached_plan(geography: str) -> dict | None:
    """
    Return a pre-cached conference plan dict if one exists for the geography,
    otherwise return None (so the orchestrator falls through to live agents).
    """
    normed = _normalise(geography)
    slug = None
    for keyword, cache_name in _GEO_ALIASES.items():
        if keyword in normed:
            slug = cache_name
            break

    if slug is None:
        return None

    cache_file = _CACHE_DIR / f"{slug}.json"
    if not cache_file.exists():
        return None

    try:
        with open(cache_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None
