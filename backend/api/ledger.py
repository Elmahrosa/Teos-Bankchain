from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from backend.core.database import get_db
from backend.core.security import verify_token
from backend.ledger.service import LedgerService
from backend.ledger.schemas import (
    AccountCreate,
    AccountResponse,
    TransactionCreate,
    TransactionResponse
)

router = APIRouter()

@router.post("/accounts", response_model=AccountResponse)
async def create_account(
    account_data: AccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Create new account"""
    account = await LedgerService.create_account(db, account_data)
    return account

@router.get("/accounts/{account_id}", response_model=AccountResponse)
async def get_account(
    account_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get account by ID"""
    account = await LedgerService.get_account(db, account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.get("/accounts", response_model=List[AccountResponse])
async def get_user_accounts(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get all accounts for current user"""
    user_id = current_user.get("sub")
    accounts = await LedgerService.get_user_accounts(db, user_id)
    return accounts

@router.post("/transactions", response_model=TransactionResponse)
async def create_transaction(
    transaction_data: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Create new transaction"""
    transaction = await LedgerService.create_transaction(db, transaction_data)
    return transaction
