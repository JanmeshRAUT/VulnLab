from __future__ import annotations

import csv
import io
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query, Request, Response
from pydantic import BaseModel, Field

import mongodb_client

router = APIRouter(prefix="/api/admin", tags=["admin"])

ADMIN_ROLES = {"super_admin", "admin", "instructor", "reviewer"}
PERMISSION_CATEGORIES = [
    "Manage Students",
    "Manage Labs",
    "Manage Variants",
    "Create Labs",
    "Edit Labs",
    "Delete Labs",
    "View Reports",
    "Manage Roles",
    "Manage Access Control",
    "View Sessions",
    "Export Reports",
    "Platform Settings",
]

DEFAULT_ROLE_DEFINITIONS = {
    "super_admin": PERMISSION_CATEGORIES,
    "admin": [
        "Manage Students",
        "Manage Labs",
        "Manage Variants",
        "Create Labs",
        "Edit Labs",
        "View Reports",
        "Manage Access Control",
        "View Sessions",
        "Export Reports",
    ],
    "instructor": [
        "Manage Students",
        "Manage Labs",
        "Manage Variants",
        "Create Labs",
        "Edit Labs",
        "View Reports",
        "Manage Access Control",
        "View Sessions",
        "Export Reports",
    ],
    "reviewer": ["View Reports", "View Sessions", "Export Reports"],
    "student": [],
}

DEFAULT_LABS = [
    {"lab_id": "lab-1", "title": "Path Traversal", "category": "File System", "variant_count": 3, "difficulty": "Beginner"},
    {"lab_id": "lab-2", "title": "Broken Access Control", "category": "Access Control", "variant_count": 5, "difficulty": "Intermediate"},
    {"lab_id": "lab-3", "title": "Authentication", "category": "Identity", "variant_count": 2, "difficulty": "Intermediate"},
    {"lab_id": "lab-4", "title": "SSRF", "category": "Network", "variant_count": 2, "difficulty": "Advanced"},
    {"lab_id": "lab-5", "title": "File Upload", "category": "Input Validation", "variant_count": 2, "difficulty": "Intermediate"},
    {"lab_id": "lab-6", "title": "Command Injection", "category": "Injection", "variant_count": 1, "difficulty": "Advanced"},
    {"lab_id": "lab-7", "title": "SQL Injection", "category": "Database", "variant_count": 2, "difficulty": "Intermediate"},
    {"lab_id": "lab-8", "title": "Cross-Site Scripting", "category": "Client-Side", "variant_count": 2, "difficulty": "Beginner"},
]

DEFAULT_STUDENTS = [
    {"student_id": "student-1001", "full_name": "Ava Carter", "username": "ava.carter", "email": "ava.carter@example.com", "status": "Active", "registration_offset_days": 44, "last_login_offset_hours": 3, "attempted": 12, "solved": 8, "active_sessions": 2},
    {"student_id": "student-1002", "full_name": "Noah Bennett", "username": "noah.bennett", "email": "noah.bennett@example.com", "status": "Active", "registration_offset_days": 38, "last_login_offset_hours": 8, "attempted": 9, "solved": 6, "active_sessions": 1},
    {"student_id": "student-1003", "full_name": "Mia Shah", "username": "mia.shah", "email": "mia.shah@example.com", "status": "Suspended", "registration_offset_days": 52, "last_login_offset_hours": 126, "attempted": 7, "solved": 2, "active_sessions": 0},
    {"student_id": "student-1004", "full_name": "Liam Ortiz", "username": "liam.ortiz", "email": "liam.ortiz@example.com", "status": "Inactive", "registration_offset_days": 61, "last_login_offset_hours": 240, "attempted": 5, "solved": 1, "active_sessions": 0},
]

DEFAULT_AUDIT = [
    {"user": "admin@vulnlab.local", "role": "super_admin", "action": "Student Created", "module": "Students", "ip": "127.0.0.1", "timestamp_offset_minutes": 9},
    {"user": "admin@vulnlab.local", "role": "super_admin", "action": "Role Updated", "module": "Roles", "ip": "127.0.0.1", "timestamp_offset_minutes": 21},
    {"user": "instructor@vulnlab.local", "role": "instructor", "action": "Lab Assigned", "module": "Access Control", "ip": "10.0.0.8", "timestamp_offset_minutes": 43},
    {"user": "reviewer@vulnlab.local", "role": "reviewer", "action": "Session Terminated", "module": "Sessions", "ip": "10.0.0.14", "timestamp_offset_minutes": 67},
]

