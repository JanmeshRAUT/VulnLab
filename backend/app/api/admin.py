from __future__ import annotations

import csv
import io
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query, Request, Response
from pydantic import BaseModel, Field

from app.core.database import get_database
from app.services.catalog_service import get_all_labs
from app.services.instance_service import update_instance_status

router = APIRouter(prefix="/admin", tags=["admin"])

ADMIN_ROLES = {"superadmin", "super_admin", "admin", "instructor"}
PERMISSION_CATEGORIES = [
    "Manage Users",
    "Manage Labs",
    "Manage Variants",
    "Manage Sessions",
    "View Reports",
    "Manage Students",
    "Create Labs",
    "Edit Labs",
    "Delete Labs",
    "Manage Roles",
    "Manage Access Control",
    "View Sessions",
    "Export Reports",
    "Platform Settings",
]

PERMISSION_ALIASES = {
    "Manage Students": "Manage Users",
    "View Sessions": "Manage Sessions",
}

DEFAULT_ROLE_DEFINITIONS = {
    "superadmin": PERMISSION_CATEGORIES,
    "admin": [
        "Manage Users",
        "Manage Students",
        "Manage Labs",
        "Manage Variants",
        "Manage Sessions",
        "Create Labs",
        "Edit Labs",
        "View Reports",
        "Manage Access Control",
        "View Sessions",
        "Export Reports",
    ],
    "instructor": [
        "Manage Users",
        "Manage Students",
        "Manage Labs",
        "Manage Variants",
        "Manage Sessions",
        "Create Labs",
        "Edit Labs",
        "View Reports",
        "View Sessions",
    ],
    "student": [],
}


class AccessMutationRequest(BaseModel):
    student_id: str
    lab_ids: list[str] = Field(default_factory=list)
    category: Optional[str] = None
    permission: str = "Allowed"


class VariantAccessMutationRequest(BaseModel):
    student_id: str
    lab_id: str
    variant_ids: list[str] = Field(default_factory=list)
    permission: str = "Allowed"


class RoleMutationRequest(BaseModel):
    name: str
    description: str = ""
    permissions: list[str] = Field(default_factory=list)
    is_default: bool = False


class AssignRoleRequest(BaseModel):
    student_id: str
    role: str


class SessionActionRequest(BaseModel):
    reason: str = ""


def now_ts() -> float:
    return time.time()


def _to_float_ts(value: Any, fallback: Optional[float] = None) -> float:
    if value is None:
        return fallback if fallback is not None else now_ts()
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, datetime):
        dt = value if value.tzinfo else value.replace(tzinfo=timezone.utc)
        return dt.timestamp()
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            try:
                return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
            except ValueError:
                return fallback if fallback is not None else now_ts()
    return fallback if fallback is not None else now_ts()


def ts_to_iso(timestamp: Any) -> str:
    return datetime.fromtimestamp(_to_float_ts(timestamp), tz=timezone.utc).isoformat().replace("+00:00", "Z")


def normalize_role(role: Optional[str]) -> str:
    normalized = (role or "student").strip().lower().replace(" ", "_")
    return "student" if normalized == "user" else normalized


def normalize_lab_id(lab_id: Any) -> str:
    value = str(lab_id or "")
    if not value:
        return ""
    return value if value.startswith("lab-") else f"lab-{value}"


def get_session_identity(request: Request) -> dict[str, str]:
    return {
        "email": str(request.session.get("email", "guest@vulnlab.local")),
        "role": normalize_role(str(request.session.get("role", "student"))),
        "user_id": str(request.session.get("user_id") or request.session.get("email", "guest@vulnlab.local")),
    }


def require_admin(request: Request) -> dict[str, str]:
    identity = get_session_identity(request)
    if not request.session.get("user_id"):
        raise HTTPException(status_code=401, detail="Authentication required")
    if identity["role"] not in ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return identity


