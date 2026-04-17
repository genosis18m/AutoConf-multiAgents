import asyncio
import logging
from typing import Any

from services.websocket_manager import WebSocketManager
from services.supabase_client import upsert_agent_result, update_session_status
from agents.sponsor_agent import run_sponsor_agent
from agents.speaker_agent import run_speaker_agent
from agents.ticketing_agent import run_ticketing_agent
from agents.venue_agent import run_venue_agent
from agents.pricing_agent import run_pricing_agent
from agents.gtm_agent import run_gtm_agent
from agents.ops_agent import run_ops_agent

logger = logging.getLogger(__name__)


async def _run_agent(
    name: str,
    fn,
    kwargs: dict,
    session_id: str,
    ws: WebSocketManager,
) -> dict:
    await ws.broadcast_agent_status(session_id, name, "running", 10, f"Starting {name} agent...")
    try:
        await ws.broadcast_agent_status(session_id, name, "running", 40, f"{name} agent researching...")
        result = await fn(**kwargs)
        await upsert_agent_result(session_id, name, result, "completed")
        await ws.broadcast_agent_status(session_id, name, "completed", 100, f"{name} agent finished.")
        await ws.broadcast_agent_result(session_id, name, result)
        logger.info(f"Agent {name} completed for session {session_id}")
        return result
    except Exception as e:
        logger.error(f"Agent {name} failed: {e}")
        await upsert_agent_result(session_id, name, {"error": str(e)}, "failed")
        await ws.broadcast_agent_status(session_id, name, "failed", 0, f"{name} agent failed: {str(e)}")
        await ws.broadcast_error(session_id, name, str(e))
        return {}


async def run_conference_plan(
    session_id: str,
    category: str,
    geography: str,
    audience_size: int,
    budget: float,
    ws_manager: WebSocketManager,
):
    await update_session_status(session_id, "running")

    base = dict(category=category, geography=geography, audience_size=audience_size, budget=budget)

    # ── Phase 1: Sequential to respect Free Tier API limits ───────────────────
    await ws_manager.broadcast_phase_change(session_id, 1, "Phase 1 starting — Sponsor, Speaker & Venue agents (running to respect rate limit)...")

    sponsor_result = await _run_agent("sponsor", run_sponsor_agent, base, session_id, ws_manager)
    await asyncio.sleep(1)
    
    speaker_result = await _run_agent("speaker", run_speaker_agent, {k: v for k, v in base.items() if k != "budget"}, session_id, ws_manager)
    await asyncio.sleep(1)
    
    ticketing_result = await _run_agent("ticketing", run_ticketing_agent, base, session_id, ws_manager)
    await asyncio.sleep(1)
    
    venue_result = await _run_agent("venue", run_venue_agent, base, session_id, ws_manager)
    await asyncio.sleep(1)

    # ── Phase 2: Pricing (needs venue) ───────────────────────────────────────
    await ws_manager.broadcast_phase_change(session_id, 2, "Phase 2 starting — Pricing & Footfall agent...")

    pricing_result = await _run_agent(
        "pricing",
        run_pricing_agent,
        {**base, "venue_data": venue_result},
        session_id,
        ws_manager,
    )
    await asyncio.sleep(1)

    # ── Phase 3: GTM (needs speaker + pricing) ───────────────────────────────
    await ws_manager.broadcast_phase_change(session_id, 3, "Phase 3 starting — GTM & Communication agent...")

    gtm_result = await _run_agent(
        "gtm",
        run_gtm_agent,
        {**{k: v for k, v in base.items() if k != "budget"}, "speakers": speaker_result, "pricing": pricing_result},
        session_id,
        ws_manager,
    )
    await asyncio.sleep(1)

    # ── Phase 4: Ops (needs everything) ─────────────────────────────────────
    await ws_manager.broadcast_phase_change(session_id, 4, "Phase 4 starting — Ops & Logistics agent...")

    all_data = {
        "sponsor": sponsor_result,
        "speaker": speaker_result,
        "ticketing": ticketing_result,
        "venue": venue_result,
        "pricing": pricing_result,
        "gtm": gtm_result,
    }

    ops_result = await _run_agent(
        "ops",
        run_ops_agent,
        {**{k: v for k, v in base.items() if k != "budget"}, "all_data": all_data},
        session_id,
        ws_manager,
    )

    # ── Complete ─────────────────────────────────────────────────────────────
    await update_session_status(session_id, "completed")
    await ws_manager.broadcast_complete(session_id)
    logger.info(f"Conference plan completed for session {session_id}")

    return {**all_data, "ops": ops_result}