DEFAULT_NOTIFICATIONS = [
    {"type": "New Student Registered", "severity": "info", "message": "A new student joined the platform", "age_minutes": 6},
    {"type": "Lab Completed", "severity": "success", "message": "Lab 2.3 was solved twice in the last hour", "age_minutes": 18},
    {"type": "Suspicious Activity", "severity": "warning", "message": "Multiple failed attempts detected on Lab 7", "age_minutes": 24},
    {"type": "Session Timeout", "severity": "danger", "message": "Three sessions expired without activity", "age_minutes": 31},
]


class StudentCreateRequest(BaseModel):
    full_name: str
    username: str
    email: str
    role: str = "student"
    status: str = "Active"


class StudentUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None


class AccessMutationRequest(BaseModel):
    student_id: str
    lab_ids: list[str] = Field(default_factory=list)
    category: Optional[str] = None
    permission: str = "Allowed"


class RoleMutationRequest(BaseModel):
    name: str
    description: str = ""
    permissions: list[str] = Field(default_factory=list)
    is_default: bool = False


class SessionActionRequest(BaseModel):
    reason: str = ""


def now_ts() -> float:
    return time.time()


def ts_to_iso(timestamp: Optional[float]) -> str:
    value = float(timestamp or now_ts())
    return datetime.fromtimestamp(value, tz=timezone.utc).isoformat().replace("+00:00", "Z")


def normalize_role(role: Optional[str]) -> str:
    normalized = (role or "student").strip().lower().replace(" ", "_")
    return "student" if normalized == "user" else normalized


def safe_find(collection_name: str, query: Optional[dict[str, Any]] = None, sort: Optional[list[tuple[str, int]]] = None) -> list[dict[str, Any]]:
    try:
        collection = getattr(mongodb_client.db, collection_name)
        cursor = collection.find(query or {})
        if sort:
            cursor = cursor.sort(sort)
        return list(cursor)
    except Exception:
        return []


def safe_upsert(collection_name: str, filter_query: dict[str, Any], update_fields: dict[str, Any]) -> None:
    try:
        getattr(mongodb_client.db, collection_name).update_one(filter_query, {"$set": update_fields}, upsert=True)
    except Exception:
        return


def safe_insert(collection_name: str, document: dict[str, Any]) -> None:
    try:
        getattr(mongodb_client.db, collection_name).insert_one(document)
    except Exception:
        return


def get_session_identity(request: Request) -> dict[str, str]:
    return {
        "email": request.session.get("email", "guest@vulnlab.local"),
        "role": normalize_role(request.session.get("role", "student")),
        "user_id": request.session.get("user_id") or request.session.get("email", "guest@vulnlab.local"),
    }


def require_admin(request: Request) -> dict[str, str]:
    identity = get_session_identity(request)
    if not request.session.get("user_id"):
        raise HTTPException(status_code=401, detail="Authentication required")
    if identity["role"] not in ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return identity


def role_permissions(role: str) -> list[str]:
    normalized = normalize_role(role)
    try:
        doc = mongodb_client.db.roles.find_one({"name": normalized})
        if doc and doc.get("permissions"):
            return list(doc.get("permissions", []))
    except Exception:
        pass
    return list(DEFAULT_ROLE_DEFINITIONS.get(normalized, []))


def has_permission(role: str, permission: str) -> bool:
    normalized = normalize_role(role)
    return normalized == "super_admin" or permission in role_permissions(normalized)


def require_permission(request: Request, permission: str) -> dict[str, str]:
    identity = require_admin(request)
    if not has_permission(identity["role"], permission):
        raise HTTPException(status_code=403, detail=f"Missing permission: {permission}")
    return identity


def get_lab_catalog() -> list[dict[str, Any]]:
    return [dict(lab) for lab in DEFAULT_LABS]


def lab_lookup() -> dict[str, dict[str, Any]]:
    return {lab["lab_id"]: lab for lab in get_lab_catalog()}


