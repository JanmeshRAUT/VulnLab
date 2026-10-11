from __future__ import annotations

import csv
import io
import re
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query, Request, Response
from pydantic import BaseModel, Field
from pymongo import UpdateOne

from app.core.database import get_database
from app.services.catalog_service import get_all_labs
from app.services.instance_service import update_instance_status

router = APIRouter(prefix="/admin", tags=["admin"])

ADMIN_ROLES = {"super_admin", "admin", "instructor"}
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
    "super_admin": PERMISSION_CATEGORIES,
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


from bson import ObjectId

async def get_session_identity(request: Request) -> dict[str, str]:
    user_id = request.session.get("user_id")
    if not user_id:
        return {
            "email": "guest@vulnlab.local",
            "role": "student",
            "user_id": "guest_user",
        }
        
    db = get_database()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = None
        
    if not user:
        return {
            "email": "guest@vulnlab.local",
            "role": "student",
            "user_id": "guest_user",
        }
        
    return {
        "email": str(user.get("email", "guest@vulnlab.local")),
        "role": normalize_role(str(user.get("role", "student"))),
        "user_id": str(user_id),
    }

async def require_admin(request: Request) -> dict[str, str]:
    identity = await get_session_identity(request)
    if identity["user_id"] == "guest_user":
        raise HTTPException(status_code=401, detail="Authentication required")
    if identity["role"] not in ADMIN_ROLES:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return identity


import logging
logger = logging.getLogger(__name__)

async def safe_find(collection_name: str, query: dict | None = None, sort: list | None = None) -> list[dict]:
    db = get_database()
    try:
        cursor = db[collection_name].find(query or {})
        if sort:
            cursor = cursor.sort(sort)
        docs = await cursor.to_list(length=None)
        for doc in docs:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        return docs
    except Exception as e:
        logger.error(f"Error in safe_find for {collection_name}: {e}")
        raise


async def safe_upsert(collection_name: str, filter_query: dict, update_fields: dict) -> None:
    db = get_database()
    try:
        await db[collection_name].update_one(filter_query, {"$set": update_fields}, upsert=True)
    except Exception as e:
        logger.error(f"Error in safe_upsert for {collection_name}: {e}")
        raise


async def safe_insert(collection_name: str, document: dict) -> None:
    db = get_database()
    try:
        await db[collection_name].insert_one(document)
    except Exception as e:
        logger.error(f"Error in safe_insert for {collection_name}: {e}")
        if collection_name == "audit_logs":
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail="Failed to write audit log")
        raise


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
    identity = await require_admin(request)
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
                "description": lab.description,
                "category": "Security",
                "variant_count": len(variants),
                "difficulty": "Intermediate",
                "variants": [{"variant_id": str(v.variant_id), "title": str(v.title), "description": v.description, "submodule": v.submodule} for v in variants],
            }
        )
    return labs


async def aggregate_instances(query: dict | None = None, skip: int = 0, limit: int | None = None) -> list[dict[str, Any]]:
    lab_map = {lab["lab_id"]: lab for lab in get_lab_catalog()}
    db = get_database()
    cursor = db.instances.find(query or {}).sort([("last_seen", -1)])
    if skip:
        cursor = cursor.skip(skip)
    if limit is not None:
        cursor = cursor.limit(limit)
    docs = await cursor.to_list(length=limit)

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


