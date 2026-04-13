import httpx
from crewai.tools import BaseTool
import logging
import re

logger = logging.getLogger(__name__)


class WebScraperTool(BaseTool):
    name: str = "web_scraper"
    description: str = (
        "Scrape a webpage and return its text content. "
        "Input: URL string. Returns: cleaned text content of the page."
    )

    def _run(self, url: str) -> str:
        try:
            headers = {"User-Agent": "Mozilla/5.0 (compatible; ConferenceAI/1.0)"}
            with httpx.Client(timeout=15, follow_redirects=True) as client:
                resp = client.get(url.strip(), headers=headers)
                resp.raise_for_status()
                text = resp.text
                # Strip HTML tags
                clean = re.sub(r"<[^>]+>", " ", text)
                clean = re.sub(r"\s+", " ", clean).strip()
                return clean[:3000]
        except Exception as e:
            logger.error(f"Web scraper error for {url}: {e}")
            return f"Failed to scrape {url}: {str(e)}"


web_scraper_tool = WebScraperTool()
