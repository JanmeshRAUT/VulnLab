import pytest
from app.core.config import Settings
import os

def test_config_list_parsing():
    # Test comma-separated string
    os.environ['ALLOWED_EMAIL_DOMAINS'] = ' test.com, EXAMPLE.com , '
    settings = Settings()
    assert settings.ALLOWED_EMAIL_DOMAINS == ['test.com', 'example.com']
    
    # Test JSON list
    os.environ['ALLOWED_EMAIL_DOMAINS'] = '["json.com", " TEXT.com "]'
    settings = Settings()
    assert settings.ALLOWED_EMAIL_DOMAINS == ['json.com', 'text.com']
    
    # Test empty string
    os.environ['ALLOWED_EMAIL_DOMAINS'] = ''
    settings = Settings()
    assert settings.ALLOWED_EMAIL_DOMAINS == []
    
    # Test missing value (unset)
    del os.environ['ALLOWED_EMAIL_DOMAINS']
    settings = Settings()
    assert settings.ALLOWED_EMAIL_DOMAINS == []
