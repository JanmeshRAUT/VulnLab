import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from unittest.mock import patch

@pytest.mark.asyncio
async def test_flag_submit_without_login_returns_401():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/instances/test-id/submit-flag", json={"flag": "test", "objectiveId": "obj1"}, headers={"X-CSRF-Token": "test"}, cookies={"csrf_token": "test"})
        # Should be 401 Unauthorized or 403 because get_valid_instance requires valid session or header
        assert res.status_code in [401, 403]

@pytest.mark.asyncio
async def test_flag_submit_wrong_instance_returns_403():
    async def override_get_valid_instance():
        return {"instance_id": "actual-id", "state": {}}
    
    # We must patch get_valid_instance dependency. 
    # But since it's a Depends, we can use app.dependency_overrides
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = override_get_valid_instance
    
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            res = await ac.post("/api/instances/wrong-id/submit-flag", json={"flag": "test", "objectiveId": "obj1"}, headers={"X-CSRF-Token": "test"}, cookies={"csrf_token": "test"})
            # The route itself checks if instance_id == valid_id
            assert res.status_code == 403
            assert "Instance ID mismatch" in res.text
    finally:
        app.dependency_overrides.clear()

@pytest.mark.asyncio
@patch('app.api.instances.submit_flag')
@patch('app.api.instances.update_instance_status')
async def test_solved_flag_not_solved_instance_if_others_open(mock_update, mock_submit_flag):
    # return success=True, message="...", all_solved=False
    mock_submit_flag.return_value = (True, "Good", False)
    
    async def override_get_valid_instance():
        return {"instance_id": "test-id", "state": {}}
    
    from app.api.deps import get_valid_instance
    app.dependency_overrides[get_valid_instance] = override_get_valid_instance
    
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            res = await ac.post("/api/instances/test-id/submit-flag", json={"flag": "test", "objectiveId": "obj1"}, headers={"X-CSRF-Token": "test"}, cookies={"csrf_token": "test"})
            assert res.status_code == 200
            # Ensure update_instance_status was NOT called with SOLVED
            mock_update.assert_not_called()
    finally:
        app.dependency_overrides.clear()