async def aggregate_students(
    instances: list[dict[str, Any]] | None = None,
    query: dict | None = None,
    skip: int = 0,
    limit: int | None = None,
) -> list[dict[str, Any]]:
    db = get_database()
    cursor = db.users.find(query or {}).sort([("email", 1)])
    if skip:
        cursor = cursor.skip(skip)
    if limit is not None:
        cursor = cursor.limit(limit)
    users = await cursor.to_list(length=limit)
    if not users:
        return []

    email_keys = [str(u.get("email") or "").lower() for u in users if u.get("email")]
    id_keys = [str(u.get("user_id") or u.get("_id") or "").lower() for u in users]
    match_keys = list(set(email_keys + id_keys))

    progress_query = {"$or": [{"email": {"$in": match_keys}}, {"user_id": {"$in": match_keys}}]}
    progress_docs = await db.progress.find(progress_query).sort([("updated_at", -1)]).to_list(length=None)
    progress_by_key: dict[str, list[dict[str, Any]]] = defaultdict(list)

    for doc in progress_docs:
        email = str(doc.get("email", "")).lower()
        user_id = str(doc.get("user_id", "")).lower()
        if email:
            progress_by_key[email].append(doc)
        if user_id:
            progress_by_key[user_id].append(doc)

    catalog_size = max(1, len(get_lab_catalog()))
    
    # Active instances map
    if instances is None:
        inst_docs = await db.instances.find(
            {"user_id": {"$in": match_keys}, "status": {"$in": ["CREATED", "ACTIVE"]}}
        ).to_list(length=None)
        instances_for_users = [
            {"student": str(d.get("user_id", "")), "status": str(d.get("status", "CREATED")).upper()}
            for d in inst_docs
        ]
    else:
        instances_for_users = instances

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
                for row in instances_for_users
                if row.get("status") in {"CREATED", "ACTIVE"}
                and str(row.get("student", "")).lower() in {email, user_id.lower(), username.lower()}
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


async def aggregate_roles(query: dict | None = None) -> list[dict[str, Any]]:
    docs = await safe_find("roles", query=query, sort=[("name", 1)])
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


_overview_cache: dict[str, Any] = {"time": 0.0, "data": None}


async def build_overview_async(db, students: list[dict], sessions: list[dict], roles: list[dict]) -> dict[str, Any]:
    global _overview_cache
    now_time = time.time()
    if _overview_cache["data"] and now_time - _overview_cache["time"] < 45:
        return _overview_cache["data"]

    labs = get_lab_catalog()
    total_variants = sum(int(lab.get("variant_count", 0) or 0) for lab in labs)

    total_students_count = await db.users.count_documents({})
    active_sessions_count = await db.instances.count_documents({"status": {"$in": ["CREATED", "ACTIVE"]}})
    solved_sessions_count = await db.instances.count_documents({"status": "SOLVED"})
    abandoned_sessions_count = await db.instances.count_documents({"status": "ABANDONED"})
    expired_sessions_count = await db.instances.count_documents({"status": "EXPIRED"})
    role_count = await db.roles.count_documents({})

    daily_statistics = [{"label": f"Day {i + 1}", "value": active_sessions_count, "solved": solved_sessions_count} for i in range(7)]
    weekly_statistics = [{"label": f"Week {i + 1}", "value": active_sessions_count, "solved": solved_sessions_count} for i in range(4)]
    monthly_statistics = [{"label": label, "value": active_sessions_count, "solved": solved_sessions_count} for i, label in enumerate(["This Month", "Last Month", "2 Months Ago"])]

    recent_instances = await db.instances.find({"status": "SOLVED"}).sort([("solved_at", -1)]).limit(10).to_list(length=10)
    recent_activity = []
    for inst in recent_instances:
        recent_activity.append({
            "type": "Lab Solved",
            "title": str(inst.get("lab_id", "Lab")),
            "detail": f"{inst.get('user_id', 'student')} solved {inst.get('lab_id')}",
            "timestamp": ts_to_iso(inst.get("solved_at", inst.get("last_seen", now_time))),
        })

    result = {
        "total_students": total_students_count,
        "total_labs": len(labs),
        "total_variants": total_variants,
        "active_sessions": active_sessions_count,
        "solved_sessions": solved_sessions_count,
        "abandoned_sessions": abandoned_sessions_count,
        "expired_sessions": expired_sessions_count,
        "top_performing_students": sorted(students, key=lambda item: (item.get("performance_score", 0), item.get("completion_percentage", 0)), reverse=True)[:5],
        "most_solved_labs": [],
        "recent_activity": recent_activity,
        "daily_statistics": daily_statistics,
        "weekly_statistics": weekly_statistics,
        "monthly_statistics": monthly_statistics,
        "role_count": role_count or len(roles),
    }
    _overview_cache["data"] = result
    _overview_cache["time"] = now_time
    return result


