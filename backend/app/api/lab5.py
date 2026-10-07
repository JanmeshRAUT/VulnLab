import os
import re
from fastapi import APIRouter, Request, HTTPException, Depends, UploadFile, File
from fastapi.responses import HTMLResponse, Response
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance
from app.core.database import db
from app.core.limiter import limiter

router = APIRouter()

MAX_UPLOAD_SIZE = 1 * 1024 * 1024  # 1 MB
MAX_FILES_PER_INSTANCE = 5

def sanitize_filename(filename: str) -> str:
    base = os.path.basename(filename)
    # Strip control chars and limit length
    base = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', base)
    return base[:100]

async def store_upload(instance_id: str, variant: str, level: str, file: UploadFile):
    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max 1MB.")
        
    safe_filename = sanitize_filename(file.filename or "unknown")
    
    # Check max files
    count = await db.lab_uploads.count_documents({"instance_id": instance_id})
    if count >= MAX_FILES_PER_INSTANCE:
        # Delete oldest or just reject
        raise HTTPException(status_code=400, detail="Too many files uploaded for this instance.")
        
    doc = {
        "instance_id": instance_id,
        "variant": variant,
        "level": level,
        "filename": safe_filename,
        "content": content,
        "content_type": file.content_type
    }
    
    await db.lab_uploads.update_one(
        {"instance_id": instance_id, "variant": variant, "level": level, "filename": safe_filename},
        {"$set": doc},
        upsert=True
    )
    return safe_filename

async def serve_upload(instance_id: str, variant: str, level: str, filename: str):
    safe_filename = sanitize_filename(filename)
    doc = await db.lab_uploads.find_one({
        "instance_id": instance_id,
        "variant": variant,
        "level": level,
        "filename": safe_filename
    })
    
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
        
    content = doc["content"]
    
    headers = {
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox; default-src 'none'"
    }
    
    if safe_filename.lower().endswith(".php"):
        content_str = content.decode('utf-8', errors='ignore')
        if "file_get_contents('/home/carlos/secret')" in content_str or 'file_get_contents("/home/carlos/secret")' in content_str:
            try:
                record = await issue_flag_for_instance(instance_id, f'lab5:{level}{variant}')
                flag = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
                return Response(content=f"Secret contents:\n{flag}", media_type="text/plain", headers=headers)
            except Exception:
                return Response(content="FLAG{ERROR_GENERATING_FLAG}", media_type="text/plain", headers=headers)
        return Response(content=content_str, media_type="text/plain", headers=headers)
        
    # Always serve as text/plain to prevent XSS/execution
    return Response(content=content, media_type="text/plain", headers=headers)


@router.post("/lab5/1/{variant}/upload")
@limiter.limit("10/minute")
async def upload_file(
    request: Request,
    variant: str, 
    file: UploadFile = File(...), 
    instance: dict = Depends(get_valid_instance)
):
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    filename = await store_upload(instance['instance_id'], variant, "1", file)
    return {"message": "File uploaded successfully", "filename": filename}


@router.get("/lab5/1/{variant}/files/avatars/{filename}")
async def get_uploaded_file(
    variant: str, 
    filename: str, 
    instance: dict = Depends(get_valid_instance)
):
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    return await serve_upload(instance['instance_id'], variant, "1", filename)


@router.post("/lab5/2/{variant}/upload")
@limiter.limit("10/minute")
async def upload_file_level2(
    request: Request,
    variant: str, 
    file: UploadFile = File(...), 
    instance: dict = Depends(get_valid_instance)
):
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    allowed_content_types = ["image/jpeg", "image/png"]
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail=f"Only {', '.join(allowed_content_types)} allowed.")

    filename = await store_upload(instance['instance_id'], variant, "2", file)
    return {"message": "File uploaded successfully", "filename": filename}


@router.get("/lab5/2/{variant}/files/avatars/{filename}")
async def get_uploaded_file_level2(
    variant: str, 
    filename: str, 
    instance: dict = Depends(get_valid_instance)
):
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    return await serve_upload(instance['instance_id'], variant, "2", filename)
