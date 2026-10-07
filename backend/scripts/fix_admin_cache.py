import re

with open('backend/app/api/admin.py', 'r', encoding='utf-8') as f:
    content = f.read()

overview_cache_code = '''import time
_overview_cache = {"time": 0, "data": None}

def build_overview(students: list[dict], sessions: list[dict], progress_docs: list[dict], roles: list[dict]) -> dict:
    global _overview_cache
    now_time = time.time()
    if _overview_cache["data"] and now_time - _overview_cache["time"] < 30:
        return _overview_cache["data"]
        
    labs = get_lab_catalog()'''

content = re.sub(
    r'def build_overview.*?labs = get_lab_catalog\(\)',
    overview_cache_code,
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'    return \{\n        "total_students": len\(students\),.*?"role_count": len\(roles\),\n    \}',
    '''    result = {
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
    _overview_cache["data"] = result
    _overview_cache["time"] = now_time
    return result''',
    content,
    flags=re.DOTALL
)

with open('backend/app/api/admin.py', 'w', encoding='utf-8') as f:
    f.write(content)