async def safe_find(collection_name: str, query: Optional[dict[str, Any]] = None, sort: Optional[list[tuple[str, int]]] = None) -> list[dict[str, Any]]:
    db = get_database()
    try:
        cursor = db[collection_name].find(query or {})
        if sort:
            cursor = cursor.sort(sort)
        docs = await cursor.to_list(length=5000)
        for doc in docs:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        return docs
    except Exception:
        return []


async def safe_upsert(collection_name: str, filter_query: dict[str, Any], update_fields: dict[str, Any]) -> None:
    db = get_database()
    try:
        await db[collection_name].update_one(filter_query, {"$set": update_fields}, upsert=True)
    except Exception:
        return


async def safe_insert(collection_name: str, document: dict[str, Any]) -> None:
    db = get_database()
    try:
        await db[collection_name].insert_one(document)
    except Exception:
        return


async def role_permissions(role: str) -> list[str]:
    db = get_database()
    normalized = normalize_role(role)
    try:
        doc = await db.roles.find_one({"name": normalized})
        if doc and doc.get("permissions"):
            return list(doc.get("permissions", []))
    except Exception:
        pass
    return list(DEFAULT_ROLE_DEFINITIONS.get(normalized, []))


async def has_permission(role: str, permission: str) -> bool:
    normalized = normalize_role(role)
    allowed = await role_permissions(normalized)
    canonical_permission = PERMISSION_ALIASES.get(permission, permission)
    return normalized == "super_admin" or permission in allowed or canonical_permission in allowed


async def require_permission(request: Request, permission: str) -> dict[str, str]:
    identity = require_admin(request)
    if not await has_permission(identity["role"], permission):
        raise HTTPException(status_code=403, detail=f"Missing permission: {permission}")
    return identity


def get_lab_catalog() -> list[dict[str, Any]]:
    labs = []
    for lab in get_all_labs():
        variants = lab.variants or []
        labs.append(
            {
                "lab_id": normalize_lab_id(lab.lab_id),
                "title": lab.title,
                "category": "Security",
                "variant_count": len(variants),
                "difficulty": "Intermediate",
                "variants": [{"variant_id": str(v.variant_id), "title": str(v.title), "submodule": v.submodule} for v in variants],
            }
        )
    return labs


async def aggregate_instances() -> list[dict[str, Any]]:
    lab_map = {lab["lab_id"]: lab for lab in get_lab_catalog()}
    docs = await safe_find("instances", sort=[("last_seen", -1)])

    rows = []
    for doc in docs:
        lab_id = normalize_lab_id(doc.get("lab_id"))
        lab = lab_map.get(lab_id, {"title": lab_id or "Unknown Lab"})
        started = _to_float_ts(doc.get("started_at"), _to_float_ts(doc.get("created_at"), now_ts()))
        last_seen = _to_float_ts(doc.get("last_seen"), started)
        solved_at = doc.get("solved_at")
        expires_at = _to_float_ts(doc.get("expires_at"), last_seen)

        rows.append(
            {
                "instance_id": str(doc.get("instance_id", "unknown")),
                "student": str(doc.get("user_id", "guest")),
                "lab": str(lab.get("title", "Unknown Lab")),
                "variant": str(doc.get("variant_id", "default")),
                "status": str(doc.get("status", "CREATED")).upper(),
                "started_time": ts_to_iso(started),
                "last_activity": ts_to_iso(last_seen),
                "solved_time": ts_to_iso(solved_at) if solved_at else None,
                "expiration_time": ts_to_iso(expires_at),
            }
        )
    return rows


