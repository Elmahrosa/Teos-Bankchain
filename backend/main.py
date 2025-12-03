from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from backend.api import ledger, compliance, payments, websocket
from backend.core.config import settings
from backend.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and services on startup"""
    await init_db()
    yield

app = FastAPI(
    title="TEOS Bankchain API",
    description="Banking bridge platform connecting traditional banks with Pi Network",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ledger.router, prefix="/api/v1/ledger", tags=["Ledger"])
app.include_router(compliance.router, prefix="/api/v1/compliance", tags=["Compliance"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])

@app.get("/")
async def root():
    return {
        "message": "TEOS Bankchain API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "services": {
            "ledger": "operational",
            "compliance": "operational",
            "payments": "operational"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