def aggregate_instances() -> list[dict[str, Any]]:
    labs = lab_lookup()
    instances = safe_find("instances", sort=[("last_seen", -1)])
    if not instances:
        base = now_ts()
        default_instances = []
        for index, student in enumerate(DEFAULT_STUDENTS[:4]):
            lab = DEFAULT_LABS[index % len(DEFAULT_LABS)]
            status = ["ACTIVE", "SOLVED", "ABANDONED", "EXPIRED"][index % 4]
            default_instances.append(
                {
                    "instance_id": f"inst-{index + 1:04d}",
                    "student": student["email"],
                    "lab": lab["title"],
                    "variant": f"Variant {index + 1}",
                    "status": status,
                    "started_time": ts_to_iso(base - (index + 3) * 7200),
                    "last_activity": ts_to_iso(base - (index + 1) * 3600),
                    "solved_time": ts_to_iso(base - (index + 1) * 3500) if status == "SOLVED" else None,
                    "expiration_time": ts_to_iso(base + (index + 1) * 1800),
                }
            )
        return default_instances

    records = []
    for doc in instances:
        lab = labs.get(str(doc.get("lab_id")), {"title": str(doc.get("lab_id", "Unknown Lab"))})
        started = float(doc.get("created_at", now_ts()))
        last_seen = float(doc.get("last_seen", started))
        solved_at = doc.get("solved_at")
        expires_at = doc.get("expires_at") or last_seen + 900
        records.append(
            {
                "instance_id": str(doc.get("instance_id", "unknown")),
                "student": str(doc.get("user_id", "guest")),
                "lab": lab["title"],
                "variant": str(doc.get("variant_id", "default")),
                "status": str(doc.get("status", "CREATED")),
                "started_time": ts_to_iso(started),
                "last_activity": ts_to_iso(last_seen),
                "solved_time": ts_to_iso(float(solved_at)) if solved_at else None,
                "expiration_time": ts_to_iso(float(expires_at)),
            }
        )
    return records


def aggregate_students() -> list[dict[str, Any]]:
    raw_users = safe_find("users", sort=[("email", 1)])
    instances = aggregate_instances()
    progress_docs = safe_find("progress", sort=[("updated_at", -1)])
    progress_by_email: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for doc in progress_docs:
        email = str(doc.get("email", "")).lower()
        if email:
            progress_by_email[email].append(doc)

    if not raw_users:
        students = []
        for entry in DEFAULT_STUDENTS:
            solved = entry["solved"]
            attempted = entry["attempted"]
            students.append(
                {
                    "student_id": entry["student_id"],
                    "full_name": entry["full_name"],
                    "username": entry["username"],
                    "email": entry["email"],
                    "registration_date": ts_to_iso(now_ts() - entry["registration_offset_days"] * 86400),
                    "last_login": ts_to_iso(now_ts() - entry["last_login_offset_hours"] * 3600),
                    "status": entry["status"],
                    "assigned_role": "student",
                    "total_labs_attempted": attempted,
                    "total_labs_solved": solved,
                    "total_labs_unsolved": max(attempted - solved, 0),
                    "success_rate": round((solved / attempted) * 100, 1) if attempted else 0.0,
                    "current_active_sessions": entry["active_sessions"],
                    "earned_points": solved * 125,
                    "completion_percentage": round((solved / len(DEFAULT_LABS)) * 100, 1),
                    "performance_score": round(((solved / len(DEFAULT_LABS)) * 60) + ((solved / attempted) * 40 if attempted else 0), 1),
                }
            )
        return students

    students = []
    for index, doc in enumerate(raw_users):
        email = str(doc.get("email", f"student{index + 1}@example.com")).lower()
        username = str(doc.get("username") or email.split("@")[0])
        full_name = str(doc.get("full_name") or username.replace(".", " ").title())
        student_id = str(doc.get("user_id") or doc.get("student_id") or doc.get("_id") or email)
        user_progress = progress_by_email.get(email, [])
        attempted = len(user_progress)
        solved = len([item for item in user_progress if item.get("is_solved")])
        current_sessions = len([
            item for item in instances
            if item["status"] in {"CREATED", "ACTIVE"} and email in {str(item.get("student", "")).lower()}
        ])
        status = str(doc.get("status") or ("Active" if doc.get("is_approved", True) else "Suspended"))
        students.append(
            {
                "student_id": student_id,
                "full_name": full_name,
                "username": username,
                "email": email,
                "registration_date": ts_to_iso(float(doc.get("created_at", now_ts() - (index + 1) * 86400))),
                "last_login": ts_to_iso(float(doc.get("last_login_at", now_ts() - (index + 1) * 7200))),
                "status": status if status in {"Active", "Inactive", "Suspended"} else "Active",
                "assigned_role": normalize_role(doc.get("role") or "student"),
                "total_labs_attempted": attempted,
                "total_labs_solved": solved,
                "total_labs_unsolved": max(attempted - solved, 0),
                "success_rate": round((solved / attempted) * 100, 1) if attempted else 0.0,
                "current_active_sessions": current_sessions,
                "earned_points": solved * 150 + current_sessions * 10,
                "completion_percentage": round((solved / len(DEFAULT_LABS)) * 100, 1),
                "performance_score": round(((solved / len(DEFAULT_LABS)) * 60) + ((solved / attempted) * 40 if attempted else 0), 1),
            }
        )

    return sorted(students, key=lambda item: (-item["performance_score"], item["full_name"]))