def build_overview(students: list[dict], sessions: list[dict], progress_docs: list[dict], roles: list[dict]) -> dict:
    global _overview_cache
    if _overview_cache["data"]:
        return _overview_cache["data"]
    labs = get_lab_catalog()
    return {
        "total_students": len(students),
        "total_labs": len(labs),
        "total_variants": sum(int(lab.get("variant_count", 0) or 0) for lab in labs),
        "active_sessions": len([s for s in sessions if s.get("status") in {"CREATED", "ACTIVE"}]),
        "solved_sessions": len([s for s in sessions if s.get("status") == "SOLVED"]),
        "abandoned_sessions": len([s for s in sessions if s.get("status") == "ABANDONED"]),
        "expired_sessions": len([s for s in sessions if s.get("status") == "EXPIRED"]),
        "top_performing_students": students[:5],
        "most_solved_labs": [],
        "recent_activity": [],
        "daily_statistics": [],
        "weekly_statistics": [],
        "monthly_statistics": [],
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
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=200),
):
    identity = await require_admin(request)
    caller_role = identity.get("role", "student")

    can_manage_students = await has_permission(caller_role, "Manage Students")
    can_view_reports = await has_permission(caller_role, "View Reports")
    can_manage_roles = await has_permission(caller_role, "Manage Roles")
    can_manage_sessions = await has_permission(caller_role, "Manage Sessions")

    db = get_database()
    skip = (page - 1) * limit

    # Server-side queries
    user_query: dict[str, Any] = {}
    if role:
        user_query["role"] = normalize_role(role)
    if status:
        status_norm = status.strip().title()
        if status_norm in {"Active", "Inactive", "Suspended"}:
            user_query["status"] = status_norm
        else:
            user_query["status"] = status
    if q:
        user_query["$or"] = [
            {"email": {"$regex": re.escape(q), "$options": "i"}},
            {"username": {"$regex": re.escape(q), "$options": "i"}},
            {"full_name": {"$regex": re.escape(q), "$options": "i"}},
        ]

    session_query: dict[str, Any] = {}
    if status:
        session_query["status"] = status.upper()
    if q:
        session_query["$or"] = [
            {"instance_id": {"$regex": re.escape(q), "$options": "i"}},
            {"user_id": {"$regex": re.escape(q), "$options": "i"}},
            {"lab_id": {"$regex": re.escape(q), "$options": "i"}},
            {"status": {"$regex": re.escape(q), "$options": "i"}},
        ]

    audit_query: dict[str, Any] = {}
    if q:
        audit_query["$or"] = [
            {"user": {"$regex": re.escape(q), "$options": "i"}},
            {"action": {"$regex": re.escape(q), "$options": "i"}},
            {"module": {"$regex": re.escape(q), "$options": "i"}},
        ]

    # Server counts
    total_students = await db.users.count_documents(user_query) if can_manage_students else 0
    total_sessions = await db.instances.count_documents(session_query) if can_manage_sessions else 0
    total_audit_logs = await db.audit_logs.count_documents(audit_query) if can_view_reports else 0

    students = await aggregate_students(query=user_query, skip=skip, limit=limit) if can_manage_students else []
    sessions = await aggregate_instances(query=session_query, skip=skip, limit=limit) if can_manage_sessions else []

    if can_view_reports:
        audit_cursor = db.audit_logs.find(audit_query).sort([("timestamp", -1)]).skip(skip).limit(limit)
        audit_logs = await audit_cursor.to_list(length=limit)
        for doc in audit_logs:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
    else:
        audit_logs = []

    if can_manage_roles:
        role_query = {"name": normalize_role(role)} if role else {}
        roles = await aggregate_roles(query=role_query)
    else:
        roles = []

    labs = get_lab_catalog()
    if category:
        category_lower = category.lower()
        labs = [lab for lab in labs if category_lower in str(lab.get("category", "")).lower()]

    access_matrix = await aggregate_access_matrix(students) if can_manage_students else {"labs": [], "rows": []}
    reports = build_reports(students, sessions) if can_view_reports else {
        "student_reports": [],
        "lab_reports": [],
        "most_solved_labs": [],
        "hardest_labs": [],
        "average_solve_time": 0.0,
        "system_reports": {},
        "export_options": ["CSV", "Excel", "PDF"],
    }

    overview = await build_overview_async(db, students, sessions, roles)

    return {
        "overview": overview,
        "students": students,
        "labs": labs,
        "access_matrix": access_matrix,
        "roles": roles,
        "sessions": sessions,
        "reports": reports,
        "audit_logs": audit_logs,
        "notifications": await safe_find("notifications", sort=[("timestamp", -1)]),
        "statistics": {"daily": overview["daily_statistics"], "weekly": overview["weekly_statistics"], "monthly": overview["monthly_statistics"]}.get(range.lower(), overview["weekly_statistics"]),
        "permission_categories": PERMISSION_CATEGORIES,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_students": total_students,
            "total_sessions": total_sessions,
            "total_audit_logs": total_audit_logs,
            "total_pages_students": max(1, (total_students + limit - 1) // limit),
            "total_pages_sessions": max(1, (total_sessions + limit - 1) // limit),
            "total_pages_audit_logs": max(1, (total_audit_logs + limit - 1) // limit),
        },
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
        lab = labs.get(lab_id, {"title": lab_id or "Unknown Lab", "variants": []})
        
        variant_id = str(doc.get("variant_id", "default"))
        variant_desc = ""
        for v in lab.get("variants", []):
            if v.get("variant_id") == variant_id:
                variant_desc = v.get("description", "")
                break

        if doc.get("schema_version") == 2:
            objectives = doc.get("objectives", {})
            solved_count = len([obj for obj in objectives.values() if obj.get("is_solved")])
            objective_count = max(int(doc.get("total_objectives", 0) or 0), len(objectives))
            item = {
                "lab_id": lab_id,
                "lab_title": lab["title"],
                "variant_id": variant_id,
                "variant_desc": variant_desc,
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
                "variant_id": variant_id,
                "variant_desc": variant_desc,
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

    if role_name in ["super_admin", "admin", "instructor", "student"]:
        raise HTTPException(status_code=403, detail="Cannot edit built-in roles")

    if identity["role"] != "super_admin":
        for perm in data.permissions:
            if not await has_permission(identity["role"], perm):
                raise HTTPException(status_code=403, detail=f"Cannot assign permission you do not have: {perm}")
            if perm in ["Manage Roles", "Platform Settings"]:
                raise HTTPException(status_code=403, detail=f"Cannot assign restricted permission: {perm}")

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
    
    if role_name == "super_admin" and identity["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Only super_admin can assign the super_admin role")

    # Check if modifying own role
    if identity["user_id"] == data.student_id or identity["email"] == data.student_id:
        raise HTTPException(status_code=403, detail="Cannot change your own role")
        
    # Check if demoting last super_admin
    target_user = await db.users.find_one({"$or": [{"user_id": data.student_id}, {"email": data.student_id}, {"username": data.student_id}]})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if target_user.get("role") == "super_admin" and role_name != "super_admin":
        super_admins = await db.users.count_documents({"role": "super_admin"})
        if super_admins <= 1:
            raise HTTPException(status_code=403, detail="Cannot demote the last super_admin")

    result = await db["users"].update_one(
        {"_id": target_user["_id"]},
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
                    label = str(item.get("title") or item.get("name") or item.get("lab_id") or "item")
                    if label and label[0] in ('=', '+', '-', '@'):
                        label = "'" + label
                    val = str(item.get("success_rate") or item.get("completion_rate") or item.get("learning_progress") or "")
                    if val and val[0] in ('=', '+', '-', '@'):
                        val = "'" + val
                    writer.writerow([key, label, val])
        return Response(content=buffer.getvalue(), media_type="text/csv")
    
    raise HTTPException(status_code=400, detail="Only CSV export is supported")

@router.delete("/students/{student_id}")
async def delete_student(request: Request, student_id: str):
    identity = await require_permission(request, "Manage Students")
    db = get_database()
    
    from bson import ObjectId
    
    query = [{"user_id": student_id}, {"email": student_id}, {"username": student_id}]
    try:
        query.append({"_id": ObjectId(student_id)})
    except Exception:
        pass
        
    target_user = await db["users"].find_one({"$or": query})
    if not target_user:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if target_user.get("role") == "super_admin":
        super_admins = await db.users.count_documents({"role": "super_admin"})
        if super_admins <= 1:
            raise HTTPException(status_code=403, detail="Cannot delete the last super_admin")
            
    # Delete related docs
    uid = target_user.get("user_id", str(target_user["_id"]))
    email = target_user.get("email")
    
    await db.progress.delete_many({"$or": [{"user_id": uid}, {"email": email}]})
    await db.instances.delete_many({"user_id": uid})
    await db.lab_access.delete_many({"$or": [{"student_id": uid.lower()}, {"student_id": email.lower() if email else ""}]})
    
    result = await db["users"].delete_one({"_id": target_user["_id"]})
    
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

from fastapi import UploadFile, File

@router.post("/access/csv-import")
async def csv_import(request: Request, file: UploadFile = File(...)):
    identity = await require_permission(request, "Manage Access Control")
    content = await file.read()
    if len(content) > 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 1 MB limit")
        
    reader = csv.DictReader(io.StringIO(content.decode("utf-8")))
    db = get_database()
    operations = []
    timestamp = now_ts()
    count = 0
    for row in reader:
        email = row.get("email")
        if not email:
            continue
        email = email.strip()
        cohort = str(row.get("cohort", "default")).strip()
        if len(cohort) > 100:
            cohort = cohort[:100]

        operations.append(
            UpdateOne(
                {"email": email},
                {"$set": {"cohort": cohort}},
                upsert=True,
            )
        )
        count += 1

    if operations:
        await db.users.bulk_write(operations, ordered=False)

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "CSV Import Cohorts",
            "module": "Access Control",
            "details": f"Imported cohorts for {count} users",
            "count": count,
            "timestamp": timestamp,
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )

    return {"success": True, "count": count}


class BulkGrantRequest(BaseModel):
    cohort: Optional[str] = None
    role: Optional[str] = None
    email_domain: Optional[str] = None
    lab_ids: list[str] = Field(default_factory=list)
    permission: str = "Allowed"
    all_users: bool = False


@router.post("/access/bulk-grant")
async def bulk_grant(request: Request, data: BulkGrantRequest):
    identity = await require_permission(request, "Manage Access Control")
    if not (data.cohort or data.role or data.email_domain or data.all_users):
        raise HTTPException(
            status_code=400,
            detail="At least one filter (cohort, role, email_domain) must be specified unless all_users is true",
        )
    if not data.lab_ids:
        raise HTTPException(status_code=400, detail="At least one lab_id must be provided")

    db = get_database()
    query: dict[str, Any] = {}
    if data.cohort:
        query["cohort"] = data.cohort
    if data.role:
        query["role"] = normalize_role(data.role)
    if data.email_domain:
        escaped_domain = re.escape(data.email_domain.lstrip("@"))
        query["email"] = {"$regex": f"@{escaped_domain}$", "$options": "i"}

    users = await db.users.find(query).to_list(length=None)
    timestamp = now_ts()
    operations = []
    permission_title = data.permission.title()

    for user in users:
        student_id = str(user.get("email") or user.get("_id")).lower()
        for lab_id in data.lab_ids:
            normalized_lab = normalize_lab_id(lab_id)
            operations.append(
                UpdateOne(
                    {"student_id": student_id, "lab_id": normalized_lab},
                    {
                        "$set": {
                            "student_id": student_id,
                            "lab_id": normalized_lab,
                            "permission": permission_title,
                            "updated_at": timestamp,
                        }
                    },
                    upsert=True,
                )
            )

    if operations:
        await db.lab_access.bulk_write(operations, ordered=False)

    await safe_insert(
        "audit_logs",
        {
            "user": identity["email"],
            "role": identity["role"],
            "action": "Bulk Grant Access",
            "module": "Access Control",
            "details": f"Bulk granted {permission_title} to {len(users)} users across {len(data.lab_ids)} labs",
            "users_affected": len(users),
            "operations_count": len(operations),
            "timestamp": timestamp,
            "ip_address": request.client.host if request.client else "127.0.0.1",
        },
    )

    return {"success": True, "users_affected": len(users), "operations_count": len(operations)}

class SettingsUpdateRequest(BaseModel):
    default_lab_access: str

@router.post("/settings")
async def update_settings(request: Request, data: SettingsUpdateRequest):
    identity = await require_permission(request, "Platform Settings")
    db = get_database()
    await db.settings.update_one(
        {"_id": "platform_settings"},
        {"$set": {"default_lab_access": data.default_lab_access.title()}},
        upsert=True
    )
    return {"success": True}
