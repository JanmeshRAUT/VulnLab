import asyncio
from app.api.admin import build_reports, aggregate_students, aggregate_instances, safe_find
from app.core.database import get_database

async def main():
    try:
        instances = await safe_find("instances", sort=[("started_at", -1)])
        print(f"Got {len(instances)} instances")
        
        students = await aggregate_students(instances)
        print(f"Got {len(students)} students")
        
        sessions = await aggregate_instances()
        print(f"Got {len(sessions)} sessions")
        
        reports = build_reports(students, sessions)
        print(f"Got reports keys: {reports.keys()}")
        print("Success")
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
