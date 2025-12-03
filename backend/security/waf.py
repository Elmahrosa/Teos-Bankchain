from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import re
from typing import List, Pattern

class WAFMiddleware(BaseHTTPMiddleware):
    """Web Application Firewall middleware for common attacks"""
    
    def __init__(self, app):
        super().__init__(app)
        
        # SQL injection patterns
        self.sql_patterns: List[Pattern] = [
            re.compile(r"(\bunion\b.*\bselect\b)", re.IGNORECASE),
            re.compile(r"(\bor\b.*=.*)", re.IGNORECASE),
            re.compile(r"(;\s*drop\s+table)", re.IGNORECASE),
            re.compile(r"(exec\s*\()", re.IGNORECASE),
            re.compile(r"(script>)", re.IGNORECASE),
        ]
        
        # XSS patterns
        self.xss_patterns: List[Pattern] = [
            re.compile(r"<script[^>]*>.*?</script>", re.IGNORECASE | re.DOTALL),
            re.compile(r"javascript:", re.IGNORECASE),
            re.compile(r"on\w+\s*=", re.IGNORECASE),
            re.compile(r"<iframe", re.IGNORECASE),
        ]
        
        # Path traversal patterns
        self.path_traversal_patterns: List[Pattern] = [
            re.compile(r"\.\./"),
            re.compile(r"\.\.\\"),
        ]
        
        # Blocked user agents (bots, scanners)
        self.blocked_user_agents: List[Pattern] = [
            re.compile(r"sqlmap", re.IGNORECASE),
            re.compile(r"nikto", re.IGNORECASE),
            re.compile(r"nmap", re.IGNORECASE),
            re.compile(r"masscan", re.IGNORECASE),
        ]
    
    async def dispatch(self, request: Request, call_next):
        # Check user agent
        user_agent = request.headers.get("user-agent", "")
        if self._is_blocked_user_agent(user_agent):
            raise HTTPException(status_code=403, detail="Forbidden")
        
        # Check for SQL injection in query parameters
        for param, value in request.query_params.items():
            if self._contains_sql_injection(str(value)):
                raise HTTPException(status_code=400, detail="Invalid request")
        
        # Check for XSS in query parameters
        for param, value in request.query_params.items():
            if self._contains_xss(str(value)):
                raise HTTPException(status_code=400, detail="Invalid request")
        
        # Check for path traversal
        if self._contains_path_traversal(request.url.path):
            raise HTTPException(status_code=400, detail="Invalid request")
        
        # Check request body if present
        if request.method in ["POST", "PUT", "PATCH"]:
            # Note: This is a simplified check. Full implementation would need
            # to parse the body without consuming the request stream
            pass
        
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        return response
    
    def _is_blocked_user_agent(self, user_agent: str) -> bool:
        """Check if user agent is blocked"""
        return any(pattern.search(user_agent) for pattern in self.blocked_user_agents)
    
    def _contains_sql_injection(self, text: str) -> bool:
        """Check for SQL injection patterns"""
        return any(pattern.search(text) for pattern in self.sql_patterns)
    
    def _contains_xss(self, text: str) -> bool:
        """Check for XSS patterns"""
        return any(pattern.search(text) for pattern in self.xss_patterns)
    
    def _contains_path_traversal(self, path: str) -> bool:
        """Check for path traversal patterns"""
        return any(pattern.search(path) for pattern in self.path_traversal_patterns)
