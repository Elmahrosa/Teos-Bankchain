from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from backend.compliance.models import KYCRecord, AuditLog, ComplianceAlert
import uuid
from datetime import datetime

class ComplianceService:
    """Service for compliance operations"""
    
    @staticmethod
    async def create_audit_log(
        db: AsyncSession,
        user_id: Optional[str],
        action: str,
        resource: Optional[str],
        details: Optional[str],
        ip_address: Optional[str],
        user_agent: Optional[str]
    ) -> AuditLog:
        """Create audit log entry"""
        log = AuditLog(
            id=str(uuid.uuid4()),
            user_id=user_id,
            action=action,
            resource=resource,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(log)
        await db.flush()
        return log
    
    @staticmethod
    async def get_audit_logs(
        db: AsyncSession,
        limit: int = 100,
        offset: int = 0
    ) -> List[AuditLog]:
        """Get audit logs"""
        result = await db.execute(
            select(AuditLog)
            .order_by(desc(AuditLog.timestamp))
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()
    
    @staticmethod
    async def create_compliance_alert(
        db: AsyncSession,
        alert_type: str,
        severity: str,
        description: str,
        user_id: Optional[str] = None,
        transaction_id: Optional[str] = None
    ) -> ComplianceAlert:
        """Create compliance alert"""
        alert = ComplianceAlert(
            id=str(uuid.uuid4()),
            alert_type=alert_type,
            severity=severity,
            user_id=user_id,
            transaction_id=transaction_id,
            description=description
        )
        db.add(alert)
        await db.flush()
        return alert
    
    @staticmethod
    async def get_open_alerts(db: AsyncSession) -> List[ComplianceAlert]:
        """Get open compliance alerts"""
        result = await db.execute(
            select(ComplianceAlert)
            .where(ComplianceAlert.status == "open")
            .order_by(desc(ComplianceAlert.created_at))
        )
        return result.scalars().all()
    
    @staticmethod
    async def resolve_alert(
        db: AsyncSession,
        alert_id: str,
        resolved_by: str
    ) -> Optional[ComplianceAlert]:
        """Resolve compliance alert"""
        result = await db.execute(
            select(ComplianceAlert).where(ComplianceAlert.id == alert_id)
        )
        alert = result.scalar_one_or_none()
        
        if alert:
            alert.status = "resolved"
            alert.resolved_by = resolved_by
            alert.resolved_at = datetime.utcnow()
            await db.flush()
        
        return alert
