from fastapi import APIRouter, Request, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from models.schemas import ConferenceInput, SessionResponse, AllAgentsStatus, AgentStatus, ResultsResponse, AgentResultResponse
from services.supabase_client import create_session, get_agent_results
from agents.orchestrator import run_conference_plan
import uuid
import logging
import asyncio
import os

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory fallback when Supabase is not configured
_sessions: dict = {}
_results: dict = {}


@router.post("/generate", response_model=SessionResponse)
async def generate_conference_plan(
    payload: ConferenceInput,
    request: Request,
    background_tasks: BackgroundTasks,
):
    session_id = str(uuid.uuid4())

    session_data = {
        "id": session_id,
        "category": payload.category,
        "geography": payload.geography,
        "audience_size": payload.audience_size,
        "budget": payload.budget,
        "status": "pending",
    }

    # Try Supabase, fall back to in-memory
    await create_session(session_data)
    _sessions[session_id] = {**session_data, "agents": {}}

    ws_manager = request.app.state.ws_manager

    background_tasks.add_task(
        _run_plan,
        session_id,
        payload.category,
        payload.geography,
        payload.audience_size,
        payload.budget or 0,
        ws_manager,
    )

    return SessionResponse(session_id=session_id, status="started")


async def _run_plan(session_id, category, geography, audience_size, budget, ws_manager):
    # Wait for the frontend to establish WebSocket connection before broadcasting
    await asyncio.sleep(2)
    try:
        results = await run_conference_plan(
            session_id=session_id,
            category=category,
            geography=geography,
            audience_size=audience_size,
            budget=budget,
            ws_manager=ws_manager,
        )
        _results[session_id] = results
    except Exception as e:
        logger.error(f"Plan generation failed for {session_id}: {e}")


@router.get("/status/{session_id}")
async def get_status(session_id: str):
    # Try Supabase first
    db_results = await get_agent_results(session_id)

    agents_map = {}
    agent_names = ["sponsor", "speaker", "ticketing", "venue", "pricing", "gtm", "ops"]

    for name in agent_names:
        if name in db_results:
            data = db_results[name]
            if isinstance(data, dict) and data.get("error"):
                agents_map[name] = AgentStatus(status="failed", progress=0, message=data["error"])
            else:
                agents_map[name] = AgentStatus(status="completed", progress=100)
        else:
            agents_map[name] = AgentStatus(status="queued", progress=0)

    in_memory = _results.get(session_id, {})
    for name in in_memory:
        agents_map[name] = AgentStatus(status="completed", progress=100)

    overall = "completed" if all(a.status == "completed" for a in agents_map.values()) else "running"

    return {
        "session_id": session_id,
        "overall_status": overall,
        "agents": {k: v.model_dump() for k, v in agents_map.items()},
    }


@router.get("/results/{session_id}")
async def get_results(session_id: str):
    db_results = await get_agent_results(session_id)
    memory_results = _results.get(session_id, {})
    combined = {**memory_results, **db_results}

    if not combined:
        raise HTTPException(status_code=404, detail="No results found for this session.")

    return ResultsResponse(session_id=session_id, results=combined)


@router.get("/results/{session_id}/{agent_name}")
async def get_agent_result(session_id: str, agent_name: str):
    db_results = await get_agent_results(session_id)
    memory_results = _results.get(session_id, {})
    combined = {**memory_results, **db_results}

    if agent_name not in combined:
        raise HTTPException(status_code=404, detail=f"No results for agent '{agent_name}' in session '{session_id}'.")

    return AgentResultResponse(agent=agent_name, data=combined[agent_name])


@router.post("/export/{session_id}")
async def export_pdf(session_id: str):
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    import tempfile
    import json

    db_results = await get_agent_results(session_id)
    memory_results = _results.get(session_id, {})
    combined = {**memory_results, **db_results}

    if not combined:
        raise HTTPException(status_code=404, detail="No results to export.")

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    doc = SimpleDocTemplate(tmp.name, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("ConferenceAI — Full Conference Plan", styles["Title"]))
    story.append(Spacer(1, 20))

    for agent, data in combined.items():
        story.append(Paragraph(f"{agent.upper()} AGENT RESULTS", styles["Heading1"]))
        story.append(Paragraph(json.dumps(data, indent=2)[:2000], styles["Code"]))
        story.append(Spacer(1, 12))

    doc.build(story)
    return FileResponse(tmp.name, media_type="application/pdf", filename=f"conference_plan_{session_id[:8]}.pdf")
