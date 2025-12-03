import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from backend.core.config import settings

def init_sentry():
    """Initialize Sentry error tracking"""
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            traces_sample_rate=0.1,  # 10% of transactions for performance monitoring
            profiles_sample_rate=0.1,  # 10% for profiling
            integrations=[
                FastApiIntegration(),
                SqlalchemyIntegration(),
                RedisIntegration(),
            ],
            # Set additional context
            before_send=before_send_handler,
        )


def before_send_handler(event, hint):
    """Filter and enrich events before sending to Sentry"""
    
    # Add custom tags
    event.setdefault('tags', {})
    event['tags']['service'] = 'teos-bankchain'
    
    # Filter sensitive data
    if 'request' in event:
        if 'data' in event['request']:
            # Mask sensitive fields
            sensitive_fields = ['password', 'pin', 'ssn', 'account_number']
            for field in sensitive_fields:
                if field in event['request']['data']:
                    event['request']['data'][field] = '***REDACTED***'
    
    return event


def capture_exception(exception: Exception, context: dict = None):
    """Capture exception with additional context"""
    with sentry_sdk.push_scope() as scope:
        if context:
            for key, value in context.items():
                scope.set_context(key, value)
        
        sentry_sdk.capture_exception(exception)


def capture_message(message: str, level: str = "info", context: dict = None):
    """Capture message with context"""
    with sentry_sdk.push_scope() as scope:
        if context:
            for key, value in context.items():
                scope.set_context(key, value)
        
        sentry_sdk.capture_message(message, level=level)
