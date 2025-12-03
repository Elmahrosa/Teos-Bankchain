from typing import Dict
import httpx
from backend.core.config import settings
from datetime import datetime, timedelta

class FXService:
    """Service for foreign exchange rates"""
    
    BASE_URL = "https://api.exchangerate-api.com/v4/latest"
    
    def __init__(self):
        self.cache = {}
        self.cache_expiry = {}
    
    async def get_rates(self, base_currency: str = "USD") -> Dict[str, float]:
        """Get FX rates for base currency"""
        
        # Check cache
        if base_currency in self.cache:
            if datetime.now() < self.cache_expiry.get(base_currency, datetime.min):
                return self.cache[base_currency]
        
        # Fetch fresh rates
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.BASE_URL}/{base_currency}")
            response.raise_for_status()
            data = response.json()
        
        # Cache for 5 minutes
        self.cache[base_currency] = data["rates"]
        self.cache_expiry[base_currency] = datetime.now() + timedelta(minutes=5)
        
        return data["rates"]
    
    async def convert(
        self,
        amount: float,
        from_currency: str,
        to_currency: str
    ) -> float:
        """Convert amount between currencies"""
        
        if from_currency == to_currency:
            return amount
        
        rates = await self.get_rates(from_currency)
        
        if to_currency not in rates:
            raise ValueError(f"Currency {to_currency} not supported")
        
        return amount * rates[to_currency]
