import hashlib
import os
import uuid

from fastapi import Request


SESSION_BASE_ID_KEY = "base_identity"
SESSION_VARIANT_IDS_KEY = "variant_session_ids"
SESSION_LAB_FLAGS_KEY = "lab_flags"


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


def store_variant_flag(request: Request, lab_id: str, variation: str, flag: str) -> None:
    lab_flags = request.session.get(SESSION_LAB_FLAGS_KEY, {})
    variant_key = normalize_variant_key(lab_id, variation)
    variant_flags = list(lab_flags.get(variant_key, []))

    if flag not in variant_flags:
        variant_flags.append(flag)
    if len(variant_flags) > 25:
        variant_flags = variant_flags[-25:]

    lab_flags[variant_key] = variant_flags
    request.session[SESSION_LAB_FLAGS_KEY] = lab_flags


def get_or_generate_flag(identity_key: str, lab_id: str, variation: str = "default") -> str:
    secret_key = os.environ.get("SECRET_KEY", "default_vulnerable_key_replace_in_prod")
    seed_string = f"{identity_key}-{lab_id}-{variation}-{secret_key}"
    short_hash = hashlib.sha256(seed_string.encode()).hexdigest()[:12]
    prefix = lab_id.split('_')[0]
    return f"FLAG{{{prefix}_{variation}_{short_hash}}}"
