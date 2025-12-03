from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.ledger.models import Account, Transaction, TransactionStatus
from backend.ledger.schemas import AccountCreate, TransactionCreate
import uuid

class LedgerService:
    """Service for ledger operations"""
    
    @staticmethod
    async def create_account(db: AsyncSession, account_data: AccountCreate) -> Account:
        """Create new account"""
        account = Account(
            id=str(uuid.uuid4()),
            user_id=account_data.user_id,
            account_type=account_data.account_type,
            currency=account_data.currency,
            balance=0
        )
        db.add(account)
        await db.flush()
        return account
    
    @staticmethod
    async def get_account(db: AsyncSession, account_id: str) -> Optional[Account]:
        """Get account by ID"""
        result = await db.execute(select(Account).where(Account.id == account_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_accounts(db: AsyncSession, user_id: str) -> List[Account]:
        """Get all accounts for a user"""
        result = await db.execute(select(Account).where(Account.user_id == user_id))
        return result.scalars().all()
    
    @staticmethod
    async def create_transaction(
        db: AsyncSession,
        transaction_data: TransactionCreate
    ) -> Transaction:
        """Create new transaction"""
        transaction = Transaction(
            id=str(uuid.uuid4()),
            account_id=transaction_data.account_id,
            type=transaction_data.type,
            amount=transaction_data.amount,
            currency=transaction_data.currency,
            from_address=transaction_data.from_address,
            to_address=transaction_data.to_address,
            reference=transaction_data.reference,
            metadata=transaction_data.metadata
        )
        db.add(transaction)
        await db.flush()
        return transaction
    
    @staticmethod
    async def update_transaction_status(
        db: AsyncSession,
        transaction_id: str,
        status: TransactionStatus
    ) -> Optional[Transaction]:
        """Update transaction status"""
        result = await db.execute(
            select(Transaction).where(Transaction.id == transaction_id)
        )
        transaction = result.scalar_one_or_none()
        
        if transaction:
            transaction.status = status
            await db.flush()
        
        return transaction