async def aggregate_students(instances: list[dict[str, Any]]) -> list[dict[str, Any]]:
    users = await safe_find("users", sort=[("email", 1)])
    if not users:
        return []

    progress_docs = await safe_find("progress", sort=[("updated_at", -1)])
    progress_by_key: dict[str, list[dict[str, Any]]] = defaultdict(list)

    for doc in progress_docs:
        email = str(doc.get("email", "")).lower()
        user_id = str(doc.get("user_id", "")).lower()
        if email:
            progress_by_key[email].append(doc)
        if user_id:
            progress_by_key[user_id].append(doc)

    catalog_size = max(1, len(get_lab_catalog()))
    rows = []
    for index, user in enumerate(users):
        email = str(user.get("email") or "").lower()
        username = str(user.get("username") or (email.split("@")[0] if email else f"user{index + 1}"))
        user_id = str(user.get("user_id") or user.get("_id") or email or username)
        full_name = str(user.get("full_name") or username.replace(".", " ").title())

        attempted = 0
        solved = 0
        for item in progress_by_key.get(email, []) + progress_by_key.get(user_id.lower(), []):
            if item.get("schema_version") == 2:
                objectives = item.get("objectives", {})
                attempted += sum(int(obj.get("attempts", 0) or 0) for obj in objectives.values())
                solved += len([obj for obj in objectives.values() if obj.get("is_solved")])
            else:
                attempted += int(item.get("attempts", 1) or 1)
                if item.get("is_solved"):
                    solved += 1

        active_sessions = len(
            [
                row
                for row in instances
                if row["status"] in {"CREATED", "ACTIVE"}
                and str(row["student"]).lower() in {email, user_id.lower(), username.lower()}
            ]
        )

        status = str(user.get("status") or ("Active" if user.get("is_approved", True) else "Suspended"))
        normalized_status = status if status in {"Active", "Inactive", "Suspended"} else "Active"
        completion_percentage = round((solved / catalog_size) * 100, 1)

        rows.append(
            {
                "student_id": user_id,
                "full_name": full_name,
                "username": username,
                "email": email or username,
                "registration_date": ts_to_iso(user.get("created_at", now_ts())),
                "last_login": ts_to_iso(user.get("last_login_at", user.get("created_at", now_ts()))),
                "status": normalized_status,
                "assigned_role": normalize_role(str(user.get("role", "student"))),
                "total_labs_attempted": attempted,
                "total_labs_solved": solved,
                "total_labs_unsolved": max(attempted - solved, 0),
                "success_rate": round((solved / attempted) * 100, 1) if attempted else 0.0,
                "current_active_sessions": active_sessions,
                "earned_points": solved * 150 + active_sessions * 10,
                "completion_percentage": completion_percentage,
                "performance_score": round((completion_percentage * 0.6) + ((solved / attempted) * 40 if attempted else 0), 1),
            }
        )

    return sorted(rows, key=lambda item: (-item["performance_score"], item["full_name"]))


async def aggregate_roles() -> list[dict[str, Any]]:
    docs = await safe_find("roles", sort=[("name", 1)])
    return [
        {
            "name": normalize_role(str(doc.get("name", "student"))),
            "description": str(doc.get("description", "")),
            "permissions": list(doc.get("permissions", [])),
            "is_default": bool(doc.get("is_default", False)),
            "updated_at": ts_to_iso(doc.get("updated_at", now_ts())),
        }
        for doc in docs
    ]


async def aggregate_access_matrix(students: list[dict[str, Any]]) -> dict[str, Any]:
    labs = get_lab_catalog()

    access_docs = await safe_find("lab_access", sort=[("updated_at", -1)])
    access_lookup: dict[tuple[str, str], str] = {}
    for doc in access_docs:
        student_id = str(doc.get("student_id") or doc.get("email") or "").lower()
        lab_id = normalize_lab_id(doc.get("lab_id"))
        if student_id and lab_id:
            access_lookup[(student_id, lab_id)] = str(doc.get("permission", "Allowed"))

    variant_docs = await safe_find("variant_access", sort=[("updated_at", -1)])
    variant_lookup: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for doc in variant_docs:
        student_id = str(doc.get("student_id") or doc.get("email") or "").lower()
        lab_id = normalize_lab_id(doc.get("lab_id"))
        if student_id and lab_id:
            variant_lookup[(student_id, lab_id)].append(
                {
                    "variant_id": str(doc.get("variant_id", "default")),
                    "permission": str(doc.get("permission", "Allowed")),
                }
            )

    rows = []
    for student in students:
        student_key = str(student["email"]).lower()
        permissions = []
        for lab in labs:
            permissions.append(
                {
                    "lab_id": lab["lab_id"],
                    "lab_title": lab["title"],
                    "permission": access_lookup.get((student_key, lab["lab_id"]), "Locked"),
                    "variants": variant_lookup.get((student_key, lab["lab_id"]), []),
                }
            )
        rows.append({"student_id": student["student_id"], "student_name": student["full_name"], "username": student["username"], "permissions": permissions})

    return {"labs": labs, "rows": rows}


