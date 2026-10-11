import re
import urllib.parse
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance
from app.core.database import get_database

router = APIRouter(prefix="/lab8", tags=["Lab 8"])


class DetectPayloadRequest(BaseModel):
    payload: str = Field(..., description="The XSS payload string")
    variant: str = Field("a", description="Variant identifier (a, b, c, d, e)")


class ProfileUpdateRequest(BaseModel):
    full_name: str = ""
    email: str = ""
    address: str = ""
    bio: str = ""


EVENT_HANDLERS_PATTERN = re.compile(
    r'(?:onerror|onload|onfocus|onblur|onclick|onmouseover|onmouseenter|onloadstart|onpageshow|ontoggle|onanimationstart|autofocus)\s*=',
    re.IGNORECASE
)
SCRIPT_TAG_PATTERN = re.compile(r'<\s*script[\s>]', re.IGNORECASE)
JS_PROTO_PATTERN = re.compile(r'javascript\s*:', re.IGNORECASE)
HTML_TAG_PATTERN = re.compile(r'<\s*(?:script|svg|img|iframe|body|audio|video|details|input|a|link)[\s/>]', re.IGNORECASE)


def detect_xss(payload: str, variant: str) -> bool:
    if not payload:
        return False

    raw = payload.strip()
    lower = raw.lower()
    decoded = urllib.parse.unquote(raw).lower()

    v = variant.lower().replace("1", "").strip()

    if v == "a":
        # Search: basic script tag or html execution
        if SCRIPT_TAG_PATTERN.search(lower) or ("<script" in lower and "</script>" in lower):
            return True
        if HTML_TAG_PATTERN.search(lower) and ("alert" in lower or EVENT_HANDLERS_PATTERN.search(lower)):
            return True

    elif v == "b":
        # Lookup: attribute breakout / event handlers (onerror, onload, etc.)
        if EVENT_HANDLERS_PATTERN.search(lower) or EVENT_HANDLERS_PATTERN.search(decoded):
            return True

    elif v == "c":
        # Feedback: case manipulation, SVG / tag bypass
        if re.search(r'<\s*s\s*c\s*r\s*i\s*p\s*t', lower):
            return True
        if "<svg" in lower or "<details" in lower or "ontoggle" in lower or "autofocus" in lower:
            return True
        if EVENT_HANDLERS_PATTERN.search(lower):
            return True

    elif v == "d":
        # Status: javascript: URL or pseudo-protocol
        if JS_PROTO_PATTERN.search(lower) or JS_PROTO_PATTERN.search(decoded):
            return True
        if "javascript:" in lower or "javascript:" in decoded:
            return True

    elif v == "e":
        # Upload / doc name: quote breakout
        if (">" in lower or '"' in lower or "'" in lower) and (SCRIPT_TAG_PATTERN.search(lower) or EVENT_HANDLERS_PATTERN.search(lower)):
            return True

    # General fallback: any valid XSS tag, handler, or protocol
    if SCRIPT_TAG_PATTERN.search(lower) or EVENT_HANDLERS_PATTERN.search(lower) or JS_PROTO_PATTERN.search(lower):
        return True

    return False


@router.post("/1/detect")
async def detect_xss_endpoint(
    req: DetectPayloadRequest,
    instance: dict = Depends(get_valid_instance)
):
    if instance.get("lab_id") != "8":
        raise HTTPException(status_code=403, detail="Instance mismatch: lab is not 8")

    variant_clean = req.variant.lower().replace("1", "").strip() or "a"

    detected = detect_xss(req.payload, variant_clean)
    flag = None

    if detected:
        objective_id = f"lab8:1{variant_clean}"
        record = await issue_flag_for_instance(instance["instance_id"], objective_id)
        if record:
            flag = record.get("flag_value")

    return {
        "reflected": req.payload,
        "payload_detected": detected,
        "flag": flag
    }


@router.get("/2/profile")
async def get_lab8_profile(
    instance: dict = Depends(get_valid_instance)
):
    if instance.get("lab_id") != "8":
        raise HTTPException(status_code=403, detail="Instance mismatch: lab is not 8")

    default_profile = {
        "full_name": "Alex Mercer",
        "email": "alex.mercer@techfusion.internal",
        "address": "404 Cyber Way, Sector 7",
        "bio": "Senior Security Architect"
    }

    stored_profile = instance.get("state", {}).get("profile", default_profile)

    # Check if stored XSS is already present or solved
    flag = None
    records = instance.get("state", {}).get("flag_records", [])
    for r in records:
        if r.get("objective_id") == "lab8:2":
            flag = r.get("flag_value")
            break

    if not flag:
        # Check if stored content contains an active XSS payload
        combined = " ".join(str(v) for v in stored_profile.values())
        if detect_xss(combined, "stored"):
            record = await issue_flag_for_instance(instance["instance_id"], "lab8:2")
            if record:
                flag = record.get("flag_value")

    return {
        "profile": stored_profile,
        "flag": flag
    }


@router.post("/2/profile")
async def update_lab8_profile(
    req: ProfileUpdateRequest,
    instance: dict = Depends(get_valid_instance)
):
    if instance.get("lab_id") != "8":
        raise HTTPException(status_code=403, detail="Instance mismatch: lab is not 8")

    db = get_database()
    profile_dict = req.model_dump() if hasattr(req, "model_dump") else req.dict()

    combined = " ".join(str(v) for v in profile_dict.values())
    detected = detect_xss(combined, "stored")
    flag = None

    if detected:
        record = await issue_flag_for_instance(instance["instance_id"], "lab8:2")
        if record:
            flag = record.get("flag_value")

    await db.instances.update_one(
        {"instance_id": instance["instance_id"]},
        {"$set": {"state.profile": profile_dict}}
    )

    return {
        "success": True,
        "profile": profile_dict,
        "flag": flag
    }
