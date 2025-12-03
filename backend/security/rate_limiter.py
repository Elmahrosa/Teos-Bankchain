from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, Tuple
import asyncio

class RateLimiter:
    """In-memory rate limiter with sliding window"""
    
    def __init__(self):
        # Store: {key: [(timestamp, count)]}
        self._storage: Dict[str, list] = defaultdict(list)
        self._lock = asyncio.Lock()
    
    async def is_allowed(
        self,
        key: str,
        max_requests: int,
        window_seconds: int
    ) -> Tuple[bool, Dict[str, any]]:
        """
        Check if request is allowed within rate limit
        Returns (is_allowed, metadata)
        """
        async with self._lock:
            now = datetime.utcnow()
            window_start = now - timedelta(seconds=window_seconds)
            
            # Clean old entries
            if key in self._storage:
                self._storage[key] = [
                    (ts, count) for ts, count in self._storage[key]
                    if ts > window_start
                ]
            
            # Count requests in window
            current_count = sum(count for _, count in self._storage[key])
            
            if current_count >= max_requests:
                # Calculate retry after
                if self._storage[key]:
                    oldest = min(ts for ts, _ in self._storage[key])
                    retry_after = int((oldest + timedelta(seconds=window_seconds) - now).total_seconds())
                else:
                    retry_after = window_seconds
                
                return False, {
                    "limit": max_requests,
                    "remaining": 0,
                    "reset": (now + timedelta(seconds=retry_after)).timestamp(),
                    "retry_after": retry_after
                }
            
            # Allow request
            self._storage[key].append((now, 1))
            
            return True, {
                "limit": max_requests,
                "remaining": max_requests - current_count - 1,
                "reset": (window_start + timedelta(seconds=window_seconds)).timestamp()
            }


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app, limiter: RateLimiter):
        super().__init__(app)
        self.limiter = limiter
        
        # Define rate limits for different endpoint types
        self.limits = {
            "/api/v1/auth": (10, 60),  # 10 requests per minute
            "/api/v1/transactions": (100, 60),  # 100 requests per minute
            "/api/v1/compliance": (50, 60),  # 50 requests per minute
            "default": (1000, 60),  # 1000 requests per minute default
        }
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/metrics"]:
            return await call_next(request)
        
        # Get rate limit for endpoint
        max_requests, window = self._get_limit(request.url.path)
        
        # Create rate limit key (by IP and user if authenticated)
        key = self._get_key(request)
        
        # Check rate limit
        is_allowed, metadata = await self.limiter.is_allowed(key, max_requests, window)
        
        if not is_allowed:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded",
                headers={
                    "X-RateLimit-Limit": str(metadata["limit"]),
                    "X-RateLimit-Remaining": str(metadata["remaining"]),
                    "X-RateLimit-Reset": str(metadata["reset"]),
                    "Retry-After": str(metadata["retry_after"])
                }
            )
        
        # Add rate limit headers to response
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(metadata["limit"])
        response.headers["X-RateLimit-Remaining"] = str(metadata["remaining"])
        response.headers["X-RateLimit-Reset"] = str(int(metadata["reset"]))
        
        return response
    
    def _get_limit(self, path: str) -> Tuple[int, int]:
        """Get rate limit for path"""
        for prefix, limit in self.limits.items():
            if path.startswith(prefix):
                return limit
        return self.limits["default"]
    
    def _get_key(self, request: Request) -> str:
        """Generate rate limit key from request"""
        # Use IP address
        client_ip = request.client.host if request.client else "unknown"
        
        # Add user ID if authenticated
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"{client_ip}:{user_id}"
        
        return client_ip


# Global rate limiter instance
rate_limiter = RateLimiter()
