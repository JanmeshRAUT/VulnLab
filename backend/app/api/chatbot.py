import json
import os
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.core.config import settings
from app.services.chatbot_engine import ChatbotEngine

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

engine = ChatbotEngine(KNOWLEDGE)

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

@router.post("/chatbot")
async def chatbot_endpoint(chat_request: ChatMessage):
    lab_id = _extract_lab_id(chat_request.path)
    reply = engine.process(chat_request.message, lab_id)
    return {"reply": reply}

