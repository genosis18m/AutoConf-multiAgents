from fastapi import APIRouter, Request, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from models.schemas import ConferenceInput, SessionResponse, AllAgentsStatus, AgentStatus, ResultsResponse, AgentResultResponse
from services.supabase_client import create_session, get_agent_results
from agents.orchestrator import run_conference_plan
from data.demo_data import DEMO_DATA
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
    if session_id.startswith("demo_"):
        # Format: demo_{city}_{8hex} — strip the trailing _xxxxxxxx to get city
        city = "_".join(session_id.split("_")[1:-1])
        if city in DEMO_DATA:
            return ResultsResponse(session_id=session_id, results=DEMO_DATA[city])

    db_results = await get_agent_results(session_id)
    memory_results = _results.get(session_id, {})
    combined = {**memory_results, **db_results}

    if not combined:
        raise HTTPException(status_code=404, detail="No results found for this session.")

    return ResultsResponse(session_id=session_id, results=combined)

@router.get("/demo/{city}")
async def get_demo(city: str):
    if city not in DEMO_DATA:
        raise HTTPException(status_code=404, detail="Demo data not found for this city.")
    session_id = f"demo_{city}_{uuid.uuid4().hex[:8]}"
    return {"session_id": session_id}

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
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch, cm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        HRFlowable, KeepTogether
    )
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    import tempfile
    from html import escape

    db_results = await get_agent_results(session_id)
    memory_results = _results.get(session_id, {})
    combined = {**memory_results, **db_results}

    if not combined and session_id.startswith("demo_"):
        city = "_".join(session_id.split("_")[1:-1])
        if city in DEMO_DATA:
            combined = DEMO_DATA[city]

    if not combined:
        raise HTTPException(status_code=404, detail="No results to export.")

    # ── Colour palette ──────────────────────────────────────────────────────
    NAVY      = colors.HexColor("#0f172a")
    INDIGO    = colors.HexColor("#4f8ef7")
    PURPLE    = colors.HexColor("#7c3aed")
    LIGHT_BG  = colors.HexColor("#f1f5f9")
    BORDER    = colors.HexColor("#cbd5e1")
    WHITE     = colors.white
    GRAY_TEXT = colors.HexColor("#475569")
    GREEN     = colors.HexColor("#057a55")

    AGENT_COLORS = {
        "sponsor":   colors.HexColor("#1e40af"),
        "speaker":   colors.HexColor("#7c3aed"),
        "ticketing": colors.HexColor("#0369a1"),
        "venue":     colors.HexColor("#065f46"),
        "pricing":   colors.HexColor("#92400e"),
        "gtm":       colors.HexColor("#be185d"),
        "ops":       colors.HexColor("#1e3a5f"),
    }

    AGENT_EMOJI = {
        "sponsor": "💰", "speaker": "🎤", "ticketing": "🎫",
        "venue": "🏛️", "pricing": "📊", "gtm": "📣", "ops": "⚙️",
    }

    # ── Helpers ─────────────────────────────────────────────────────────────
    def fmt_label(key: str) -> str:
        return key.replace("_", " ").strip().title()

    def textify(value) -> str:
        if value is None: return "—"
        if isinstance(value, bool): return "Yes" if value else "No"
        if isinstance(value, float): return f"{value:,.2f}"
        if isinstance(value, (int, str)): return str(value)
        if isinstance(value, list):
            if not value: return "—"
            return "  •  ".join(textify(v) for v in value)
        if isinstance(value, dict):
            return ";  ".join(f"{fmt_label(k)}: {textify(v)}" for k, v in value.items())
        return str(value)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    doc = SimpleDocTemplate(
        tmp.name, pagesize=A4,
        leftMargin=1.8*cm, rightMargin=1.8*cm,
        topMargin=1.5*cm, bottomMargin=1.5*cm,
    )

    W = A4[0] - 3.6*cm   # usable width

    styles = getSampleStyleSheet()

    cover_title = ParagraphStyle("CoverTitle",
        fontName="Helvetica-Bold", fontSize=28, textColor=WHITE,
        alignment=TA_CENTER, spaceAfter=6)
    cover_sub = ParagraphStyle("CoverSub",
        fontName="Helvetica", fontSize=13, textColor=colors.HexColor("#c7d2fe"),
        alignment=TA_CENTER, spaceAfter=4)
    cover_meta = ParagraphStyle("CoverMeta",
        fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#94a3b8"),
        alignment=TA_CENTER)

    section_style = ParagraphStyle("Section",
        fontName="Helvetica-Bold", fontSize=13, textColor=WHITE,
        spaceBefore=0, spaceAfter=0, leftIndent=8)
    sub_style = ParagraphStyle("Sub",
        fontName="Helvetica-Bold", fontSize=10, textColor=INDIGO,
        spaceBefore=8, spaceAfter=4)
    body_style = ParagraphStyle("Body",
        fontName="Helvetica", fontSize=8.5, textColor=NAVY,
        leading=13, spaceAfter=2)
    bullet_style = ParagraphStyle("Bullet",
        fontName="Helvetica", fontSize=8.5, textColor=GRAY_TEXT,
        leading=13, leftIndent=12, spaceAfter=1)

    story = []

    # ── Cover block ─────────────────────────────────────────────────────────
    cover_data = [[
        Paragraph("🎯 ConferenceAI", cover_title),
        Paragraph("AI-Powered Conference Plan", cover_sub),
        Paragraph("Generated by 7 Autonomous Research Agents", cover_meta),
    ]]
    cover_table = Table([[c] for c in cover_data[0]], colWidths=[W])
    cover_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("ROUNDEDCORNERS", [10]),
        ("TOPPADDING",    (0, 0), (-1, 0), 28),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 28),
        ("LEFTPADDING",   (0, 0), (-1, -1), 20),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 20),
        ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
    ]))
    story.append(cover_table)
    story.append(Spacer(1, 0.5*cm))

    # Agents overview row
    agents_list = "  |  ".join(
        f"{AGENT_EMOJI.get(a,'•')} {fmt_label(a)}" for a in combined
    )
    story.append(Paragraph(agents_list, ParagraphStyle("AgList",
        fontName="Helvetica", fontSize=8, textColor=GRAY_TEXT,
        alignment=TA_CENTER, spaceAfter=12)))
    story.append(HRFlowable(width=W, thickness=0.5, color=BORDER))
    story.append(Spacer(1, 0.3*cm))

    # ── Per-agent sections ───────────────────────────────────────────────────
    for agent, data in combined.items():
        agent_color = AGENT_COLORS.get(agent, INDIGO)
        emoji = AGENT_EMOJI.get(agent, "•")

        # Section header banner
        header_table = Table(
            [[Paragraph(f"{emoji}  {fmt_label(agent)} Agent", section_style)]],
            colWidths=[W]
        )
        header_table.setStyle(TableStyle([
            ("BACKGROUND",    (0, 0), (-1, -1), agent_color),
            ("TOPPADDING",    (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ("LEFTPADDING",   (0, 0), (-1, -1), 12),
            ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
            ("ROUNDEDCORNERS", [6]),
        ]))
        story.append(KeepTogether([header_table, Spacer(1, 6)]))

        if not isinstance(data, dict):
            story.append(Paragraph(escape(textify(data)), body_style))
            story.append(Spacer(1, 10))
            continue

        summary_kvs = {}

        for key, value in data.items():
            label = fmt_label(key)

            if isinstance(value, list) and value and all(isinstance(i, dict) for i in value):
                # Table of dicts
                story.append(Paragraph(label, sub_style))
                all_keys = []
                for item in value:
                    for k in item:
                        if k not in all_keys:
                            all_keys.append(k)
                if all_keys:
                    header_row = [Paragraph(fmt_label(k), ParagraphStyle("TH",
                        fontName="Helvetica-Bold", fontSize=8, textColor=WHITE))
                        for k in all_keys]
                    rows = [header_row]
                    for item in value:
                        if not isinstance(item, dict): continue
                        rows.append([
                            Paragraph(escape(textify(item.get(k))), body_style)
                            for k in all_keys
                        ])
                    col_w = W / max(len(all_keys), 1)
                    t = Table(rows, colWidths=[col_w]*len(all_keys), hAlign="LEFT")
                    t.setStyle(TableStyle([
                        ("BACKGROUND",    (0, 0), (-1, 0), NAVY),
                        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
                        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE",      (0, 0), (-1, -1), 8),
                        ("GRID",          (0, 0), (-1, -1), 0.25, BORDER),
                        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, LIGHT_BG]),
                        ("ALIGN",         (0, 0), (-1, -1), "LEFT"),
                        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING",   (0, 0), (-1, -1), 5),
                        ("RIGHTPADDING",  (0, 0), (-1, -1), 5),
                        ("TOPPADDING",    (0, 0), (-1, -1), 4),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                    ]))
                    story.append(t)
                story.append(Spacer(1, 8))

            elif isinstance(value, list):
                story.append(Paragraph(label, sub_style))
                for item in value:
                    story.append(Paragraph(f"• {escape(textify(item))}", bullet_style))
                story.append(Spacer(1, 8))

            elif isinstance(value, dict):
                story.append(Paragraph(label, sub_style))
                kv_rows = [[
                    Paragraph(fmt_label(k), ParagraphStyle("KH", fontName="Helvetica-Bold",
                        fontSize=8.5, textColor=GRAY_TEXT)),
                    Paragraph(escape(textify(v)), body_style)
                ] for k, v in value.items()]
                if kv_rows:
                    kt = Table(kv_rows, colWidths=[2.2*inch, W - 2.2*inch], hAlign="LEFT")
                    kt.setStyle(TableStyle([
                        ("GRID",          (0, 0), (-1, -1), 0.25, BORDER),
                        ("ROWBACKGROUNDS",(0, 0), (-1, -1), [WHITE, LIGHT_BG]),
                        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING",   (0, 0), (-1, -1), 6),
                        ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
                        ("TOPPADDING",    (0, 0), (-1, -1), 4),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                        ("FONTSIZE",      (0, 0), (-1, -1), 8.5),
                    ]))
                    story.append(kt)
                story.append(Spacer(1, 8))
            else:
                summary_kvs[key] = value

        if summary_kvs:
            story.append(Paragraph("Summary", sub_style))
            kv_rows = [[
                Paragraph(fmt_label(k), ParagraphStyle("KH2", fontName="Helvetica-Bold",
                    fontSize=8.5, textColor=GRAY_TEXT)),
                Paragraph(escape(textify(v)), body_style)
            ] for k, v in summary_kvs.items()]
            kt = Table(kv_rows, colWidths=[2.2*inch, W - 2.2*inch], hAlign="LEFT")
            kt.setStyle(TableStyle([
                ("GRID",          (0, 0), (-1, -1), 0.25, BORDER),
                ("ROWBACKGROUNDS",(0, 0), (-1, -1), [WHITE, LIGHT_BG]),
                ("VALIGN",        (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING",   (0, 0), (-1, -1), 6),
                ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
                ("TOPPADDING",    (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("FONTSIZE",      (0, 0), (-1, -1), 8.5),
            ]))
            story.append(kt)

        story.append(Spacer(1, 0.4*cm))
        story.append(HRFlowable(width=W, thickness=0.3, color=BORDER))
        story.append(Spacer(1, 0.3*cm))

    # ── Footer note ──────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph(
        "Generated by ConferenceAI · 7 Autonomous Agents · ai_conference_plan.pdf",
        ParagraphStyle("Footer", fontName="Helvetica", fontSize=8,
            textColor=colors.HexColor("#94a3b8"), alignment=TA_CENTER)
    ))

    doc.build(story)
    return FileResponse(
        tmp.name,
        media_type="application/pdf",
        filename="ai_conference_plan.pdf"
    )


