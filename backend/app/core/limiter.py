from slowapi import Limiter
from fastapi import Request

def get_client_ip(request: Request) -> str:
    user_id = None
    if hasattr(request, "session") and isinstance(request.session, dict):
        user_id = request.session.get("user_id")
    elif hasattr(request, "session"):
        try:
            user_id = request.session.get("user_id")
        except Exception:
            user_id = None
            
    if user_id:
        return f"u:{user_id}"
    return get_strict_ip(request)

# Strict IP-only key function for unauthenticated routes (login, register, OAuth start)
def get_strict_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        ips = [ip.strip() for ip in x_forwarded_for.split(",")]
        if ips:
            return ips[-1]
    return request.client.host if request.client else "127.0.0.1"

def get_user_objective_key(request: Request) -> str:
    user_or_ip = get_client_ip(request)
    obj_id = "none"
    if hasattr(request, "scope") and isinstance(request.scope, dict):
        parsed = request.scope.get("parsed_body")
        if isinstance(parsed, dict) and "objective_id" in parsed:
            obj_id = str(parsed["objective_id"])
    if obj_id == "none" and hasattr(request, "state"):
        obj_id = str(getattr(request.state, "objective_id", "none"))
    return f"{user_or_ip}:obj:{obj_id}"

limiter = Limiter(key_func=get_client_ip)
