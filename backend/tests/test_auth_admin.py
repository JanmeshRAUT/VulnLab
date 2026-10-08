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
