"""
Shared LLM factory with automatic fallback across available models.
Order: gemini-2.5-flash → gemini-2.0-flash → groq/llama-3.3-70b → groq/llama-3.1-8b

Usage in each agent:
    from agents.base_llm import get_working_llm

    llm = get_working_llm()          # returns the first model that can complete a test call
"""
import logging
import time

try:
    from crewai import LLM
    CREWAI_AVAILABLE = True
except Exception:
    LLM = None
    CREWAI_AVAILABLE = False

from config import settings

logger = logging.getLogger(__name__)


def _candidates():
    """Build an ordered list of (model_name, api_key) tuples.
    
    Priority order (Groq first — unlimited tokens per month on free plan,
    Gemini last — only 20 req/day on free tier for 2.5-flash):
    1. groq/llama-3.1-8b-instant  (fastest, cheapest, 6k TPM free)
    2. groq/llama-3.3-70b-versatile  (quality Groq model)
    3. gemini/gemini-2.5-flash  (last resort — 20 req/day free)
    """
    models = []
    if settings.groq_api_key:
        models += [
            ("groq/llama-3.1-8b-instant", settings.groq_api_key),
            ("groq/llama-3.3-70b-versatile", settings.groq_api_key),
        ]
    if settings.gemini_api_key:
        models += [
            ("gemini/gemini-2.5-flash", settings.gemini_api_key),
        ]
    return models



def get_llm():
    """
    Return the first LLM object that can be instantiated.
    For CrewAI agents that need a single LLM passed to Agent(llm=...).
    """
    if not CREWAI_AVAILABLE:
        raise RuntimeError("CrewAI is not available in this environment.")
    candidates = _candidates()
    if not candidates:
        raise ValueError("No LLM API key configured. Set GEMINI_API_KEY or GROQ_API_KEY.")

    last_error = None
    for model_name, api_key in candidates:
        try:
            llm = LLM(model=model_name, api_key=api_key)
            logger.info(f"[base_llm] Using model: {model_name}")
            return llm
        except Exception as e:
            logger.warning(f"[base_llm] {model_name} failed to init: {e}")
            last_error = e

    raise RuntimeError(f"All LLMs failed to initialise. Last error: {last_error}")


def run_crew_with_fallback(crew_factory):
    """
    Call crew_factory(llm) for each candidate model until one succeeds.

    crew_factory is a callable: (LLM) -> (Crew, str_result_or_exception)

    Returns the raw string result from the first successful Crew.kickoff().
    Raises RuntimeError if all models fail.
    """
    if not CREWAI_AVAILABLE:
        raise RuntimeError("CrewAI is not available in this environment.")
    candidates = _candidates()
    if not candidates:
        raise ValueError("No LLM API key configured.")

    last_error = None
    for model_name, api_key in candidates:
        try:
            llm = LLM(model=model_name, api_key=api_key)
            logger.info(f"[base_llm] Attempting crew with model: {model_name}")
            result = crew_factory(llm)
            logger.info(f"[base_llm] Success with model: {model_name}")
            return result
        except Exception as e:
            err_str = str(e)
            # Only retry on rate-limit / overload / quota errors
            if any(code in err_str for code in ["429", "503", "quota", "rate_limit", "RESOURCE_EXHAUSTED", "UNAVAILABLE"]):
                logger.warning(f"[base_llm] {model_name} hit quota/overload: {err_str[:120]}. Trying next model...")
                last_error = e
                time.sleep(1)
                continue
            # For other errors (bad request, auth, etc.) raise immediately
            raise

    raise RuntimeError(f"All LLMs exhausted their quotas. Last error: {last_error}")