def build_overview(students: list[dict[str, Any]], sessions: list[dict[str, Any]], progress_docs: list[dict[str, Any]], roles: list[dict[str, Any]]) -> dict[str, Any]:
    labs = get_lab_catalog()
    total_variants = sum(int(lab.get("variant_count", 0) or 0) for lab in labs)

    solved_by_lab = Counter()
    for doc in progress_docs:
        lab_id = normalize_lab_id(doc.get("lab_id"))
        if not lab_id:
            continue
        if doc.get("schema_version") == 2:
            objectives = doc.get("objectives", {})
            solved_by_lab[lab_id] += len([obj for obj in objectives.values() if obj.get("is_solved")])
        elif doc.get("is_solved"):
            solved_by_lab[lab_id] += 1

    active_sessions = len([item for item in sessions if item["status"] in {"CREATED", "ACTIVE"}])
    solved_sessions = len([item for item in sessions if item["status"] == "SOLVED"])
    abandoned_sessions = len([item for item in sessions if item["status"] == "ABANDONED"])
    expired_sessions = len([item for item in sessions if item["status"] == "EXPIRED"])

    recent_activity = []
    
    # Who logged in
    for student in students:
        if student.get("last_login"):
            recent_activity.append({
                "type": "Login",
                "title": student["full_name"],
                "detail": f"{student['full_name']} logged in",
                "timestamp": student["last_login"],
            })

    # What Student Solve
    for session in sessions:
        if session["status"] == "SOLVED" and session.get("solved_time"):
            recent_activity.append({
                "type": "Lab Solved",
                "title": session["lab"],
                "detail": f"{session['student']} solved {session['lab']}",
                "timestamp": session["solved_time"],
            })

    recent_activity = sorted(recent_activity, key=lambda item: item["timestamp"], reverse=True)[:15]

    import time
    now = time.time()
    
    # Calculate real statistics based on sessions
    def count_active_in_range(days):
        cutoff = now - (days * 86400)
        from datetime import datetime
        cutoff_iso = datetime.utcfromtimestamp(cutoff).isoformat()
        return len([s for s in sessions if s["status"] in {"CREATED", "ACTIVE"} and s.get("started_time") and s["started_time"] >= cutoff_iso])
        
    def count_solved_in_range(days):
        cutoff = now - (days * 86400)
        from datetime import datetime
        cutoff_iso = datetime.utcfromtimestamp(cutoff).isoformat()
        return len([s for s in sessions if s["status"] == "SOLVED" and s.get("solved_time") and s["solved_time"] >= cutoff_iso])

    daily_statistics = [{"label": f"Day {i + 1}", "value": count_active_in_range(i + 1), "solved": count_solved_in_range(i + 1)} for i in range(7)]
    weekly_statistics = [{"label": f"Week {i + 1}", "value": count_active_in_range((i + 1) * 7), "solved": count_solved_in_range((i + 1) * 7)} for i in range(4)]
    monthly_statistics = [{"label": label, "value": count_active_in_range((i + 1) * 30), "solved": count_solved_in_range((i + 1) * 30)} for i, label in enumerate(["This Month", "Last Month", "2 Months Ago"])]

    return {
        "total_students": len(students),
        "total_labs": len(labs),
        "total_variants": total_variants,
        "active_sessions": active_sessions,
        "solved_sessions": solved_sessions,
        "abandoned_sessions": abandoned_sessions,
        "expired_sessions": expired_sessions,
        "top_performing_students": sorted(students, key=lambda item: (item["performance_score"], item["completion_percentage"]), reverse=True)[:5],
        "most_solved_labs": sorted(
            [{"lab_id": lab["lab_id"], "title": lab["title"], "category": lab.get("category", "Security"), "solved_count": solved_by_lab.get(lab["lab_id"], 0)} for lab in labs],
            key=lambda item: item["solved_count"],
            reverse=True,
        )[:5],
        "recent_activity": recent_activity,
        "daily_statistics": daily_statistics,
        "weekly_statistics": weekly_statistics,
        "monthly_statistics": monthly_statistics,
        "role_count": len(roles),
    }


