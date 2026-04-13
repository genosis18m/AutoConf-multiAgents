from tavily import TavilyClient
from config import settings
from crewai.tools import BaseTool
from pydantic import Field
import logging

logger = logging.getLogger(__name__)


class TavilySearchTool(BaseTool):
    name: str = "web_search"
    description: str = (
        "Search the web for up-to-date information about events, sponsors, speakers, venues. "
        "Input: a search query string. Returns: list of relevant web results with title, url, content."
    )

    def _run(self, query: str) -> str:
        if not settings.tavily_api_key:
            return f"[DEMO] Tavily search for: {query} — API key not configured, returning mock data."
        try:
            client = TavilyClient(api_key=settings.tavily_api_key)
            results = client.search(query=query, max_results=5, search_depth="advanced")
            output = []
            for r in results.get("results", []):
                output.append(f"Title: {r.get('title')}\nURL: {r.get('url')}\nContent: {r.get('content', '')[:500]}\n")
            return "\n---\n".join(output) if output else "No results found."
        except Exception as e:
            logger.error(f"Tavily search error: {e}")
            return f"Search failed: {str(e)}"


tavily_search_tool = TavilySearchTool()
