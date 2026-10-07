import re

with open('backend/app/api/admin.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix exports
export_code = '''@router.get("/reports/export")
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
    
    raise HTTPException(status_code=400, detail="Only CSV export is supported")'''

content = re.sub(
    r'@router\.get\("/reports/export"\).*?return Response\(content=f"PDF export queued for \{scope\} reports", media_type="application/pdf"\)',
    export_code,
    content,
    flags=re.DOTALL
)

# Fix role assignment
role_assign_code = '''@router.post("/roles/assign")
async def assign_role(request: Request, data: AssignRoleRequest):
    identity = await require_permission(request, "Manage Roles")
    timestamp = now_ts()
    role_name = normalize_role(data.role)
    db = get_database()
    
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
    )'''

content = re.sub(
    r'@router\.post\("/roles/assign"\).*?result = await db\["users"\]\.update_one\([^)]+\)',
    role_assign_code,
    content,
    flags=re.DOTALL
)

# Fix delete student
delete_student_code = '''@router.delete("/students/{student_id}")
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
    
    result = await db["users"].delete_one({"_id": target_user["_id"]})'''

content = re.sub(
    r'@router\.delete\("/students/\{student_id\}"\).*?result = await db\["users"\]\.delete_one\(\{"\$or": query\}\)',
    delete_student_code,
    content,
    flags=re.DOTALL
)

with open('backend/app/api/admin.py', 'w', encoding='utf-8') as f:
    f.write(content)