def aggregate_roles() -> list[dict[str, Any]]:
    docs = safe_find("roles", sort=[("name", 1)])
    if not docs:
        return [
            {"name": role, "description": f"Default {role.replace('_', ' ')} role", "permissions": permissions, "is_default": True, "updated_at": ts_to_iso(now_ts())}
            for role, permissions in DEFAULT_ROLE_DEFINITIONS.items()
        ]
    return [
        {
            "name": normalize_role(doc.get("name")),
            "description": doc.get("description", ""),
            "permissions": list(doc.get("permissions", [])),
            "is_default": bool(doc.get("is_default", False)),
            "updated_at": ts_to_iso(float(doc.get("updated_at", now_ts()))),
        }
        for doc in docs
    ]


def aggregate_access_matrix(students: list[dict[str, Any]]) -> dict[str, Any]:
    labs = get_lab_catalog()
    access_docs = safe_find("lab_access", sort=[("updated_at", -1)])
    access_lookup: dict[tuple[str, str], str] = {}
    for doc in access_docs:
        student_id = str(doc.get("student_id") or doc.get("email") or "").lower()
        lab_id = str(doc.get("lab_id") or "")
        if student_id and lab_id:
            access_lookup[(student_id, lab_id)] = str(doc.get("permission", "Allowed"))

    rows = []
    for student in students:
        permissions = []
        student_key = str(student["email"]).lower()
        for lab in labs:
            permissions.append(
                {
                    "lab_id": lab["lab_id"],
                    "lab_title": lab["title"],
                    "permission": access_lookup.get((student_key, lab["lab_id"]), "Locked"),
                }
            )
        rows.append({"student_id": student["student_id"], "student_name": student["full_name"], "username": student["username"], "permissions": permissions})

    return {"labs": labs, "rows": rows}