def build_reports(students: list[dict[str, Any]], sessions: list[dict[str, Any]]) -> dict[str, Any]:
    labs = get_lab_catalog()

    student_reports = [
        {
            "student_id": s["student_id"],
            "name": s["full_name"],
            "solved_labs": s["total_labs_solved"],
            "unsolved_labs": s["total_labs_unsolved"],
            "success_rate": s["success_rate"],
            "learning_progress": s["completion_percentage"],
        }
        for s in students
    ]

    lab_reports = []
    for lab in labs:
        related = [item for item in sessions if item["lab"] == lab["title"]]
        solved_count = len([item for item in related if item["status"] == "SOLVED"])
        total_count = len(related)
        completion_rate = round((solved_count / total_count) * 100, 1) if total_count else 0.0
        lab_reports.append(
            {
                "lab_id": lab["lab_id"],
                "title": lab["title"],
                "completion_rate": completion_rate,
                "average_solve_time": 0.0,
                "most_difficult": max(0, 100 - completion_rate),
                "most_failed": max(0, total_count - solved_count),
                "solve_count": solved_count,
                "attempt_count": total_count,
            }
        )

    most_solved_labs = sorted(
        [{"lab_id": item["lab_id"], "title": item["title"], "solved_count": item["solve_count"]} for item in lab_reports],
        key=lambda item: item["solved_count"],
        reverse=True,
    )[:5]
    hardest_labs = sorted(
        [{"lab_id": item["lab_id"], "title": item["title"], "difficulty_score": item["most_difficult"], "completion_rate": item["completion_rate"]} for item in lab_reports],
        key=lambda item: item["difficulty_score"],
        reverse=True,
    )[:5]

    return {
        "student_reports": student_reports,
        "lab_reports": lab_reports,
        "most_solved_labs": most_solved_labs,
        "hardest_labs": hardest_labs,
        "average_solve_time": 0.0,
        "system_reports": {
            "active_users": len([student for student in students if student["status"] == "Active"]),
            "platform_usage_statistics": {
                "total_sessions": len(sessions),
                "unique_students": len(students),
                "unique_labs": len(labs),
                "avg_sessions_per_student": round(len(sessions) / len(students), 2) if students else 0,
            },
        },
        "export_options": ["CSV", "Excel", "PDF"],
    }


