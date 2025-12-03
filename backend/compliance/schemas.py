from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str]
    action: str
    resource: Optional[str]
    details: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True

class ComplianceAlertResponse(BaseModel):
    id: str
    alert_type: str
    severity: str
    user_id: Optional[str]
    transaction_id: Optional[str]
    description: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class KYCVerificationRequest(BaseModel):
    user_id: str
    full_name: str
    date_of_birth: str
    nationality: str
    id_type: str
    id_number: str

class SanctionCheckResult(BaseModel):
    entity_name: str
    entity_type: str
    country: Optional[str]
    risk_level: str
    matches: List[Dict[str, Any]]
    checked_at: datetime
    lists_checked: List[str]

class SanctionScreeningRequest(BaseModel):
    name: str
    country: Optional[str] = None
    entity_type: str = "individual"

class AuditLogExportRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    format: str = "json"  # json or csv

class AuditLogExportResponse(BaseModel):
    data: str
    format: str
    record_count: int
    generated_at: datetime
