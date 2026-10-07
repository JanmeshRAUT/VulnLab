from slowapi import Limiter
from fastapi import Request

def get_client_ip(request: Request) -> str:
    # Forwarded header from ProxyHeadersMiddleware
    return request.client.host if request.client else "127.0.0.1"

limiter = Limiter(key_func=get_client_ip)