def build_activity_feed(students: list[dict[str, Any]], sessions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    feed = []
    for student in students[:5]:
        feed.append({"type": "Student Updated", "title": student["full_name"], "detail": f"{student['total_labs_solved']} solved across {student['total_labs_attempted']} attempts", "timestamp": student["last_login"]})
    for session in sessions[:5]:
        feed.append({"type": f"Session {session['status'].title()}", "title": session["lab"], "detail": f"Instance {session['instance_id']} for {session['student']}", "timestamp": session["last_activity"]})
    return sorted(feed, key=lambda item: item["timestamp"], reverse=True)


def build_overview(students: list[dict[str, Any]], sessions: list[dict[str, Any]], progress_docs: list[dict[str, Any]], roles: list[dict[str, Any]]) -> dict[str, Any]:
    labs = get_lab_catalog()
    total_variants = sum(lab["variant_count"] for lab in labs)
    solved_by_lab = Counter(str(doc.get("lab_id", "")) for doc in progress_docs if doc.get("is_solved"))
    top_students = sorted(students, key=lambda item: (item["performance_score"], item["completion_percentage"]), reverse=True)[:5]
    most_solved_labs = sorted(
        [
            {"lab_id": lab["lab_id"], "title": lab["title"], "category": lab["category"], "solved_count": solved_by_lab.get(lab["lab_id"], 0)}
            for lab in labs
        ],
        key=lambda item: item["solved_count"],
        reverse=True,
    )[:5]
    active_sessions = len([item for item in sessions if item["status"] in {"CREATED", "ACTIVE"}])
    solved_sessions = len([item for item in sessions if item["status"] == "SOLVED"])
    abandoned_sessions = len([item for item in sessions if item["status"] == "ABANDONED"])
    expired_sessions = len([item for item in sessions if item["status"] == "EXPIRED"])
    return {
        "total_students": len(students),
        "total_labs": len(labs),
        "total_variants": total_variants,
        "active_sessions": active_sessions,
        "solved_sessions": solved_sessions,
        "abandoned_sessions": abandoned_sessions,
        "expired_sessions": expired_sessions,
        "top_performing_students": top_students,
        "most_solved_labs": most_solved_labs,
        "recent_activity": build_activity_feed(students, sessions),
        "daily_statistics": [{"label": f"Day {index + 1}", "value": max(active_sessions - index, 0), "solved": max(solved_sessions - index // 2, 0)} for index in range(7)],
        "weekly_statistics": [{"label": f"Week {index + 1}", "value": max(len(students) - index, 0), "solved": max(solved_sessions - index, 0)} for index in range(4)],
        "monthly_statistics": [{"label": label, "value": max(len(labs) - index, 0), "solved": max(len(students) - index * 2, 0)} for index, label in enumerate(["This Month", "Last Month", "2 Months Ago"])],
        "role_count": len(roles),
    }


def build_reports(students: list[dict[str, Any]], sessions: list[dict[str, Any]]) -> dict[str, Any]:
    labs = get_lab_catalog()
    student_reports = [
        {"student_id": student["student_id"], "name": student["full_name"], "solved_labs": student["total_labs_solved"], "unsolved_labs": student["total_labs_unsolved"], "success_rate": student["success_rate"], "learning_progress": student["completion_percentage"]}
        for student in students[:10]
    ]
    lab_reports = []
    for lab in labs:
        related_sessions = [item for item in sessions if item["lab"] == lab["title"]]
        solved_count = len([item for item in related_sessions if item["status"] == "SOLVED"])
        total_count = len(related_sessions)
        completion_rate = round((solved_count / total_count) * 100, 1) if total_count else 0.0
        average_solve_time = round(11.5 + lab["variant_count"] * 1.7, 1)
        lab_reports.append({"lab_id": lab["lab_id"], "title": lab["title"], "completion_rate": completion_rate, "average_solve_time": average_solve_time, "most_difficult": max(0, 100 - completion_rate), "most_failed": max(0, total_count - solved_count)})
    return {
        "student_reports": student_reports,
        "lab_reports": lab_reports,
        "system_reports": {
            "active_users": len([student for student in students if student["status"] == "Active"]),
            "session_trends": {
                "created": len([item for item in sessions if item["status"] == "CREATED"]),
                "active": len([item for item in sessions if item["status"] == "ACTIVE"]),
                "solved": len([item for item in sessions if item["status"] == "SOLVED"]),
                "abandoned": len([item for item in sessions if item["status"] == "ABANDONED"]),
                "expired": len([item for item in sessions if item["status"] == "EXPIRED"]),
            },
            "platform_usage_statistics": {
                "total_sessions": len(sessions),
                "unique_students": len(students),
                "unique_labs": len(labs),
                "avg_sessions_per_student": round(len(sessions) / len(students), 2) if students else 0,
            },
        },
        "export_options": ["CSV", "Excel", "PDF"],
    }


def build_audit_logs() -> list[dict[str, Any]]:
    docs = safe_find("audit_logs", sort=[("timestamp", -1)])
    if docs:
        return [
            {"user": doc.get("user", "system"), "role": doc.get("role", "system"), "action": doc.get("action", "Action"), "module": doc.get("module", "Platform"), "timestamp": ts_to_iso(float(doc.get("timestamp", now_ts()))), "ip_address": doc.get("ip_address", "127.0.0.1")}
            for doc in docs
        ]
    return [
        {"user": item["user"], "role": item["role"], "action": item["action"], "module": item["module"], "timestamp": ts_to_iso(now_ts() - item["timestamp_offset_minutes"] * 60), "ip_address": item["ip"]}
        for item in DEFAULT_AUDIT
    ]


def build_notifications(sessions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    notifications = []
    for item in DEFAULT_NOTIFICATIONS:
        notifications.append({"type": item["type"], "severity": item["severity"], "message": item["message"], "timestamp": ts_to_iso(now_ts() - item["age_minutes"] * 60)})
    for session in sessions[:3]:
        notifications.append({"type": "Session Update", "severity": "info", "message": f"Instance {session['instance_id']} transitioned to {session['status']}", "timestamp": session["last_activity"]})
    return sorted(notifications, key=lambda item: item["timestamp"], reverse=True)


def search_records(query: str, students: list[dict[str, Any]], roles: list[dict[str, Any]], sessions: list[dict[str, Any]]) -> dict[str, Any]:
    text = query.strip().lower()
    labs = get_lab_catalog()
    if not text:
        return {"students": students[:10], "labs": labs, "roles": roles, "sessions": sessions[:10], "variants": []}
    variants = []
    for lab in labs:
        if text in lab["title"].lower() or text in lab["category"].lower():
            variants.extend([{"lab_id": lab["lab_id"], "title": lab["title"], "variant": index} for index in range(1, lab["variant_count"] + 1)])
    return {
        "students": [student for student in students if text in student["full_name"].lower() or text in student["username"].lower() or text in student["email"].lower() or text in student["assigned_role"].lower()],
        "labs": [lab for lab in labs if text in lab["title"].lower() or text in lab["category"].lower()],
        "roles": [role for role in roles if text in role["name"].lower() or text in role["description"].lower()],
        "sessions": [session for session in sessions if text in session["instance_id"].lower() or text in session["student"].lower() or text in session["lab"].lower() or text in session["status"].lower()],
        "variants": variants,
    }


def ensure_role_seed() -> None:
    if safe_find("roles"):
        return
    timestamp = now_ts()
    for role_name, permissions in DEFAULT_ROLE_DEFINITIONS.items():
        safe_upsert(
            "roles",
            {"name": role_name},
            {"name": role_name, "description": f"Default {role_name.replace('_', ' ')} role", "permissions": permissions, "is_default": True, "updated_at": timestamp},
        )


@router.on_event("startup")
async def startup_seed_roles() -> None:
    ensure_role_seed()


@router.get("/dashboard")
async def get_dashboard(request: Request, q: str = Query(default=""), status: str = Query(default=""), role: str = Query(default=""), category: str = Query(default=""), range: str = Query(default="weekly")):
    require_admin(request)
    students = aggregate_students()
    sessions = aggregate_instances()
    roles = aggregate_roles()
    progress_docs = safe_find("progress", sort=[("updated_at", -1)])
    if status:
        status_lower = status.lower()
        students = [student for student in students if student["status"].lower() == status_lower]
        sessions = [session for session in sessions if session["status"].lower() == status_lower]
    if role:
        role_lower = normalize_role(role)
        students = [student for student in students if student["assigned_role"] == role_lower]
        roles = [item for item in roles if item["name"] == role_lower]
    search_results = search_records(q, students, roles, sessions)
    if category:
        category_lower = category.lower()
        search_results["labs"] = [lab for lab in search_results["labs"] if category_lower in lab["category"].lower()]
    overview = build_overview(students, sessions, progress_docs, roles)
    return {
        "overview": overview,
        "students": students,
        "labs": get_lab_catalog(),
        "access_matrix": aggregate_access_matrix(students),
        "roles": roles,
        "sessions": sessions,
        "reports": build_reports(students, sessions),
        "audit_logs": build_audit_logs(),
        "notifications": build_notifications(sessions),
        "search_results": search_results,
        "statistics": {"daily": overview["daily_statistics"], "weekly": overview["weekly_statistics"], "monthly": overview["monthly_statistics"]}.get(range.lower(), overview["weekly_statistics"]),
        "permission_categories": PERMISSION_CATEGORIES,
    }


@router.get("/students")
async def list_students(request: Request):
    require_permission(request, "Manage Students")
    return {"students": aggregate_students()}


@router.get("/students/{student_key}")
async def get_student_profile(request: Request, student_key: str):
    require_permission(request, "Manage Students")
    students = aggregate_students()
    target = next((student for student in students if student["student_id"] == student_key or student["email"] == student_key or student["username"] == student_key), None)
    if not target:
        raise HTTPException(status_code=404, detail="Student not found")

    labs = {lab["lab_id"]: lab for lab in get_lab_catalog()}
    sessions = [session for session in aggregate_instances() if target["email"] in str(session["student"]).lower() or target["student_id"] == session["student"] or target["username"] == session["student"]]
    progress_docs = [doc for doc in safe_find("progress", sort=[("updated_at", -1)]) if str(doc.get("email", "")).lower() == target["email"]]

    lab_history = []
    solved_labs = []
    unsolved_labs = []
    for doc in progress_docs:
        lab = labs.get(str(doc.get("lab_id", "")), {"title": str(doc.get("lab_id", "Unknown Lab"))})
        item = {"lab_id": str(doc.get("lab_id")), "lab_title": lab["title"], "is_solved": bool(doc.get("is_solved")), "updated_at": ts_to_iso(float(doc.get("updated_at", now_ts()))) }
        lab_history.append(item)
        (solved_labs if item["is_solved"] else unsolved_labs).append(item)

    abandoned_labs = [session for session in sessions if session["status"] in {"ABANDONED", "EXPIRED"}]
    activity_timeline = [
        {"label": "Profile Loaded", "detail": target["full_name"], "timestamp": target["last_login"]},
        *[{"label": "Lab Activity", "detail": item["lab_title"], "timestamp": item["updated_at"]} for item in lab_history[:6]],
    ]
    return {
        "student": target,
        "profile": {
            "personal_information": {"student_id": target["student_id"], "full_name": target["full_name"], "username": target["username"], "email": target["email"], "registration_date": target["registration_date"], "last_login": target["last_login"], "status": target["status"], "role": target["assigned_role"]},
            "activity_timeline": activity_timeline,
            "lab_history": lab_history,
            "session_history": sessions,
            "solved_labs": solved_labs,
            "unsolved_labs": unsolved_labs,
            "abandoned_labs": abandoned_labs,
            "earned_points": target["earned_points"],
            "completion_percentage": target["completion_percentage"],
            "performance_analytics": {"completion_percentage": target["completion_percentage"], "success_rate": target["success_rate"], "earned_points": target["earned_points"], "attempted_labs": target["total_labs_attempted"], "stability_score": round(100 - min(100, target["completion_percentage"] / 2), 1)},
        },
    }


@router.post("/students")
async def create_student(request: Request, data: StudentCreateRequest):
    identity = require_permission(request, "Manage Students")
    timestamp = now_ts()
    student_id = data.email.lower().replace("@", "-").replace(".", "-")
    document = {"user_id": student_id, "student_id": student_id, "full_name": data.full_name, "username": data.username, "email": data.email.lower(), "role": normalize_role(data.role), "status": data.status, "created_at": timestamp, "last_login_at": timestamp}
    safe_upsert("users", {"email": document["email"]}, document)
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Student Created", "module": "Students", "timestamp": timestamp, "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True, "student": document}


@router.patch("/students/{student_key}")
async def update_student(request: Request, student_key: str, data: StudentUpdateRequest):
    identity = require_permission(request, "Manage Students")
    timestamp = now_ts()
    update_fields = {key: value for key, value in data.model_dump().items() if value is not None}
    if "role" in update_fields:
        update_fields["role"] = normalize_role(update_fields["role"])
    if "email" in update_fields:
        update_fields["email"] = update_fields["email"].lower()
    update_fields["updated_at"] = timestamp
    try:
        result = mongodb_client.db.users.update_one({"$or": [{"email": student_key.lower()}, {"username": student_key}, {"user_id": student_key}, {"student_id": student_key}]}, {"$set": update_fields})
    except Exception:
        raise HTTPException(status_code=404, detail="Student not found")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Student Updated", "module": "Students", "timestamp": timestamp, "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True}


@router.get("/access/matrix")
async def get_access_matrix(request: Request):
    require_permission(request, "Manage Access Control")
    students = aggregate_students()
    return aggregate_access_matrix(students)


@router.post("/access/grant")
async def grant_access(request: Request, data: AccessMutationRequest):
    identity = require_permission(request, "Manage Access Control")
    timestamp = now_ts()
    permission = data.permission.title()
    for lab_id in data.lab_ids:
        safe_upsert("lab_access", {"student_id": data.student_id.lower(), "lab_id": lab_id}, {"student_id": data.student_id.lower(), "lab_id": lab_id, "category": data.category, "permission": permission, "updated_at": timestamp})
        safe_upsert("enrollments", {"email": data.student_id.lower(), "lab_id": lab_id}, {"email": data.student_id.lower(), "lab_id": lab_id, "approval_status": "approved" if permission == "Allowed" else permission.lower(), "updated_at": timestamp})
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Permission Changed", "module": "Access Control", "timestamp": timestamp, "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True, "permission": permission}


@router.post("/access/revoke")
async def revoke_access(request: Request, data: AccessMutationRequest):
    data.permission = "Locked"
    return await grant_access(request, data)


@router.post("/access/bulk-assign")
async def bulk_assign(request: Request, data: AccessMutationRequest):
    return await grant_access(request, data)


@router.post("/access/bulk-remove")
async def bulk_remove(request: Request, data: AccessMutationRequest):
    identity = require_permission(request, "Manage Access Control")
    timestamp = now_ts()
    for lab_id in data.lab_ids:
        safe_upsert("lab_access", {"student_id": data.student_id.lower(), "lab_id": lab_id}, {"student_id": data.student_id.lower(), "lab_id": lab_id, "category": data.category, "permission": "Hidden", "updated_at": timestamp})
        safe_upsert("enrollments", {"email": data.student_id.lower(), "lab_id": lab_id}, {"email": data.student_id.lower(), "lab_id": lab_id, "approval_status": "hidden", "updated_at": timestamp})
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Lab Removed", "module": "Access Control", "timestamp": timestamp, "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True}


@router.get("/roles")
async def list_roles(request: Request):
    require_permission(request, "Manage Roles")
    return {"roles": aggregate_roles(), "permission_categories": PERMISSION_CATEGORIES}


@router.post("/roles")
async def create_or_update_role(request: Request, data: RoleMutationRequest):
    identity = require_permission(request, "Manage Roles")
    timestamp = now_ts()
    role_name = normalize_role(data.name)
    safe_upsert("roles", {"name": role_name}, {"name": role_name, "description": data.description, "permissions": data.permissions, "is_default": data.is_default, "updated_at": timestamp})
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Role Updated", "module": "Roles", "timestamp": timestamp, "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True, "role": role_name}


