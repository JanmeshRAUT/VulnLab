import os
import pytest
from unittest.mock import patch
import mongomock_motor

# Ensure testing environment variables are active before settings or app are imported
os.environ["ENVIRONMENT"] = "test"
os.environ["ALLOW_NO_SUPERADMIN"] = "1"
os.environ["SECRET_KEY"] = "test_secret_key_32_characters_long_min_ok"
os.environ["MONGO_URI"] = "mongodb://localhost:27017/"

@pytest.fixture(autouse=True)
def mock_db():
    import app.core.database as db_mod
    mock_client = mongomock_motor.AsyncMongoMockClient()
    mock_db = mock_client.get_database("test_db")
    db_mod._test_db = mock_db
    try:
        with patch("app.core.database.get_database", return_value=mock_db):
            with patch("app.core.database.db", mock_db):
                yield mock_db
    finally:
        db_mod._test_db = None

