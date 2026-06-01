import hmac
import hashlib
from app.core.config import settings

def generate_flag(instance_id: str, objective_id: str) -> str:
    """
    Generates a unique, stateless flag using HMAC-SHA256.
    FLAG format: VulnLab{hash}
    """
    message = f"{instance_id}:{objective_id}".encode('utf-8')
    secret = settings.SECRET_KEY.encode('utf-8')
    
    hash_obj = hmac.new(secret, message, hashlib.sha256)
    flag_hash = hash_obj.hexdigest()
    
    return f"VulnLab{{{flag_hash}}}"

def verify_flag(instance_id: str, objective_id: str, submitted_flag: str) -> bool:
    """
    Verifies a submitted flag against the dynamically generated flag.
    Uses hmac.compare_digest to prevent timing attacks.
    """
    expected_flag = generate_flag(instance_id, objective_id)
    return hmac.compare_digest(expected_flag, submitted_flag)
