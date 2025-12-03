import logging
import json
from datetime import datetime
from typing import Dict, Any, Optional
from pythonjsonlogger import jsonlogger

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter for structured logging compatible with ELK/Loki"""
    
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        
        # Add custom fields
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['service'] = 'teos-bankchain-backend'
        log_record['environment'] = self.get_environment()
        
        # Add context if available
        if hasattr(record, 'user_id'):
            log_record['user_id'] = record.user_id
        if hasattr(record, 'transaction_id'):
            log_record['transaction_id'] = record.transaction_id
        if hasattr(record, 'request_id'):
            log_record['request_id'] = record.request_id
    
    def get_environment(self) -> str:
        import os
        return os.getenv('ENVIRONMENT', 'development')


def setup_logging():
    """Configure centralized logging for ELK/Loki"""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # Console handler with JSON formatting
    console_handler = logging.StreamHandler()
    formatter = CustomJsonFormatter('%(timestamp)s %(level)s %(name)s %(message)s')
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    return logger


# Application logger
app_logger = setup_logging()


class LoggerAdapter:
    """Logger adapter with context support"""
    
    def __init__(self, logger, extra: Optional[Dict[str, Any]] = None):
        self.logger = logger
        self.extra = extra or {}
    
    def log(self, level: str, message: str, **kwargs):
        """Log with context"""
        log_record = logging.LogRecord(
            name=self.logger.name,
            level=getattr(logging, level.upper()),
            pathname="",
            lineno=0,
            msg=message,
            args=(),
            exc_info=None
        )
        
        # Add extra context
        for key, value in {**self.extra, **kwargs}.items():
            setattr(log_record, key, value)
        
        self.logger.handle(log_record)
    
    def info(self, message: str, **kwargs):
        self.log('info', message, **kwargs)
    
    def warning(self, message: str, **kwargs):
        self.log('warning', message, **kwargs)
    
    def error(self, message: str, **kwargs):
        self.log('error', message, **kwargs)
    
    def debug(self, message: str, **kwargs):
        self.log('debug', message, **kwargs)
