import pytest
from httpx import AsyncClient, ASGITransport
import mongomock_motor
from app.main import app
from unittest.mock import patch


@pytest.fixture(autouse=True)
def mock_db():
    mock_client = mongomock_motor.AsyncMongoMockClient()
    mock_db = mock_client.get_database("test_db")
    
    with patch("app.core.database.get_database", return_value=mock_db):
        with patch("app.core.database.db", mock_db):
            yield mock_db


async def get_auth_client(mock_db) -> AsyncClient:
    await mock_db.users.insert_one({"email": "student8@test.com", "role": "student"})
    user = await mock_db.users.find_one({"email": "student8@test.com"})
    
    client = AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"X-CSRF-Token": "test_csrf_token"},
        cookies={"csrf_token": "test_csrf_token"}
    )
    
    app.dependency_overrides = {}
    from app.api.auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: user
    
    return client


@pytest.mark.asyncio
async def test_lab8_variant_1a(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_8_1a",
        "lab_id": "8",
        "variant_id": "1a",
        "status": "ACTIVE",
        "state": {"flag_records": []}
    }
    await mock_db.instances.insert_one(inst)
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    payload = "<script>alert(1)</script>"
    res = await client.post("/api/lab8/1/detect", json={"payload": payload, "variant": "a"})
    assert res.status_code == 200
    data = res.json()
    assert data["reflected"] == payload
    assert data["payload_detected"] is True
    assert data["flag"] is not None
    assert "FLAG{" in data["flag"]


@pytest.mark.asyncio
async def test_lab8_variant_1b(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_8_1b",
        "lab_id": "8",
        "variant_id": "1b",
        "status": "ACTIVE",
        "state": {"flag_records": []}
    }
    await mock_db.instances.insert_one(inst)
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    payload = '<img src=x onerror=alert("XSS")>'
    res = await client.post("/api/lab8/1/detect", json={"payload": payload, "variant": "b"})
    assert res.status_code == 200
    data = res.json()
    assert data["reflected"] == payload
    assert data["payload_detected"] is True
    assert data["flag"] is not None
    assert "FLAG{" in data["flag"]


@pytest.mark.asyncio
async def test_lab8_variant_1c(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_8_1c",
        "lab_id": "8",
        "variant_id": "1c",
        "status": "ACTIVE",
        "state": {"flag_records": []}
    }
    await mock_db.instances.insert_one(inst)
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    payload = '<svg onload=alert(1)>'
    res = await client.post("/api/lab8/1/detect", json={"payload": payload, "variant": "c"})
    assert res.status_code == 200
    data = res.json()
    assert data["reflected"] == payload
    assert data["payload_detected"] is True
    assert data["flag"] is not None
    assert "FLAG{" in data["flag"]


@pytest.mark.asyncio
async def test_lab8_variant_1d(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_8_1d",
        "lab_id": "8",
        "variant_id": "1d",
        "status": "ACTIVE",
        "state": {"flag_records": []}
    }
    await mock_db.instances.insert_one(inst)
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    payload = 'javascript:alert(1)'
    res = await client.post("/api/lab8/1/detect", json={"payload": payload, "variant": "d"})
    assert res.status_code == 200
    data = res.json()
    assert data["reflected"] == payload
    assert data["payload_detected"] is True
    assert data["flag"] is not None
    assert "FLAG{" in data["flag"]


@pytest.mark.asyncio
async def test_lab8_variant_1e(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_8_1e",
        "lab_id": "8",
        "variant_id": "1e",
        "status": "ACTIVE",
        "state": {"flag_records": []}
    }
    await mock_db.instances.insert_one(inst)
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    payload = '"><script>alert(1)</script>'
    res = await client.post("/api/lab8/1/detect", json={"payload": payload, "variant": "e"})
    assert res.status_code == 200
    data = res.json()
    assert data["reflected"] == payload
    assert data["payload_detected"] is True
    assert data["flag"] is not None
    assert "FLAG{" in data["flag"]


@pytest.mark.asyncio
async def test_lab8_variant_2_stored(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_8_2",
        "lab_id": "8",
        "variant_id": "2",
        "status": "ACTIVE",
        "state": {"flag_records": []}
    }
    await mock_db.instances.insert_one(inst)
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    # First GET - no exploit yet
    get_res = await client.get("/api/lab8/2/profile")
    assert get_res.status_code == 200
    assert get_res.json()["flag"] is None

    # POST stored XSS payload
    update_data = {
        "full_name": "Hacker",
        "email": "hacker@evil.com",
        "address": "1337 Street",
        "bio": "<script>alert(document.cookie)</script>"
    }
    post_res = await client.post("/api/lab8/2/profile", json=update_data)
    assert post_res.status_code == 200
    post_json = post_res.json()
    assert post_json["success"] is True
    assert post_json["flag"] is not None
    assert "FLAG{" in post_json["flag"]

    # Re-fetch profile, flag should still be present
    inst["state"]["flag_records"].append({
        "objective_id": "lab8:2",
        "flag_value": post_json["flag"]
    })
    get_res2 = await client.get("/api/lab8/2/profile")
    assert get_res2.status_code == 200
    assert get_res2.json()["flag"] == post_json["flag"]


@pytest.mark.asyncio
async def test_lab8_benign_payload(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_8_1a",
        "lab_id": "8",
        "variant_id": "1a",
        "status": "ACTIVE",
        "state": {"flag_records": []}
    }
    await mock_db.instances.insert_one(inst)
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    payload = "Hello World, standard search term"
    res = await client.post("/api/lab8/1/detect", json={"payload": payload, "variant": "a"})
    assert res.status_code == 200
    data = res.json()
    assert data["reflected"] == payload
    assert data["payload_detected"] is False
    assert data["flag"] is None


@pytest.mark.asyncio
async def test_lab8_instance_mismatch(mock_db):
    client = await get_auth_client(mock_db)
    inst = {
        "instance_id": "inst_wrong",
        "lab_id": "1",
        "variant_id": "1",
        "status": "ACTIVE"
    }
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = lambda: inst

    res = await client.post("/api/lab8/1/detect", json={"payload": "<script>alert(1)</script>", "variant": "a"})
    assert res.status_code == 403
