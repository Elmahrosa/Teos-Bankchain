from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
from backend.core.database import get_db
from backend.core.security import verify_token
from backend.compliance.service import ComplianceService
from backend.compliance.sanctions import sanctions_service
from backend.compliance.audit_log import audit_log_service
from backend.compliance.schemas import (
    AuditLogResponse,
    ComplianceAlertResponse,
    KYCVerificationRequest,
    SanctionScreeningRequest,
    SanctionCheckResult,
    AuditLogExportRequest,
    AuditLogExportResponse
)

router = APIRouter()

@router.post("/audit-log")
async def create_audit_log(
    event_type: str,
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    details: Optional[dict] = None,
    request: Request = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Create audit log entry - supports AI assistant interactions"""
    user_id = current_user.get("sub")
    ip_address = request.client.host if request else None
    user_agent = request.headers.get("user-agent") if request else None
    
    log = await audit_log_service.log_event(
        db=db,
        event_type=event_type,
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    return {"id": log.id, "message": "Audit log created", "hash": log.hash}

@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get audit logs"""
    # Check if user has admin role
    if current_user.get("role") not in ["bank_admin", "compliance_officer"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    logs = await ComplianceService.get_audit_logs(db, limit, offset)
    return logs

@router.post("/audit-logs/export", response_model=AuditLogExportResponse)
async def export_audit_logs(
    export_request: AuditLogExportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Export audit logs in CSV or JSON format for regulatory reporting"""
    if current_user.get("role") not in ["bank_admin", "compliance_officer"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    data = await audit_log_service.export_logs(
        db,
        export_request.start_date,
        export_request.end_date,
        export_request.format
    )
    
    # Count records
    if export_request.format == "json":
        import json
        record_count = len(json.loads(data))
    else:
        record_count = len(data.split('\n')) - 1  # Subtract header
    
    return AuditLogExportResponse(
        data=data,
        format=export_request.format,
        record_count=record_count,
        generated_at=datetime.utcnow()
    )

@router.get("/audit-logs/verify-chain")
async def verify_audit_chain(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Verify integrity of audit log chain"""
    if current_user.get("role") not in ["bank_admin", "compliance_officer"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    is_valid = await audit_log_service.verify_chain(db)
    
    return {
        "chain_valid": is_valid,
        "message": "Audit log chain is intact" if is_valid else "Audit log chain has been tampered with"
    }

@router.get("/alerts", response_model=List[ComplianceAlertResponse])
async def get_compliance_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get open compliance alerts"""
    if current_user.get("role") not in ["bank_admin", "compliance_officer"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    alerts = await ComplianceService.get_open_alerts(db)
    return alerts

@router.post("/alerts/{alert_id}/resolve")
async def resolve_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Resolve compliance alert"""
    if current_user.get("role") not in ["bank_admin", "compliance_officer"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    resolved_by = current_user.get("sub")
    alert = await ComplianceService.resolve_alert(db, alert_id, resolved_by)
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {"message": "Alert resolved", "alert_id": alert_id}

@router.post("/sanctions/screen", response_model=SanctionCheckResult)
async def screen_sanctions(
    screening_request: SanctionScreeningRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Screen entity against OFAC, EU, and UN sanctions lists"""
    if current_user.get("role") not in ["bank_admin", "compliance_officer", "operations"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    result = await sanctions_service.screen_entity(
        name=screening_request.name,
        country=screening_request.country,
        entity_type=screening_request.entity_type,
        db=db
    )
    
    # Log the sanctions check
    await audit_log_service.log_event(
        db=db,
        event_type="sanctions_screening",
        user_id=current_user.get("sub"),
        action="screen_entity",
        resource_type="sanctions",
        resource_id=screening_request.name,
        details={
            "entity_name": screening_request.name,
            "risk_level": result.risk_level,
            "matches_found": len(result.matches)
        }
    )
    
    return result
