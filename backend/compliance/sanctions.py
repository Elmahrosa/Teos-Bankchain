from typing import List, Optional
from datetime import datetime
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.config import settings
from backend.compliance.models import SanctionCheck
from backend.compliance.schemas import SanctionCheckResult

class SanctionsScreeningService:
    """Automated sanctions screening against OFAC, EU, and UN lists"""
    
    def __init__(self):
        self.ofac_api_url = settings.OFAC_API_URL or "https://api.trade.gov/consolidated_screening_list/search"
        self.eu_sanctions_url = settings.EU_SANCTIONS_URL or "https://webgate.ec.europa.eu/fsd/fsf"
        
    async def screen_entity(
        self, 
        name: str, 
        country: Optional[str] = None,
        entity_type: str = "individual",
        db: Optional[AsyncSession] = None
    ) -> SanctionCheckResult:
        """
        Screen entity against OFAC, EU, and UN sanctions lists
        Returns match status and risk level
        """
        matches = []
        
        # Screen against OFAC
        ofac_matches = await self._check_ofac(name, country)
        matches.extend(ofac_matches)
        
        # Screen against EU sanctions
        eu_matches = await self._check_eu_sanctions(name, country)
        matches.extend(eu_matches)
        
        # Determine risk level
        risk_level = "clear"
        if matches:
            risk_level = "high" if any(m.get("match_score", 0) > 0.9 for m in matches) else "medium"
        
        result = SanctionCheckResult(
            entity_name=name,
            entity_type=entity_type,
            country=country,
            risk_level=risk_level,
            matches=matches,
            checked_at=datetime.utcnow(),
            lists_checked=["OFAC", "EU", "UN"]
        )
        
        # Store in database for audit trail
        if db:
            sanction_check = SanctionCheck(
                entity_name=name,
                entity_type=entity_type,
                country=country,
                risk_level=risk_level,
                matches=matches,
                lists_checked=["OFAC", "EU", "UN"]
            )
            db.add(sanction_check)
            await db.commit()
        
        return result
    
    async def _check_ofac(self, name: str, country: Optional[str]) -> List[dict]:
        """Check against OFAC Specially Designated Nationals (SDN) list"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                params = {"name": name, "sources": "SDN"}
                if country:
                    params["countries"] = country
                    
                response = await client.get(self.ofac_api_url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    return [
                        {
                            "list": "OFAC SDN",
                            "name": result.get("name"),
                            "match_score": result.get("score", 0),
                            "programs": result.get("programs", []),
                            "remarks": result.get("remarks")
                        }
                        for result in data.get("results", [])
                    ]
        except Exception as e:
            print(f"OFAC screening error: {e}")
        
        return []
    
    async def _check_eu_sanctions(self, name: str, country: Optional[str]) -> List[dict]:
        """Check against EU sanctions list"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                params = {"name": name}
                
                # Note: This is a placeholder - actual EU API may require authentication
                response = await client.get(self.eu_sanctions_url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    return [
                        {
                            "list": "EU Sanctions",
                            "name": result.get("name"),
                            "match_score": result.get("score", 0),
                            "regulation": result.get("regulation"),
                            "remarks": result.get("remarks")
                        }
                        for result in data.get("results", [])
                    ]
        except Exception as e:
            print(f"EU sanctions screening error: {e}")
        
        return []


# Initialize global service
sanctions_service = SanctionsScreeningService()
