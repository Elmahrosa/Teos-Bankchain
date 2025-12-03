from typing import Dict, Optional
import httpx
from backend.core.config import settings

class PiNetworkService:
    """Service for Pi Network integration"""
    
    BASE_URL = "https://api.minepi.com"
    
    def __init__(self):
        self.api_key = settings.PI_API_KEY
    
    async def create_payment(
        self,
        amount: float,
        memo: str,
        metadata: Dict
    ) -> Dict:
        """Create Pi payment"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/v2/payments",
                headers={"Authorization": f"Key {self.api_key}"},
                json={
                    "payment": {
                        "amount": amount,
                        "memo": memo,
                        "metadata": metadata
                    }
                }
            )
            response.raise_for_status()
            return response.json()
    
    async def approve_payment(self, payment_id: str) -> Dict:
        """Approve Pi payment"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/v2/payments/{payment_id}/approve",
                headers={"Authorization": f"Key {self.api_key}"}
            )
            response.raise_for_status()
            return response.json()
    
    async def complete_payment(self, payment_id: str, txid: str) -> Dict:
        """Complete Pi payment"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/v2/payments/{payment_id}/complete",
                headers={"Authorization": f"Key {self.api_key}"},
                json={"txid": txid}
            )
            response.raise_for_status()
            return response.json()
    
    async def get_payment(self, payment_id: str) -> Dict:
        """Get Pi payment status"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/v2/payments/{payment_id}",
                headers={"Authorization": f"Key {self.api_key}"}
            )
            response.raise_for_status()
            return response.json()
