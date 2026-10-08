from slowapi import Limiter
from fastapi import Request

def get_client_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        ips = [ip.strip() for ip in x_forwarded_for.split(",")]
        if ips:
            return ips[-1]
    return request.client.host if request.client else "127.0.0.1"

limiter = Limiter(key_func=get_client_ip)
