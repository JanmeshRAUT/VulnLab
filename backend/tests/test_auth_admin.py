import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from unittest.mock import patch

@pytest.mark.asyncio
@patch('app.api.admin.get_session_identity')
async def test_student_cannot_create_all_perms_role(mock_identity):
    mock_identity.return_value = {"email": "student@test.com", "role": "student", "user_id": "123"}
    # Note: student does not have "Manage Roles" permission.
    # The endpoint will reject it with 403.
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/admin/roles", json={
            "name": "new_role",
            "description": "test",
            "permissions": ["Manage Users", "Manage Labs", "Manage Variants", "Manage Sessions", "View Reports", "Manage Students", "Create Labs", "Edit Labs", "Delete Labs", "Manage Roles", "Manage Access Control", "View Sessions", "Export Reports", "Platform Settings"],
            "is_default": False
        }, headers={"X-CSRF-Token": "test"}, cookies={"csrf_token": "test"})
        assert "Admin privileges required" in res.text or res.status_code == 403

@pytest.mark.asyncio
@patch('app.api.admin.get_session_identity')
@patch('app.api.admin.has_permission')
async def test_instructor_cannot_create_all_perms_role(mock_has_perm, mock_identity):
    # Instructor might have Manage Roles (mocked here)
    mock_identity.return_value = {"email": "inst@test.com", "role": "instructor", "user_id": "123"}
    mock_has_perm.return_value = True
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/admin/roles", json={
            "name": "new_role",
            "description": "test",
            "permissions": ["Manage Users", "Manage Labs", "Manage Variants", "Manage Sessions", "View Reports", "Manage Students", "Create Labs", "Edit Labs", "Delete Labs", "Manage Roles", "Manage Access Control", "View Sessions", "Export Reports", "Platform Settings"],
            "is_default": False
        }, headers={"X-CSRF-Token": "test"}, cookies={"csrf_token": "test"})
        assert res.status_code == 403
        assert "Cannot assign restricted permission: Manage Roles" in res.text

@pytest.mark.asyncio
@patch('app.api.admin.get_session_identity')
@patch('app.api.admin.has_permission')
async def test_student_cannot_assign_super_admin(mock_has_perm, mock_identity):
    mock_identity.return_value = {"email": "inst@test.com", "role": "instructor", "user_id": "123"}
    mock_has_perm.return_value = True
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/admin/roles/assign", json={
            "student_id": "some_student",
            "role": "super_admin"
        }, headers={"X-CSRF-Token": "test"}, cookies={"csrf_token": "test"})
        assert res.status_code == 403
        assert "Only super_admin can assign the super_admin role" in res.text

@pytest.mark.asyncio
@patch('app.api.admin.get_session_identity')
@patch('app.api.admin.has_permission')
async def test_cannot_edit_builtin_roles(mock_has_perm, mock_identity):
    mock_identity.return_value = {"email": "super@test.com", "role": "super_admin", "user_id": "123"}
    mock_has_perm.return_value = True
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/admin/roles", json={
            "name": "student",
            "description": "edit",
            "permissions": [],
            "is_default": False
        }, headers={"X-CSRF-Token": "test"}, cookies={"csrf_token": "test"})
        assert res.status_code == 403
        assert "Cannot edit built-in roles" in res.text


@pytest.mark.asyncio
@patch('app.api.admin.get_session_identity')
@patch('app.api.admin.has_permission')
async def test_dashboard_permission_filtering(mock_has_perm, mock_identity):
    mock_identity.return_value = {"email": "admin@test.com", "role": "admin", "user_id": "123"}

    # Case 1: Caller only has Manage Students
    async def fake_has_perm(role, perm):
        return perm == "Manage Students"

    mock_has_perm.side_effect = fake_has_perm
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/admin/dashboard")
        assert res.status_code == 200
        data = res.json()
        assert data["roles"] == []
        assert data["sessions"] == []
        assert data["audit_logs"] == []

    # Case 2: Caller only has Manage Roles
    async def fake_has_perm_roles(role, perm):
        return perm == "Manage Roles"

    mock_has_perm.side_effect = fake_has_perm_roles
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/admin/dashboard")
        assert res.status_code == 200
        data = res.json()
        assert data["students"] == []
        assert data["sessions"] == []
        assert data["audit_logs"] == []


@pytest.mark.asyncio
@patch('app.api.admin.get_session_identity')
@patch('app.api.admin.has_permission')
async def test_dashboard_pagination_bounds(mock_has_perm, mock_identity):
    mock_identity.return_value = {"email": "admin@test.com", "role": "admin", "user_id": "123"}
    mock_has_perm.return_value = True

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Limit > 200 is rejected by FastAPI bounds
        res_over = await ac.get("/api/admin/dashboard?limit=250")
        assert res_over.status_code == 422

        # Limit < 1 is rejected by FastAPI bounds
        res_under = await ac.get("/api/admin/dashboard?limit=0")
        assert res_under.status_code == 422

        # Valid pagination returns 200 and pagination metadata
        res_valid = await ac.get("/api/admin/dashboard?page=1&limit=50")
        assert res_valid.status_code == 200
        data = res_valid.json()
        assert "pagination" in data
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["limit"] == 50


@pytest.mark.asyncio
@patch('app.api.admin.get_session_identity')
@patch('app.api.admin.has_permission')
async def test_bulk_grant_empty_filter_rejected(mock_has_perm, mock_identity):
    mock_identity.return_value = {"email": "admin@test.com", "role": "admin", "user_id": "123"}
    mock_has_perm.return_value = True

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # No filter and all_users=False -> 400
        res_rejected = await ac.post(
            "/api/admin/access/bulk-grant",
            json={"lab_ids": ["lab-1"], "permission": "Allowed"},
            headers={"X-CSRF-Token": "test"},
            cookies={"csrf_token": "test"},
        )
        assert res_rejected.status_code == 400
        assert "At least one filter" in res_rejected.text

        # With all_users=True -> accepted
        res_allowed = await ac.post(
            "/api/admin/access/bulk-grant",
            json={"lab_ids": ["lab-1"], "permission": "Allowed", "all_users": True},
            headers={"X-CSRF-Token": "test"},
            cookies={"csrf_token": "test"},
        )
        assert res_allowed.status_code == 200
        assert res_allowed.json().get("success") is True

