from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@router.websocket("/notifications")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time notifications"""
    await manager.connect(websocket)
    
    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            
            # Echo back for now (replace with actual logic)
            await websocket.send_json({
                "type": "ack",
                "message": "Message received",
                "timestamp": datetime.utcnow().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def send_notification(user_id: str, notification: dict):
    """Send notification to specific user"""
    await manager.broadcast({
        "user_id": user_id,
        "notification": notification,
        "timestamp": datetime.utcnow().isoformat()
    })
