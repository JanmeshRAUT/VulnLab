from fastapi import APIRouter, Request, HTTPException, Depends, UploadFile, File
from fastapi.responses import HTMLResponse, Response, FileResponse
import os
import shutil
from pathlib import Path
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance
from app.core.config import settings

router = APIRouter()

# Base upload directory
UPLOAD_DIR = Path("data/uploads")

def get_instance_upload_dir(instance_id: str, variant: str, level: str = "1") -> Path:
    path = UPLOAD_DIR / instance_id / f"lab5_{level}_{variant}" / "avatars"
    path.mkdir(parents=True, exist_ok=True)
    return path

@router.post("/lab5/1/{variant}/upload")
async def upload_file(
    variant: str, 
    file: UploadFile = File(...), 
    instance: dict = Depends(get_valid_instance)
):
    """
    Vulnerable upload endpoint. Does not check file extension or mime type.
    """
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    instance_id = instance['instance_id']
    upload_path = get_instance_upload_dir(instance_id, variant, "1")
    
    file_location = upload_path / file.filename
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    return {"message": "File uploaded successfully", "filename": file.filename}

@router.get("/lab5/1/{variant}/files/avatars/{filename}")
async def get_uploaded_file(
    variant: str, 
    filename: str, 
    instance: dict = Depends(get_valid_instance)
):
    """
    Serves the uploaded file.
    """
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    instance_id = instance['instance_id']
    upload_path = get_instance_upload_dir(instance_id, variant, "1")
    file_location = upload_path / filename
    
    if not file_location.exists():
        raise HTTPException(status_code=404, detail="File not found")
        
    # Simulate PHP execution
    if filename.lower().endswith(".php"):
        with open(file_location, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            
        # Check if the user is trying to read Carlos's secret
        if "file_get_contents('/home/carlos/secret')" in content or 'file_get_contents("/home/carlos/secret")' in content:
            # Issue the flag for Lab 5.1
            try:
                record = await issue_flag_for_instance(instance_id, f'lab5:1{variant}')
                flag = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
                return Response(content=f"Secret contents:\n{flag}", media_type="text/plain")
            except Exception as e:
                return Response(content="FLAG{ERROR_GENERATING_FLAG}", media_type="text/plain")
        else:
            # Return raw PHP if it doesn't match the specific exploit, 
            # or just return the text as if executed poorly
            return Response(content=content, media_type="text/plain")
            
    # For regular files (like images), just serve them
    return FileResponse(path=file_location)

@router.post("/lab5/2/{variant}/upload")
async def upload_file_level2(
    variant: str, 
    file: UploadFile = File(...), 
    instance: dict = Depends(get_valid_instance)
):
    """
    Vulnerable upload endpoint for Lab 5.2 (Content-Type bypass).
    Only checks the MIME type header provided by the client.
    """
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    # Lab 5.2 logic: Only allow specific Content-Types
    allowed_content_types = ["image/jpeg", "image/png"]
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail=f"Only {', '.join(allowed_content_types)} allowed.")

    instance_id = instance['instance_id']
    upload_path = get_instance_upload_dir(instance_id, variant, "2")
    
    file_location = upload_path / file.filename
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    return {"message": "File uploaded successfully", "filename": file.filename}

@router.get("/lab5/2/{variant}/files/avatars/{filename}")
async def get_uploaded_file_level2(
    variant: str, 
    filename: str, 
    instance: dict = Depends(get_valid_instance)
):
    """
    Serves the uploaded file for Lab 5.2.
    """
    if instance.get("lab_id") != "5" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    instance_id = instance['instance_id']
    upload_path = get_instance_upload_dir(instance_id, variant, "2")
    file_location = upload_path / filename
    
    if not file_location.exists():
        raise HTTPException(status_code=404, detail="File not found")
        
    # Simulate PHP execution
    if filename.lower().endswith(".php"):
        with open(file_location, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            
        # Check if the user is trying to read Carlos's secret
        if "file_get_contents('/home/carlos/secret')" in content or 'file_get_contents("/home/carlos/secret")' in content:
            # Issue the flag for Lab 5.2
            try:
                record = await issue_flag_for_instance(instance_id, f'lab5:2{variant}')
                flag = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
                return Response(content=f"Secret contents:\n{flag}", media_type="text/plain")
            except Exception as e:
                return Response(content="FLAG{ERROR_GENERATING_FLAG}", media_type="text/plain")
        else:
            return Response(content=content, media_type="text/plain")
            
    return FileResponse(path=file_location)
