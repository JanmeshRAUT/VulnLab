import pytest
from app.core.limiter import get_client_ip
from fastapi import Request
from unittest.mock import MagicMock

def test_get_client_ip_with_spoofed_x_forwarded_for():
    # Setup 11 requests with different fake X-Forwarded-For values in front
    # Render appends the real IP at the end
    real_ip = "203.0.113.5"
    
    for i in range(11):
        fake_ip = f"10.0.0.{i}"
        mock_request = MagicMock(spec=Request)
        # Headers is a dict-like object
        mock_request.headers = {"X-Forwarded-For": f"{fake_ip}, {real_ip}"}
        
        ip = get_client_ip(mock_request)
        assert ip == real_ip

def test_get_client_ip_missing_header():
    mock_request = MagicMock(spec=Request)
    mock_request.headers = {}
    mock_request.client.host = "192.168.1.100"
    
    ip = get_client_ip(mock_request)
    assert ip == "192.168.1.100"