@router.get("/dashboard")
async def get_dashboard(
    request: Request,
    q: str = Query(default=""),
    status: str = Query(default=""),
    role: str = Query(default=""),
    category: str = Query(default=""),
    range: str = Query(default="weekly"),
):
    require_admin(request)

    sessions = await aggregate_instances()
    students = await aggregate_students(sessions)
    roles = await aggregate_roles()
    progress_docs = await safe_find("progress", sort=[("updated_at", -1)])

    if status:
        status_lower = status.lower()
        students = [student for student in students if student["status"].lower() == status_lower]
        sessions = [session for session in sessions if session["status"].lower() == status_lower]
    if role:
        role_lower = normalize_role(role)
        students = [student for student in students if student["assigned_role"] == role_lower]
        roles = [item for item in roles if item["name"] == role_lower]
    if q:
        q_lower = q.strip().lower()
        students = [s for s in students if q_lower in s["full_name"].lower() or q_lower in s["username"].lower() or q_lower in s["email"].lower()]
        sessions = [s for s in sessions if q_lower in s["instance_id"].lower() or q_lower in s["student"].lower() or q_lower in s["lab"].lower() or q_lower in s["status"].lower()]

    labs = get_lab_catalog()
    if category:
        category_lower = category.lower()
        labs = [lab for lab in labs if category_lower in str(lab.get("category", "")).lower()]

    overview = build_overview(students, sessions, progress_docs, roles)

    return {
        "overview": overview,
        "students": students,
        "labs": labs,
        "access_matrix": await aggregate_access_matrix(students),
        "roles": roles,
        "sessions": sessions,
        "reports": build_reports(students, sessions),
        "audit_logs": await safe_find("audit_logs", sort=[("timestamp", -1)]),
        "notifications": await safe_find("notifications", sort=[("timestamp", -1)]),
        "statistics": {"daily": overview["daily_statistics"], "weekly": overview["weekly_statistics"], "monthly": overview["monthly_statistics"]}.get(range.lower(), overview["weekly_statistics"]),
        "permission_categories": PERMISSION_CATEGORIES,
    }


@router.get("/students/{student_key}")
async def get_student_profile(request: Request, student_key: str):
    await require_permission(request, "Manage Students")

    sessions = await aggregate_instances()
    students = await aggregate_students(sessions)
    target = next((s for s in students if s["student_id"] == student_key or s["email"] == student_key or s["username"] == student_key), None)
    if not target:
        raise HTTPException(status_code=404, detail="Student not found")

    user_sessions = [s for s in sessions if target["email"] in str(s["student"]).lower() or target["student_id"] == s["student"] or target["username"] == s["student"]]
    progress_docs = [doc for doc in await safe_find("progress", sort=[("updated_at", -1)]) if str(doc.get("email", "")).lower() == target["email"]]

    labs = {lab["lab_id"]: lab for lab in get_lab_catalog()}
    lab_history = []
    progress_reports = []
    solved_labs = []
    unsolved_labs = []

    for doc in progress_docs:
        lab_id = normalize_lab_id(doc.get("lab_id"))
        lab = labs.get(lab_id, {"title": lab_id or "Unknown Lab"})

        if doc.get("schema_version") == 2:
            objectives = doc.get("objectives", {})
            solved_count = len([obj for obj in objectives.values() if obj.get("is_solved")])
            objective_count = max(int(doc.get("total_objectives", 0) or 0), len(objectives))
            item = {
                "lab_id": lab_id,
                "lab_title": lab["title"],
                "variant_id": str(doc.get("variant_id", "default")),
                "is_solved": solved_count > 0,
                "solved_objectives": solved_count,
                "objective_count": objective_count,
                "completion_percentage": float(doc.get("completion_percentage", 0.0) or 0.0),
                "attempts": int(doc.get("attempts", 0) or 0),
                "last_activity": ts_to_iso(doc.get("last_activity", doc.get("updated_at", now_ts()))),
                "updated_at": ts_to_iso(doc.get("updated_at", now_ts())),
            }
        else:
            solved_flag = bool(doc.get("is_solved"))
            item = {
                "lab_id": lab_id,
                "lab_title": lab["title"],
                "variant_id": "default",
                "is_solved": solved_flag,
                "solved_objectives": 1 if solved_flag else 0,
                "objective_count": 1,
                "completion_percentage": 100.0 if solved_flag else 0.0,
                "attempts": int(doc.get("attempts", 1) or 1),
                "last_activity": ts_to_iso(doc.get("updated_at", now_ts())),
                "updated_at": ts_to_iso(doc.get("updated_at", now_ts())),
            }

        lab_history.append(item)
        progress_reports.append(item)
        (solved_labs if item["is_solved"] else unsolved_labs).append(item)

    abandoned_labs = [session for session in user_sessions if session["status"] in {"ABANDONED", "EXPIRED"}]
    activity_timeline = [
        {"label": "Profile Loaded", "detail": target["full_name"], "timestamp": target["last_login"]},
        *[{"label": "Lab Activity", "detail": item["lab_title"], "timestamp": item["updated_at"]} for item in lab_history[:6]],
    ]

    return {
        "student": target,
        "profile": {
            "personal_information": {
                "student_id": target["student_id"],
                "full_name": target["full_name"],
                "username": target["username"],
                "email": target["email"],
                "registration_date": target["registration_date"],
                "last_login": target["last_login"],
                "status": target["status"],
                "role": target["assigned_role"],
            },
            "activity_timeline": activity_timeline,
            "lab_history": lab_history,
            "progress_reports": progress_reports,
            "session_history": user_sessions,
            "solved_labs": solved_labs,
            "unsolved_labs": unsolved_labs,
            "abandoned_labs": abandoned_labs,
            "earned_points": target["earned_points"],
            "completion_percentage": target["completion_percentage"],
            "performance_analytics": {
                "completion_percentage": target["completion_percentage"],
                "success_rate": target["success_rate"],
                "earned_points": target["earned_points"],
                "attempted_labs": target["total_labs_attempted"],
                "stability_score": round(100 - min(100, target["completion_percentage"] / 2), 1),
            },
        },
    }


