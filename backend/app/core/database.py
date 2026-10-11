import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

_client = None

def get_database():
    global _client
    try:
        current_loop = asyncio.get_running_loop()
    except RuntimeError:
        current_loop = None

    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGO_URI, tlsCAFile=certifi.where())
    else:
        try:
            client_loop = _client.get_io_loop()
            if client_loop.is_closed() or (current_loop is not None and client_loop != current_loop):
                _client = AsyncIOMotorClient(settings.MONGO_URI, tlsCAFile=certifi.where())
        except Exception:
            _client = AsyncIOMotorClient(settings.MONGO_URI, tlsCAFile=certifi.where())

    return _client[settings.MONGO_DB]


class _DatabaseProxy:
    def __getattr__(self, name: str):
        return getattr(get_database(), name)

    def __getitem__(self, name: str):
        return get_database()[name]


class _ClientProxy:
    def __getattr__(self, name: str):
        get_database()
        return getattr(_client, name)

    def __getitem__(self, name: str):
        get_database()
        return _client[name]


db = _DatabaseProxy()
client = _ClientProxy()
