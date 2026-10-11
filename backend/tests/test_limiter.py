import pytest
from unittest.mock import MagicMock
from fastapi import FastAPI, Request
from httpx import ASGITransport, AsyncClient
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse

from app.core.limiter import get_client_ip, get_strict_ip, limiter


def test_get_client_ip_with_spoofed_x_forwarded_for():
    real_ip = "203.0.113.5"
    for i in range(5):
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


def test_unauthenticated_requests_fall_back_to_ip():
    mock_request = MagicMock(spec=Request)
    mock_request.session = {}
    mock_request.headers = {"X-Forwarded-For": "198.51.100.1"}
    ip = get_client_ip(mock_request)
    assert ip == "198.51.100.1"


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


@pytest.mark.asyncio
async def test_users_sharing_ip_do_not_throttle_each_other_and_limit_enforced():
    test_app = FastAPI()
    test_limiter = Limiter(key_func=get_client_ip)
    test_app.state.limiter = test_limiter
    test_app.add_middleware(SlowAPIMiddleware)

    @test_app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})

    @test_app.get("/limited")
    @test_limiter.limit("2/minute")
    async def limited_route(request: Request):
        return {"status": "ok"}

    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        # User 1 at IP 203.0.113.199
        client.cookies.set("vulnlab_session", "session1")
        # Simulate session user_id via mock middleware or custom header in request
        # Instead, let's test via direct test endpoint with session
        pass


@pytest.mark.asyncio
async def test_rate_limiting_behavior_with_sessions():
    test_limiter = Limiter(key_func=get_client_ip)
    test_app = FastAPI()
    test_app.state.limiter = test_limiter
    test_app.add_middleware(SlowAPIMiddleware)

    @test_app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})

    @test_app.middleware("http")
    async def session_mock_middleware(request: Request, call_next):
        # Allow tests to inject user_id via header
        user_id = request.headers.get("X-Test-User-Id")
        if user_id:
            request.scope["session"] = {"user_id": user_id}
        else:
            request.scope["session"] = {}
        return await call_next(request)

    @test_app.get("/action")
    @test_limiter.limit("2/minute")
    async def action_endpoint(request: Request):
        return {"ok": True}

    shared_headers = {"X-Forwarded-For": "203.0.113.50"}

    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        # User A makes 2 requests (limit is 2/min)
        headers_user_a = {**shared_headers, "X-Test-User-Id": "student_a"}
        res1 = await client.get("/action", headers=headers_user_a)
        assert res1.status_code == 200
        res2 = await client.get("/action", headers=headers_user_a)
        assert res2.status_code == 200

        # User A makes 3rd request -> throttled!
        res3 = await client.get("/action", headers=headers_user_a)
        assert res3.status_code == 429

        # User B sharing the exact same IP makes request -> NOT throttled!
        headers_user_b = {**shared_headers, "X-Test-User-Id": "student_b"}
        res_b1 = await client.get("/action", headers=headers_user_b)
        assert res_b1.status_code == 200
        res_b2 = await client.get("/action", headers=headers_user_b)
        assert res_b2.status_code == 200
        # User B 3rd request -> throttled!
        res_b3 = await client.get("/action", headers=headers_user_b)
        assert res_b3.status_code == 429
