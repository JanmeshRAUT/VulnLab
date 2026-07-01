import json
import os
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()

# Load once at startup
_knowledge_path = os.path.join(os.path.dirname(__file__), "../../data/chatbot_knowledge.json")
try:
    with open(_knowledge_path) as f:
        KNOWLEDGE = json.load(f)
except FileNotFoundError:
    # Fallback path if running from different directory
    _knowledge_path = os.path.join(os.path.dirname(__file__), "../data/chatbot_knowledge.json")
    with open(_knowledge_path) as f:
        KNOWLEDGE = json.load(f)

def _extract_lab_id(path: str) -> str | None:
    if "path-traversal" in path or "/labs/1" in path:  return "1"
    if "ssrf" in path       or "/labs/4" in path:      return "4"
    if "file-upload" in path or "/labs/5" in path:     return "5"
    if "sql-injection" in path or "/labs/7" in path:   return "7"
    if "xss" in path        or "/labs/8" in path:      return "8"
    if "mobile" in path     or "/labs/9" in path:      return "9"
    return None

class ChatMessage(BaseModel):
    message: str
    path: str

def _handle_chat_query(message: str, lab_id: str | None) -> str:
    msg_lower = message.lower()
    platform = KNOWLEDGE.get("platform", {})
    # Build a set of allowed keywords (platform-level + lab names/titles)
    allowed_keywords = {
        "flag",
        "flags",
        "session",
        "sessions",
        "expire",
        "timeout",
        "ttl",
        "tool",
        "scanner",
        "automated",
        "role",
        "student",
        "instructor",
        "admin",
        "vpn",
        "platform",
        "vulnlab",
        "hint",
        "help",
        "stuck",
        "what",
        "explain",
        "defense",
        "fix",
        "prevent",
        "mitigate",
        "impact",
        "real world",
        "breach",
    }
    for lab in KNOWLEDGE.get("labs", []):
        if lab.get("vulnerability"):
            allowed_keywords.add(lab["vulnerability"].lower())
        if lab.get("title"):
            allowed_keywords.add(lab["title"].lower())

    # If the message doesn't contain any allowed keyword and no lab context, refuse.
    if not any(k in msg_lower for k in allowed_keywords) and not lab_id:
        # Prefer a configurable response from the knowledge file
        out_msg = KNOWLEDGE.get("out_of_scope_response")
        if out_msg:
            return out_msg
        out_of_scope = KNOWLEDGE.get("out_of_scope", [])
        out_msg = (
            "I can only answer questions about this platform and its labs. "
            "Out of scope: " + ", ".join(out_of_scope) + ". "
            "Please ask about a lab (e.g. 'SSRF hint') or platform topics like 'flags', 'sessions', or 'tools'."
        )
        return out_msg
    
    # 1. Check platform-level rules first
    if "flag" in msg_lower:
        return f"Regarding flags: {platform.get('flag_format', '')} {platform.get('flag_submission', '')}"
    if "expire" in msg_lower or "timeout" in msg_lower or "session" in msg_lower or "ttl" in msg_lower:
        return f"Session info: {platform.get('instance_ttl', '')}"
    if "tool" in msg_lower or "scanner" in msg_lower or "automated" in msg_lower:
        return f"Tools policy: {platform.get('automated_tools', '')}"
    if "role" in msg_lower or "student" in msg_lower or "instructor" in msg_lower or "admin" in msg_lower:
        return f"Roles: {', '.join(platform.get('roles', []))}"
    if "vpn" in msg_lower:
        return "No VPN is needed to access the labs."
    if "platform" in msg_lower or "vulnlab" in msg_lower:
        return platform.get('description', 'VulnLab is a hands-on cybersecurity training platform.')

    # Helper function to generate response from a specific lab's data
    def get_lab_response(lab):
        if "stuck" in msg_lower or "help" in msg_lower or "hint" in msg_lower:
            hint = lab['tiered_hints'][0] if lab.get('tiered_hints') else ''
            return f"Hint for {lab['title']}: {hint}\n\nAdvice: {lab.get('stuck_advice', '')}"
        if "what" in msg_lower or "explain" in msg_lower:
            return f"About {lab.get('title', '')}: {lab.get('what_it_is', '')}"
        if "defense" in msg_lower or "fix" in msg_lower or "prevent" in msg_lower or "mitigate" in msg_lower:
            return f"Defense for {lab['title']}: {lab.get('defense', '')}"
        if "impact" in msg_lower or "real world" in msg_lower or "breach" in msg_lower:
            return f"Real world impact of {lab['title']}: {lab.get('real_world_impact', '')}"
        
        return f"You're asking about {lab['title']}. {lab.get('what_it_is', '')} Try asking for a 'hint', 'defense', or 'impact'."

    # 2. Check if the user asks about a specific vulnerability by name globally
    for lab in KNOWLEDGE.get("labs", []):
        vuln_name = lab.get("vulnerability", "").lower()
        title = lab.get("title", "").lower()
        if vuln_name in msg_lower or title in msg_lower:
            return get_lab_response(lab)

    # 3. Check context-specific (current lab based on the path)
    if lab_id:
        current_lab = next((l for l in KNOWLEDGE["labs"] if l["lab_id"] == lab_id), None)
        if current_lab:
            return get_lab_response(current_lab)

    # 4. General fallback
    return KNOWLEDGE.get("fallback_response", "I am the predefined knowledge bot. I can help with platform queries ('flags', 'sessions', 'tools', 'vpn') or explain vulnerabilities like 'SSRF', 'SQL Injection', 'XSS', 'File Upload', etc. Ask for a 'hint', 'defense', or 'impact'!")

@router.post("/chatbot")
async def chatbot_endpoint(chat_request: ChatMessage):
    lab_id = _extract_lab_id(chat_request.path)
    reply = _handle_chat_query(chat_request.message, lab_id)
    return {"reply": reply}
