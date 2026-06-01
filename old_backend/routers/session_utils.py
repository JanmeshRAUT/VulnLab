import hashlib
import os
import uuid

from fastapi import Request, HTTPException, Header, Query
import mongodb_client


SESSION_BASE_ID_KEY = "base_identity"
SESSION_VARIANT_IDS_KEY = "variant_session_ids"


def normalize_variant_key(lab_id: str, variation: str = "default") -> str:
    return f"{lab_id}:{(variation or 'default').strip()}"


def get_base_identity(request: Request) -> str:
    identity = request.session.get(SESSION_BASE_ID_KEY)
    if not identity:
        identity = request.session.get("user_id")
    if not identity:
        identity = request.headers.get("X-SSRF-Researcher-GUID")
    if not identity:
        identity = f"guest-{uuid.uuid4().hex}"
    request.session[SESSION_BASE_ID_KEY] = identity
    return identity


def get_variant_session_id(request: Request, lab_id: str, variation: str = "default") -> str:
    # 1. First, check if the frontend has provided an ephemeral instance ID
    ephemeral_id = request.headers.get("X-Variant-Session-ID")
    if ephemeral_id:
        return ephemeral_id

    # 2. Fallback to deterministic ID (Legacy / backend-only interactions)
    base_identity = get_base_identity(request)
    variant_key = normalize_variant_key(lab_id, variation)
    variant_session_ids = request.session.get(SESSION_VARIANT_IDS_KEY, {})

    scoped_id = variant_session_ids.get(variant_key)
    if not scoped_id:
        secret_key = os.environ.get("SECRET_KEY", "default_vulnerable_key_replace_in_prod")
        digest = hashlib.sha256(f"{base_identity}:{variant_key}:{secret_key}".encode()).hexdigest()[:16]
        scoped_id = f"{lab_id}-{variation}-{digest}"
        variant_session_ids[variant_key] = scoped_id
        request.session[SESSION_VARIANT_IDS_KEY] = variant_session_ids

    return scoped_id


def get_valid_instance(
    x_instance_id: str = Header(None, alias="X-Variant-Session-ID"), 
    instance_id: str = Query(None, description="Optional query parameter for direct links"),
    request: Request = None
):
    """Dependency to validate the instance ID."""
    final_id = x_instance_id or instance_id
    if not final_id and request:
        final_id = request.cookies.get("instance_id")
        
    if not final_id:
        raise HTTPException(status_code=400, detail="Missing Instance ID (Header, Query, or Cookie)")
        
    instance = mongodb_client.get_instance(final_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
        
    if instance["status"] in ["EXPIRED", "ABANDONED"]:
        raise HTTPException(status_code=403, detail=f"Instance is {instance['status']} and cannot be used.")
        
    return instance


def get_random_flag(instance: dict, lab_id: str, variation: str = 'default') -> str:
    objective_id = f"{lab_id}:{variation}"
    record = mongodb_client.issue_instance_flag(instance.get('instance_id'), objective_id)
    if not record:
        raise HTTPException(status_code=500, detail="Unable to issue objective flag")
    return record['flag_value']
