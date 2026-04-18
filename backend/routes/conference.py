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
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    import tempfile
    from html import escape

    db_results = await get_agent_results(session_id)
    memory_results = _results.get(session_id, {})
    combined = {**memory_results, **db_results}

    if not combined:
        raise HTTPException(status_code=404, detail="No results to export.")

    def format_label(key: str) -> str:
        return key.replace("_", " ").strip().title()

    def textify(value) -> str:
        if value is None:
            return "-"
        if isinstance(value, bool):
            return "Yes" if value else "No"
        if isinstance(value, float):
            return f"{value:,.2f}"
        if isinstance(value, (int, str)):
            return str(value)
        if isinstance(value, list):
            if not value:
                return "-"
            return ", ".join(textify(v) for v in value)
        if isinstance(value, dict):
            parts = [f"{format_label(k)}: {textify(v)}" for k, v in value.items()]
            return "; ".join(parts)
        return str(value)

    def styled_table(data_rows, col_widths=None):
        table = Table(data_rows, colWidths=col_widths, hAlign="LEFT")
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 9),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#cbd5e1")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )
        return table

    def kv_table(payload: dict):
        rows = [["Field", "Value"]]
        for key, value in payload.items():
            rows.append([Paragraph(format_label(str(key)), body_style), Paragraph(escape(textify(value)), body_style)])
        return styled_table(rows, col_widths=[2.0 * inch, 4.9 * inch])

    def list_of_dicts_table(items: list):
        if not items:
            return None

        keys = []
        for item in items:
            if isinstance(item, dict):
                for k in item.keys():
                    if k not in keys:
                        keys.append(k)

        if not keys:
            return None

        header = [Paragraph(format_label(str(k)), body_style) for k in keys]
        rows = [header]

        for item in items:
            if not isinstance(item, dict):
                continue
            row = []
            for key in keys:
                value = item.get(key)
                row.append(Paragraph(escape(textify(value)), body_style))
            rows.append(row)

        col_count = max(1, len(keys))
        col_width = 6.9 * inch / col_count
        return styled_table(rows, col_widths=[col_width] * col_count)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    doc = SimpleDocTemplate(
        tmp.name,
        pagesize=letter,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.6 * inch,
        bottomMargin=0.6 * inch,
    )
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    section_style = styles["Heading1"]
    subsection_style = styles["Heading3"]
    body_style = ParagraphStyle(
        "BodySmall",
        parent=styles["BodyText"],
        fontSize=9,
        leading=12,
    )
    story = []

    story.append(Paragraph("ConferenceAI — Full Conference Plan", title_style))
    story.append(Paragraph(f"Session ID: {escape(session_id)}", body_style))
    story.append(Spacer(1, 14))

    for agent, data in combined.items():
        story.append(Paragraph(f"{format_label(agent)} Agent Results", section_style))
        story.append(Spacer(1, 6))

        if not isinstance(data, dict):
            story.append(Paragraph(escape(textify(data)), body_style))
            story.append(Spacer(1, 12))
            continue

        summary_data = {}

        for key, value in data.items():
            label = format_label(str(key))

            if isinstance(value, list):
                if value and all(isinstance(item, dict) for item in value):
                    story.append(Paragraph(label, subsection_style))
                    table = list_of_dicts_table(value)
                    if table:
                        story.append(table)
                    else:
                        story.append(Paragraph("No tabular data available.", body_style))
                    story.append(Spacer(1, 10))
                else:
                    bullet_items = "<br/>".join(f"• {escape(textify(item))}" for item in value) or "-"
                    story.append(Paragraph(label, subsection_style))
                    story.append(Paragraph(bullet_items, body_style))
                    story.append(Spacer(1, 10))
            elif isinstance(value, dict):
                story.append(Paragraph(label, subsection_style))
                story.append(kv_table(value))
                story.append(Spacer(1, 10))
            else:
                summary_data[key] = value

        if summary_data:
            story.append(Paragraph("Summary", subsection_style))
            story.append(kv_table(summary_data))
            story.append(Spacer(1, 12))

    doc.build(story)
    return FileResponse(tmp.name, media_type="application/pdf", filename=f"conference_plan_{session_id[:8]}.pdf")
