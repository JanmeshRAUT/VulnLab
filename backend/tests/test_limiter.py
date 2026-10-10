import pytest
from app.core.limiter import get_client_ip, get_strict_ip
from fastapi import Request
from unittest.mock import MagicMock

def test_get_client_ip_with_spoofed_x_forwarded_for():
    real_ip = "203.0.113.5"
    
    for i in range(11):
        fake_ip = f"10.0.0.{i}"
        mock_request = MagicMock(spec=Request)
        mock_request.session = {}
        mock_request.headers = {"X-Forwarded-For": f"{fake_ip}, {real_ip}"}
        
        ip = get_client_ip(mock_request)
        assert ip == real_ip

def test_get_client_ip_missing_header():
    mock_request = MagicMock(spec=Request)
    mock_request.session = {}
    mock_request.headers = {}
    mock_request.client.host = "192.168.1.100"
    
    ip = get_client_ip(mock_request)
    assert ip == "192.168.1.100"

def test_get_client_ip_with_user_id():
    mock_request = MagicMock(spec=Request)
    mock_request.session = {"user_id": "user123"}
    mock_request.headers = {"X-Forwarded-For": "1.2.3.4, 203.0.113.5"}
    
    ip = get_client_ip(mock_request)
    assert ip == "u:user123"

def test_get_strict_ip_ignores_user_id():
    mock_request = MagicMock(spec=Request)
    mock_request.session = {"user_id": "user123"}
    mock_request.headers = {"X-Forwarded-For": "1.2.3.4, 203.0.113.5"}
    
    ip = get_strict_ip(mock_request)
    assert ip == "203.0.113.5"
