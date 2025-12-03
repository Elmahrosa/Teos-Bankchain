from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.database import get_db
from backend.core.security import verify_token
from backend.payments.pi_service import PiNetworkService
from backend.payments.fx_service import FXService
from pydantic import BaseModel
from typing import Dict

router = APIRouter()
pi_service = PiNetworkService()
fx_service = FXService()

class PaymentCreate(BaseModel):
    amount: float
    currency: str
    memo: str
    metadata: Dict

class FXConversion(BaseModel):
    amount: float
    from_currency: str
    to_currency: str

@router.post("/pi/create")
async def create_pi_payment(
    payment_data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Create Pi Network payment"""
    try:
        result = await pi_service.create_payment(
            amount=payment_data.amount,
            memo=payment_data.memo,
            metadata=payment_data.metadata
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/pi/{payment_id}")
async def get_pi_payment(
    payment_id: str,
    current_user: dict = Depends(verify_token)
):
    """Get Pi payment status"""
    try:
        result = await pi_service.get_payment(payment_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/fx/rates")
async def get_fx_rates(
    base: str = "USD",
    current_user: dict = Depends(verify_token)
):
    """Get FX rates"""
    try:
        rates = await fx_service.get_rates(base)
        return {"base": base, "rates": rates}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/fx/convert")
async def convert_currency(
    conversion: FXConversion,
    current_user: dict = Depends(verify_token)
):
    """Convert between currencies"""
    try:
        result = await fx_service.convert(
            conversion.amount,
            conversion.from_currency,
            conversion.to_currency
        )
        return {
            "amount": conversion.amount,
            "from_currency": conversion.from_currency,
            "to_currency": conversion.to_currency,
            "converted_amount": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
