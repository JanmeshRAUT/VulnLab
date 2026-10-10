from slowapi import Limiter
from fastapi import Request

def get_client_ip(request: Request) -> str:
    user_id = request.session.get("user_id") if hasattr(request, "session") else None
    if user_id:
        return f"u:{user_id}"
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        ips = [ip.strip() for ip in x_forwarded_for.split(",")]
        if ips:
            return ips[-1]
    return request.client.host if request.client else "127.0.0.1"

# We'll also define a strict IP-only key function for unauthenticated routes
def get_strict_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        ips = [ip.strip() for ip in x_forwarded_for.split(",")]
        if ips:
            return ips[-1]
    return request.client.host if request.client else "127.0.0.1"

limiter = Limiter(key_func=get_client_ip)
