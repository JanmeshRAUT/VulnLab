import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from unittest.mock import AsyncMock, patch, MagicMock
from scripts.migrate_progress import migrate
from app.services.instance_service import cleanup_expired_instances
import time


@pytest.mark.asyncio
async def test_health_check_ok():
    mock_db = MagicMock()
    mock_db.command = AsyncMock(return_value={"ok": 1})

    with patch("app.core.database.get_database", return_value=mock_db):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            res = await ac.get("/health")
            assert res.status_code == 200
            assert res.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_health_check_db_failure_returns_503():
    mock_db = MagicMock()
    mock_db.command = AsyncMock(side_effect=Exception("Connection refused"))

    with patch("app.core.database.get_database", return_value=mock_db):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            res = await ac.get("/health")
            assert res.status_code == 503
            assert res.json()["status"] == "unhealthy"


@pytest.mark.asyncio
async def test_readiness_check_ok():
    mock_db = MagicMock()
    mock_db.command = AsyncMock(return_value={"ok": 1})

    with patch("app.core.database.get_database", return_value=mock_db):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            res = await ac.get("/ready")
            assert res.status_code == 200
            assert res.json()["status"] == "ready"


@pytest.mark.asyncio
async def test_readiness_check_db_failure_returns_503():
    mock_db = MagicMock()
    mock_db.command = AsyncMock(side_effect=Exception("DB down"))

    with patch("app.core.database.get_database", return_value=mock_db):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            res = await ac.get("/ready")
            assert res.status_code == 503
            assert res.json()["status"] == "not_ready"


@pytest.mark.asyncio
async def test_progress_migration_deduplication():
    import mongomock_motor
    mock_client = mongomock_motor.AsyncMongoMockClient()
    mock_db = mock_client.get_database("test_migration_db")

    # Insert a user
    await mock_db.users.insert_one({"_id": "u123", "email": "test@uni.edu"})

    # Insert duplicate legacy progress docs (null user_id)
    await mock_db.progress.insert_one({
        "email": "test@uni.edu",
        "lab_id": "lab-1",
        "variant_id": "v1",
        "is_solved": False,
        "updated_at": 100,
    })
    await mock_db.progress.insert_one({
        "email": "test@uni.edu",
        "lab_id": "lab-1",
        "variant_id": "v1",
        "is_solved": True,
        "updated_at": 200,
    })

    result = await migrate(mock_db)
    assert result["migrated"] >= 1
    assert result["deduped"] >= 1

    # Only 1 document should remain for this (user_id, lab-1, v1)
    docs = await mock_db.progress.find({"lab_id": "lab-1"}).to_list(length=None)
    assert len(docs) == 1
    assert docs[0]["user_id"] == "u123"
    assert docs[0]["is_solved"] is True


@pytest.mark.asyncio
async def test_cleanup_expired_instances_deletes_lab_uploads():
    import mongomock_motor
    mock_client = mongomock_motor.AsyncMongoMockClient()
    mock_db = mock_client.get_database("test_cleanup_db")

    past_time = time.time() - 1000
    inst_id = "inst_to_clean_123"

    # Insert an expired instance
    await mock_db.instances.insert_one({
        "instance_id": inst_id,
        "status": "EXPIRED",
        "expires_at": past_time,
        "user_id": "user1",
    })

    # Insert a corresponding lab_upload
    await mock_db.lab_uploads.insert_one({
        "instance_id": inst_id,
        "filename": "payload.php",
    })

    with patch("app.services.instance_service.get_database", return_value=mock_db):
        await cleanup_expired_instances()

    # The instance should be deleted from instances
    inst = await mock_db.instances.find_one({"instance_id": inst_id})
    assert inst is None

    # The upload should be deleted from lab_uploads
    upload = await mock_db.lab_uploads.find_one({"instance_id": inst_id})
    assert upload is None
