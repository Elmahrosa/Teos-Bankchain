from prometheus_client import Counter, Histogram, Gauge, Info
from functools import wraps
from time import time
from typing import Callable

# Define Prometheus metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

transaction_total = Counter(
    'transactions_total',
    'Total transactions processed',
    ['type', 'status', 'currency']
)

transaction_amount = Histogram(
    'transaction_amount',
    'Transaction amounts',
    ['currency', 'type']
)

active_users = Gauge(
    'active_users',
    'Number of active users'
)

wallet_balance = Gauge(
    'wallet_balance_total',
    'Total wallet balances',
    ['currency', 'wallet_type']
)

compliance_alerts = Counter(
    'compliance_alerts_total',
    'Compliance alerts triggered',
    ['alert_type', 'severity']
)

sanctions_checks = Counter(
    'sanctions_checks_total',
    'Sanctions screening checks',
    ['risk_level']
)

database_queries = Histogram(
    'database_query_duration_seconds',
    'Database query duration',
    ['operation', 'table']
)

api_errors = Counter(
    'api_errors_total',
    'API errors',
    ['endpoint', 'error_type']
)

# Application info
app_info = Info('app_info', 'Application information')
app_info.info({
    'version': '1.0.0',
    'service': 'teos-bankchain-backend'
})


def track_request_metrics(func: Callable) -> Callable:
    """Decorator to track HTTP request metrics"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time()
        
        try:
            result = await func(*args, **kwargs)
            
            # Track successful request
            duration = time() - start_time
            http_request_duration_seconds.labels(
                method='POST',  # Adjust based on actual method
                endpoint=func.__name__
            ).observe(duration)
            
            http_requests_total.labels(
                method='POST',
                endpoint=func.__name__,
                status='200'
            ).inc()
            
            return result
            
        except Exception as e:
            # Track error
            http_requests_total.labels(
                method='POST',
                endpoint=func.__name__,
                status='500'
            ).inc()
            
            api_errors.labels(
                endpoint=func.__name__,
                error_type=type(e).__name__
            ).inc()
            
            raise
    
    return wrapper


def track_transaction_metrics(transaction_type: str, currency: str, amount: float, status: str):
    """Track transaction metrics"""
    transaction_total.labels(
        type=transaction_type,
        status=status,
        currency=currency
    ).inc()
    
    if status == 'completed':
        transaction_amount.labels(
            currency=currency,
            type=transaction_type
        ).observe(amount)


def track_compliance_alert(alert_type: str, severity: str):
    """Track compliance alert metrics"""
    compliance_alerts.labels(
        alert_type=alert_type,
        severity=severity
    ).inc()


def track_sanctions_check(risk_level: str):
    """Track sanctions screening metrics"""
    sanctions_checks.labels(risk_level=risk_level).inc()