@router.delete("/roles/{role_name}")
async def delete_role(request: Request, role_name: str):
    identity = require_permission(request, "Manage Roles")
    normalized = normalize_role(role_name)
    if normalized in DEFAULT_ROLE_DEFINITIONS:
        raise HTTPException(status_code=400, detail="Default roles cannot be deleted")
    try:
        result = mongodb_client.db.roles.delete_one({"name": normalized})
    except Exception:
        raise HTTPException(status_code=404, detail="Role not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Role not found")
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Role Deleted", "module": "Roles", "timestamp": now_ts(), "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True}


@router.get("/sessions")
async def list_sessions(request: Request, status: str = Query(default="")):
    require_permission(request, "View Sessions")
    sessions = aggregate_instances()
    if status:
        sessions = [session for session in sessions if session["status"].lower() == status.lower()]
    return {"sessions": sessions}


def update_session_status(instance_id: str, status: str) -> None:
    safe_upsert("instances", {"instance_id": instance_id}, {"instance_id": instance_id, "status": status, "last_seen": now_ts()})


@router.post("/sessions/{instance_id}/expire")
async def force_expire_session(request: Request, instance_id: str, data: SessionActionRequest):
    identity = require_permission(request, "View Sessions")
    update_session_status(instance_id, "EXPIRED")
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Session Terminated", "module": "Sessions", "timestamp": now_ts(), "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True, "status": "EXPIRED", "reason": data.reason}


