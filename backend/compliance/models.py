from sqlalchemy import Column, String, DateTime, Boolean, Text, JSON
from datetime import datetime
from backend.core.database import Base

class KYCRecord(Base):
    __tablename__ = "kyc_records"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(DateTime)
    nationality = Column(String)
    id_type = Column(String)
    id_number = Column(String)
    verification_status = Column(String, default="pending")
    verified_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True)
    event_type = Column(String, nullable=False)
    user_id = Column(String)
    action = Column(String, nullable=False)
    resource_type = Column(String)
    resource_id = Column(String)
    resource = Column(String)  # Keep for backwards compatibility
    details = Column(JSON)
    ip_address = Column(String)
    user_agent = Column(String)
    hash = Column(String, nullable=False)  # SHA-256 hash of entry
    signature = Column(String, nullable=False)  # Cryptographic signature
    previous_hash = Column(String)  # Hash of previous entry for chain
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

class ComplianceAlert(Base):
    __tablename__ = "compliance_alerts"
    
    id = Column(String, primary_key=True)
    alert_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    user_id = Column(String)
    transaction_id = Column(String)
    description = Column(Text)
    status = Column(String, default="open")
    resolved_by = Column(String)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class SanctionCheck(Base):
    __tablename__ = "sanction_checks"
    
    id = Column(String, primary_key=True)
    entity_name = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)  # individual, organization
    country = Column(String)
    risk_level = Column(String, nullable=False)  # clear, medium, high
    matches = Column(JSON)  # List of matches from various lists
    lists_checked = Column(JSON)  # Which lists were checked (OFAC, EU, UN)
    checked_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
