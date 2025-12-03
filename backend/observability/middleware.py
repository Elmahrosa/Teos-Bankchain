from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from time import time
import uuid
from backend.observability.logging import LoggerAdapter, app_logger
from backend.observability.metrics import http_requests_total, http_request_duration_seconds

class ObservabilityMiddleware(BaseHTTPMiddleware):
    """Middleware for request logging and metrics"""
    
    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Create logger with context
        logger = LoggerAdapter(app_logger, {
            'request_id': request_id,
            'method': request.method,
            'path': request.url.path
        })
        
        # Log request
        logger.info(
            f"{request.method} {request.url.path}",
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get('user-agent')
        )
        
        # Track request timing
        start_time = time()
        
        try:
            response: Response = await call_next(request)
            
            # Calculate duration
            duration = time() - start_time
            
            # Track metrics
            http_requests_total.labels(
                method=request.method,
                endpoint=request.url.path,
                status=response.status_code
            ).inc()
            
            http_request_duration_seconds.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(duration)
            
            # Log response
            logger.info(
                f"Response {response.status_code}",
                duration_ms=round(duration * 1000, 2),
                status_code=response.status_code
            )
            
            # Add request ID to response headers
            response.headers['X-Request-ID'] = request_id
            
            return response
            
        except Exception as e:
            # Log error
            logger.error(
                f"Request failed: {str(e)}",
                error_type=type(e).__name__,
                duration_ms=round((time() - start_time) * 1000, 2)
            )
            
            # Track error metrics
            http_requests_total.labels(
                method=request.method,
                endpoint=request.url.path,
                status=500
            ).inc()
            
            raise
