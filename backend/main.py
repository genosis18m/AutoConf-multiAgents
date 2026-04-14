from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from services.websocket_manager import WebSocketManager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("conference.log")
    ]
)
logger = logging.getLogger(__name__)

ws_manager = WebSocketManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ConferenceAI starting up...")
    # Store ws_manager on app state so routes can access it
    app.state.ws_manager = ws_manager
    yield
    logger.info("ConferenceAI shutting down...")


app = FastAPI(
    title="ConferenceAI",
    version="1.0.0",
    description="AI-powered Conference Organizer — 7 autonomous agents",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy import routes to avoid circular imports at startup
from routes.conference import router as conference_router

app.include_router(conference_router, prefix="/api")


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await ws_manager.connect(websocket, session_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(session_id)
    except Exception as e:
        logger.error(f"WebSocket error for {session_id}: {e}")
        ws_manager.disconnect(session_id)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "agents": 7}
