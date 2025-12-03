from sqlalchemy import Column, String, Numeric, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from backend.core.database import Base

class TransactionType(str, enum.Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"
    EXCHANGE = "exchange"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    FAILED = "failed"

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    account_type = Column(String, nullable=False)  # custodial, non_custodial
    currency = Column(String, nullable=False)
    balance = Column(Numeric(20, 8), default=0)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    transactions = relationship("Transaction", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True)
    account_id = Column(String, ForeignKey("accounts.id"))
    type = Column(SQLEnum(TransactionType))
    status = Column(SQLEnum(TransactionStatus), default=TransactionStatus.PENDING)
    amount = Column(Numeric(20, 8), nullable=False)
    currency = Column(String, nullable=False)
    from_address = Column(String)
    to_address = Column(String)
    reference = Column(String)
    metadata = Column(String)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    account = relationship("Account", back_populates="transactions")