@router.post("/access/grant")
async def grant_access(request: Request, data: AccessMutationRequest):
    identity = await require_permission(request, "Manage Access Control")
    timestamp = now_ts()
    permission = data.permission.title()

    for lab_id in data.lab_ids:
        normalized_lab = normalize_lab_id(lab_id)
        await safe_upsert(
            "lab_access",
            {"student_id": data.student_id.lower(), "lab_id": normalized_lab},
            {
                "student_id": data.student_id.lower(),
                "lab_id": normalized_lab,
                "category": data.category,
                "permission": permission,
                "updated_at": timestamp,
            },
        )

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Permission Changed",
            "module": "Access Control",
            "timestamp": timestamp,
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )
    return {"success": True, "permission": permission}


@router.post("/access/revoke")
async def revoke_access(request: Request, data: AccessMutationRequest):
    data.permission = "Locked"
    return await grant_access(request, data)


@router.post("/access/variants/assign")
async def assign_variants(request: Request, data: VariantAccessMutationRequest):
    identity = await require_permission(request, "Manage Variants")
    timestamp = now_ts()
    permission = data.permission.title()
    normalized_lab = normalize_lab_id(data.lab_id)

    for variant_id in data.variant_ids:
        await safe_upsert(
            "variant_access",
            {
                "student_id": data.student_id.lower(),
                "lab_id": normalized_lab,
                "variant_id": str(variant_id),
            },
            {
                "student_id": data.student_id.lower(),
                "lab_id": normalized_lab,
                "variant_id": str(variant_id),
                "permission": permission,
                "updated_at": timestamp,
            },
        )

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Variants Assigned",
            "module": "Access Control",
            "timestamp": timestamp,
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )
    return {"success": True, "permission": permission, "count": len(data.variant_ids)}


@router.post("/access/variants/restrict")
async def restrict_variants(request: Request, data: VariantAccessMutationRequest):
    data.permission = "Restricted"
    return await assign_variants(request, data)


@router.post("/roles")
async def create_or_update_role(request: Request, data: RoleMutationRequest):
    identity = await require_permission(request, "Manage Roles")
    timestamp = now_ts()
    role_name = normalize_role(data.name)

    await safe_upsert(
        "roles",
        {"name": role_name},
        {
            "name": role_name,
            "description": data.description,
            "permissions": data.permissions,
            "is_default": data.is_default,
            "updated_at": timestamp,
        },
    )

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Role Updated",
            "module": "Roles",
            "timestamp": timestamp,
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )
    return {"message": "Role created/updated"}


