import httpx
from config import settings
from crewai.tools import BaseTool
import logging
import json

logger = logging.getLogger(__name__)

PLACES_API_BASE = "https://maps.googleapis.com/maps/api/place"


class GooglePlacesTool(BaseTool):
    name: str = "google_places_search"
    description: str = (
        "Search for venues and event spaces using Google Places API. "
        "Input: JSON string with keys: query (venue search query), location (city name). "
        "Returns: list of venues with name, address, rating, details."
    )

    def _run(self, query_json: str) -> str:
        if not settings.google_places_api_key:
            return self._mock_venues(query_json)
        try:
            params = json.loads(query_json) if query_json.strip().startswith("{") else {"query": query_json}
            query = params.get("query", "conference venue")
            location = params.get("location", "")
            search_query = f"{query} {location}".strip()

            with httpx.Client(timeout=10) as client:
                resp = client.get(
                    f"{PLACES_API_BASE}/textsearch/json",
                    params={"query": search_query, "type": "establishment", "key": settings.google_places_api_key},
                )
                data = resp.json()

            venues = []
            for place in data.get("results", [])[:5]:
                venue_detail = self._get_place_details(place.get("place_id", ""))
                venues.append({
                    "name": place.get("name"),
                    "address": place.get("formatted_address"),
                    "rating": place.get("rating", 0),
                    "place_id": place.get("place_id"),
                    "details": venue_detail,
                    "maps_url": f"https://maps.google.com/?q={place.get('formatted_address', '').replace(' ', '+')}",
                })
            return json.dumps(venues, indent=2)
        except Exception as e:
            logger.error(f"Google Places error: {e}")
            return self._mock_venues(query_json)

    def _get_place_details(self, place_id: str) -> dict:
        if not place_id or not settings.google_places_api_key:
            return {}
        try:
            with httpx.Client(timeout=10) as client:
                resp = client.get(
                    f"{PLACES_API_BASE}/details/json",
                    params={"place_id": place_id, "fields": "name,formatted_address,rating,website,formatted_phone_number", "key": settings.google_places_api_key},
                )
                return resp.json().get("result", {})
        except Exception:
            return {}

    def _mock_venues(self, query: str) -> str:
        mock = [
            {"name": "Bhawan Convention Centre", "address": "Sector 15, Chandigarh", "rating": 4.4, "capacity": 800, "maps_url": "https://maps.google.com"},
            {"name": "The Lalit Grand Place", "address": "Civil Lines, Delhi", "rating": 4.6, "capacity": 500, "maps_url": "https://maps.google.com"},
            {"name": "JW Marriott Aerocity", "address": "Aerocity, New Delhi", "rating": 4.7, "capacity": 1000, "maps_url": "https://maps.google.com"},
        ]
        return json.dumps(mock, indent=2)


google_places_tool = GooglePlacesTool()
