from fastapi import WebSocket
import logging
import json

logger = logging.getLogger(__name__)


class WebSocketManager:
    def __init__(self):
        self.connections: dict[str, WebSocket] = {}

    async def connect(self, ws: WebSocket, session_id: str):
        await ws.accept()
        self.connections[session_id] = ws
        logger.info(f"WebSocket connected: {session_id}")

    def disconnect(self, session_id: str):
        self.connections.pop(session_id, None)
        logger.info(f"WebSocket disconnected: {session_id}")

    async def send_update(self, session_id: str, data: dict):
        ws = self.connections.get(session_id)
        if ws:
            try:
                await ws.send_json(data)
            except Exception as e:
                logger.warning(f"Failed to send WS message to {session_id}: {e}")
                self.disconnect(session_id)

    async def broadcast_agent_status(
        self, session_id: str, agent: str, status: str, progress: int, message: str
    ):
        await self.send_update(session_id, {
            "type": "agent_status",
            "agent": agent,
            "status": status,
            "progress": progress,
            "message": message,
        })

    async def broadcast_agent_result(self, session_id: str, agent: str, data: dict):
        await self.send_update(session_id, {
            "type": "agent_result",
            "agent": agent,
            "data": data,
        })

    async def broadcast_phase_change(self, session_id: str, phase: int, message: str):
        await self.send_update(session_id, {
            "type": "phase_change",
            "phase": phase,
            "message": message,
        })

    async def broadcast_complete(self, session_id: str):
        await self.send_update(session_id, {
            "type": "complete",
            "session_id": session_id,
            "message": "All agents completed successfully",
        })

    async def broadcast_error(self, session_id: str, agent: str, message: str):
        await self.send_update(session_id, {
            "type": "error",
            "agent": agent,
            "message": message,
        })