@router.post("/roles/assign")
async def assign_role(request: Request, data: AssignRoleRequest):
    identity = await require_permission(request, "Manage Roles")
    timestamp = now_ts()
    role_name = normalize_role(data.role)
    db = get_database()
    
    result = await db["users"].update_one(
        {"$or": [{"user_id": data.student_id}, {"email": data.student_id}, {"username": data.student_id}]},
        {"$set": {"role": role_name}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "action": "ASSIGN_ROLE",
            "target": data.student_id,
            "details": f"Assigned role {role_name}",
            "timestamp": timestamp,
        }
    )
    return {"message": f"Role {role_name} assigned to {data.student_id}"}


@router.post("/sessions/{instance_id}/action")
async def force_expire_session(request: Request, instance_id: str, data: SessionActionRequest):
    identity = await require_permission(request, "Manage Sessions")
    await update_instance_status(instance_id, "EXPIRED")

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Session Terminated",
            "module": "Sessions",
            "timestamp": now_ts(),
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )
    return {"success": True, "status": "EXPIRED", "reason": data.reason}


@router.post("/sessions/{instance_id}/terminate")
async def terminate_session(request: Request, instance_id: str, data: SessionActionRequest):
    identity = await require_permission(request, "Manage Sessions")
    await update_instance_status(instance_id, "ABANDONED")

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Session Terminated",
            "module": "Sessions",
            "timestamp": now_ts(),
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )
    return {"success": True, "status": "ABANDONED", "reason": data.reason}


@router.post("/sessions/{instance_id}/reset")
async def reset_session(request: Request, instance_id: str, data: SessionActionRequest):
    identity = await require_permission(request, "Manage Sessions")
    db = get_database()

    await db.instances.update_one(
        {"instance_id": instance_id},
        {"$set": {"status": "CREATED", "state": {}, "last_seen": now_ts()}},
    )

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Session Reset",
            "module": "Sessions",
            "timestamp": now_ts(),
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )
    return {"success": True, "status": "CREATED", "reason": data.reason}


@router.get("/reports/export")
async def export_reports(request: Request, format: str = Query(default="csv"), scope: str = Query(default="system")):
    await require_permission(request, "Export Reports")

    sessions = await aggregate_instances()
    students = await aggregate_students(sessions)
    reports = build_reports(students, sessions)

    format_lower = format.lower()
    if format_lower == "csv":
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["scope", "label", "value"])
        for key, items in reports.items():
            if isinstance(items, list):
                for item in items:
                    writer.writerow(
                        [
                            key,
                            item.get("title") or item.get("name") or item.get("lab_id") or "item",
                            item.get("success_rate") or item.get("completion_rate") or item.get("learning_progress") or "",
                        ]
                    )
        return Response(content=buffer.getvalue(), media_type="text/csv")

    if format_lower == "excel":
        buffer = io.StringIO()
        writer = csv.writer(buffer, delimiter="\t")
        writer.writerow(["scope", "label", "value"])
        writer.writerow([scope, "Workbook", "Generated from admin report data"])
        return Response(content=buffer.getvalue(), media_type="application/vnd.ms-excel")

    return Response(content=f"PDF export queued for {scope} reports", media_type="application/pdf")

@router.delete("/students/{student_id}")
async def delete_student(request: Request, student_id: str):
    identity = await require_permission(request, "Manage Students")
    db = get_database()
    
    result = await db["users"].delete_one(
        {"$or": [{"user_id": student_id}, {"email": student_id}, {"username": student_id}]}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
        
    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Delete Student",
            "module": "Students",
            "timestamp": now_ts(),
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )
    return {"success": True, "message": "Student deleted successfully"}
