import hashlib
import json
from typing import Any, Dict, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.compliance.models import AuditLog
from backend.core.security import sign_message

class AuditLogService:
    """Append-only signed audit log service for compliance"""
    
    async def log_event(
        self,
        db: AsyncSession,
        event_type: str,
        user_id: str,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> AuditLog:
        """
        Create an append-only audit log entry with cryptographic signature
        Previous log hash creates chain for tamper detection
        """
        
        # Get previous log entry to create chain
        previous_hash = await self._get_latest_hash(db)
        
        # Create log entry
        log_entry = AuditLog(
            event_type=event_type,
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details or {},
            ip_address=ip_address,
            user_agent=user_agent,
            previous_hash=previous_hash,
            timestamp=datetime.utcnow()
        )
        
        # Calculate hash of this entry
        log_entry.hash = self._calculate_hash(log_entry)
        
        # Sign the entry
        log_entry.signature = sign_message(log_entry.hash)
        
        db.add(log_entry)
        await db.commit()
        await db.refresh(log_entry)
        
        return log_entry
    
    async def verify_chain(self, db: AsyncSession) -> bool:
        """Verify integrity of audit log chain"""
        result = await db.execute(
            select(AuditLog).order_by(AuditLog.timestamp.asc())
        )
        logs = result.scalars().all()
        
        for i, log in enumerate(logs):
            # Verify hash
            calculated_hash = self._calculate_hash(log)
            if calculated_hash != log.hash:
                print(f"Hash mismatch at log {log.id}")
                return False
            
            # Verify chain
            if i > 0:
                if log.previous_hash != logs[i-1].hash:
                    print(f"Chain broken at log {log.id}")
                    return False
        
        return True
    
    async def export_logs(
        self,
        db: AsyncSession,
        start_date: datetime,
        end_date: datetime,
        format: str = "json"
    ) -> str:
        """Export audit logs for regulatory reporting"""
        result = await db.execute(
            select(AuditLog)
            .where(AuditLog.timestamp >= start_date)
            .where(AuditLog.timestamp <= end_date)
            .order_by(AuditLog.timestamp.asc())
        )
        logs = result.scalars().all()
        
        if format == "json":
            return json.dumps([
                {
                    "id": log.id,
                    "timestamp": log.timestamp.isoformat(),
                    "event_type": log.event_type,
                    "user_id": log.user_id,
                    "action": log.action,
                    "resource_type": log.resource_type,
                    "resource_id": log.resource_id,
                    "details": log.details,
                    "ip_address": log.ip_address,
                    "hash": log.hash,
                    "signature": log.signature,
                    "previous_hash": log.previous_hash
                }
                for log in logs
            ], indent=2)
        
        elif format == "csv":
            import csv
            from io import StringIO
            
            output = StringIO()
            writer = csv.writer(output)
            
            # Header
            writer.writerow([
                "ID", "Timestamp", "Event Type", "User ID", "Action",
                "Resource Type", "Resource ID", "IP Address", "Hash", "Signature"
            ])
            
            # Data rows
            for log in logs:
                writer.writerow([
                    log.id,
                    log.timestamp.isoformat(),
                    log.event_type,
                    log.user_id,
                    log.action,
                    log.resource_type,
                    log.resource_id,
                    log.ip_address,
                    log.hash,
                    log.signature
                ])
            
            return output.getvalue()
        
        return ""
    
    def _calculate_hash(self, log: AuditLog) -> str:
        """Calculate SHA-256 hash of log entry"""
        data = f"{log.timestamp.isoformat()}|{log.event_type}|{log.user_id}|{log.action}|{log.resource_type}|{log.resource_id}|{json.dumps(log.details)}|{log.previous_hash}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    async def _get_latest_hash(self, db: AsyncSession) -> Optional[str]:
        """Get hash of the most recent audit log entry"""
        result = await db.execute(
            select(AuditLog)
            .order_by(AuditLog.timestamp.desc())
            .limit(1)
        )
        latest = result.scalar_one_or_none()
        return latest.hash if latest else None


# Initialize global service
audit_log_service = AuditLogService()
