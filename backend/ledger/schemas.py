from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from typing import Optional

class AccountCreate(BaseModel):
    user_id: str
    account_type: str = Field(..., pattern="^(custodial|non_custodial)$")
    currency: str

class AccountResponse(BaseModel):
    id: str
    user_id: str
    account_type: str
    currency: str
    balance: Decimal
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    account_id: str
    type: str
    amount: Decimal
    currency: str
    from_address: Optional[str] = None
    to_address: Optional[str] = None
    reference: Optional[str] = None
    metadata: Optional[str] = None

class TransactionResponse(BaseModel):
    id: str
    account_id: str
    type: str
    status: str
    amount: Decimal
    currency: str
    created_at: datetime
    
    class Config:
        from_attributes = True
