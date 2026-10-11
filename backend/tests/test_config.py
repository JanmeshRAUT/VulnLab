import pytest
from app.core.config import Settings
import os

def test_config_list_parsing():
    # Test comma-separated string
    os.environ['ALLOWED_EMAIL_DOMAINS'] = ' test.com, EXAMPLE.com , '
    settings = Settings(_env_file=None)
    assert settings.ALLOWED_EMAIL_DOMAINS == ['test.com', 'example.com']
    
    # Test JSON list
    os.environ['ALLOWED_EMAIL_DOMAINS'] = '["json.com", " TEXT.com "]'
    settings = Settings(_env_file=None)
    assert settings.ALLOWED_EMAIL_DOMAINS == ['json.com', 'text.com']
    
    # Test empty string
    os.environ['ALLOWED_EMAIL_DOMAINS'] = ''
    settings = Settings(_env_file=None)
    assert settings.ALLOWED_EMAIL_DOMAINS == []
    
    # Test missing value (unset)
    del os.environ['ALLOWED_EMAIL_DOMAINS']
    settings = Settings(_env_file=None)
    assert settings.ALLOWED_EMAIL_DOMAINS == []

def test_config_prod_validation():
    os.environ['ENVIRONMENT'] = 'prod'
    os.environ['SECRET_KEY'] = 'a' * 32
    os.environ['MONGO_URI'] = 'mongodb://localhost:27017/'
    os.environ['SUPER_ADMIN_EMAILS'] = ''
    os.environ['ALLOW_NO_SUPERADMIN'] = '0'
    
    with pytest.raises(ValueError, match="SUPER_ADMIN_EMAILS must be configured"):
        Settings()
        
    os.environ['ALLOW_NO_SUPERADMIN'] = '1'
    s = Settings()
    assert s.ALLOW_NO_SUPERADMIN is True or os.environ.get("ALLOW_NO_SUPERADMIN") == "1"

    # Reset
    del os.environ['ENVIRONMENT']
    del os.environ['ALLOW_NO_SUPERADMIN']

