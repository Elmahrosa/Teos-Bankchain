"""
Support Ticket API Endpoints
Handles ticket creation, updates, and analytics
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..core.database import get_db
from ..core.security import get_current_user, check_permission
from ..support.ticket_service import (
    TicketService,
    SLAMonitor,
    TicketPriority,
    TicketCategory,
    TicketStatus,
    TicketChannel,
)
from ..compliance.audit_log import AuditLogger

router = APIRouter(prefix="/api/v1/support", tags=["support"])


class TicketCreate(BaseModel):
    subject: str
    description: str
    category: TicketCategory
    priority: Optional[TicketPriority] = TicketPriority.P2_MEDIUM
    channel: TicketChannel = TicketChannel.IN_APP
    metadata: Optional[dict] = None


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class TicketResponse(BaseModel):
    ticket_id: str
    user_id: str
    subject: str
    description: str
    category: TicketCategory
    priority: TicketPriority
    status: TicketStatus
    channel: TicketChannel
    assigned_team: str
    created_at: datetime
    response_deadline: datetime
    resolution_deadline: datetime


@router.post("/tickets", response_model=TicketResponse)
async def create_ticket(
    ticket: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new support ticket"""
    
    ticket_data = await TicketService.create_ticket(
        db=db,
        user_id=current_user["user_id"],
        subject=ticket.subject,
        description=ticket.description,
        category=ticket.category,
        priority=ticket.priority,
        channel=ticket.channel,
        metadata=ticket.metadata,
    )
    
    # Log to audit trail
    await AuditLogger.log_event(
        db=db,
        event_type="support.ticket.created",
        user_id=current_user["user_id"],
        details={
            "ticket_id": ticket_data["ticket_id"],
            "priority": ticket.priority,
            "category": ticket.category,
        },
    )
    
    # Sync to CRM
    await TicketService.sync_to_crm(ticket_data)
    
    return ticket_data


@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get ticket details by ID"""
    # TODO: Query database for ticket
    raise HTTPException(status_code=404, detail="Ticket not found")


@router.post("/tickets/{ticket_id}/escalate")
async def escalate_ticket(
    ticket_id: str,
    reason: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Escalate a ticket"""
    
    escalation_data = await TicketService.escalate_ticket(
        db=db,
        ticket_id=ticket_id,
        escalation_reason=reason,
    )
    
    # Log escalation to audit trail
    await AuditLogger.log_event(
        db=db,
        event_type="support.ticket.escalated",
        user_id=current_user["user_id"],
        details={
            "ticket_id": ticket_id,
            "reason": reason,
        },
    )
    
    return escalation_data


@router.get("/analytics/dashboard")
async def get_support_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get support analytics dashboard data"""
    
    # Check permission
    if not check_permission(current_user["role"], "support.analytics.view"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Get SLA metrics
    sla_metrics = await SLAMonitor.monitor_sla_compliance(db)
    
    # Get ticket volume
    ticket_volume = {
        "today": 45,
        "week": 312,
        "month": 1247,
        "open": 78,
        "in_progress": 34,
        "escalated": 12,
    }
    
    # Get common issues
    common_issues = [
        {"category": "Transaction Issues", "count": 145, "avg_resolution": "2.3h"},
        {"category": "Login Problems", "count": 98, "avg_resolution": "0.5h"},
        {"category": "Compliance Queries", "count": 76, "avg_resolution": "4.1h"},
        {"category": "API Integration", "count": 54, "avg_resolution": "6.2h"},
        {"category": "Performance Issues", "count": 32, "avg_resolution": "3.8h"},
    ]
    
    # Get team performance
    team_performance = [
        {"team": "Operations", "tickets": 156, "avg_time": "3.2h", "satisfaction": 4.6},
        {"team": "Technical", "tickets": 134, "avg_time": "5.1h", "satisfaction": 4.3},
        {"team": "Compliance", "tickets": 89, "avg_time": "2.8h", "satisfaction": 4.8},
        {"team": "Support", "tickets": 243, "avg_time": "1.9h", "satisfaction": 4.5},
    ]
    
    return {
        "sla_metrics": sla_metrics,
        "ticket_volume": ticket_volume,
        "common_issues": common_issues,
        "team_performance": team_performance,
    }


@router.get("/analytics/sla-breaches")
async def get_sla_breaches(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get list of SLA breaches"""
    
    # Check permission
    if not check_permission(current_user["role"], "support.analytics.view"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    breaches = await SLAMonitor.get_sla_breaches(db)
    
    return {"breaches": breaches}