@router.post("/sessions/{instance_id}/terminate")
async def terminate_session(request: Request, instance_id: str, data: SessionActionRequest):
    identity = require_permission(request, "View Sessions")
    update_session_status(instance_id, "ABANDONED")
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Session Terminated", "module": "Sessions", "timestamp": now_ts(), "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True, "status": "ABANDONED", "reason": data.reason}


@router.post("/sessions/{instance_id}/reset")
async def reset_session(request: Request, instance_id: str, data: SessionActionRequest):
    identity = require_permission(request, "View Sessions")
    try:
        mongodb_client.db.instances.update_one({"instance_id": instance_id}, {"$set": {"status": "CREATED", "state": {}, "last_seen": now_ts()}})
    except Exception:
        update_session_status(instance_id, "CREATED")
    safe_insert("audit_logs", {"user": identity["email"], "role": identity["role"], "action": "Session Reset", "module": "Sessions", "timestamp": now_ts(), "ip_address": request.client.host if request.client else "127.0.0.1"})
    return {"success": True, "status": "CREATED", "reason": data.reason}


@router.get("/reports")
async def get_reports(request: Request):
    require_permission(request, "View Reports")
    students = aggregate_students()
    sessions = aggregate_instances()
    return build_reports(students, sessions)


@router.get("/reports/export")
async def export_reports(request: Request, format: str = Query(default="csv"), scope: str = Query(default="system")):
    require_permission(request, "Export Reports")
    reports = build_reports(aggregate_students(), aggregate_instances())
    format_lower = format.lower()
    if format_lower == "csv":
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["scope", "label", "value"])
        for key, items in reports.items():
            if isinstance(items, list):
                for item in items:
                    writer.writerow([key, item.get("title") or item.get("name") or item.get("lab_id") or "item", item.get("success_rate") or item.get("completion_rate") or item.get("learning_progress") or ""])
        return Response(content=buffer.getvalue(), media_type="text/csv")
    if format_lower == "excel":
        buffer = io.StringIO()
        writer = csv.writer(buffer, delimiter="\t")
        writer.writerow(["scope", "label", "value"])
        writer.writerow([scope, "Workbook", "Generated from admin report data"])
        return Response(content=buffer.getvalue(), media_type="application/vnd.ms-excel")
    return Response(content=f"PDF export queued for {scope} reports", media_type="application/pdf")


@router.get("/audit-logs")
async def get_audit_logs(request: Request):
    require_permission(request, "View Reports")
    return {"audit_logs": build_audit_logs()}


@router.get("/notifications")
async def get_notifications(request: Request):
    require_admin(request)
    return {"notifications": build_notifications(aggregate_instances())}


@router.get("/search")
async def global_search(request: Request, q: str = Query(default="")):
    require_admin(request)
    students = aggregate_students()
    roles = aggregate_roles()
    sessions = aggregate_instances()
    return search_records(q, students, roles, sessions)