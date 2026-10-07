import re
import hashlib
from urllib.parse import urlparse, parse_qs
from fastapi import APIRouter, Request, HTTPException, Response, Header, Depends
from fastapi.responses import HTMLResponse
from typing import Optional
from pydantic import BaseModel
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance

router = APIRouter()

class SSRFCheckRequest(BaseModel):
    stockApi: str

def is_loopback(url: str) -> bool:
    return "localhost" in url.lower() or "127.0.0.1" in url.lower()

async def get_admin_panel_internal(variant: str, x_internal_ssrf: str, instance: dict):
    if x_internal_ssrf != "true":
         return HTMLResponse(content="<h1>401 Unauthorized</h1><p>Admin interface is only available if requested from the local loopback interface (127.0.0.1).</p>", status_code=401)
         
    if variant == 'a':
        title = "Retail System Administration"
        desc = "User Management"
        headers = ["Username", "Role", "Action"]
        rows = [
            ("wiener", "User", "username=wiener", "Delete"),
            ("carlos", "User", "username=carlos", "Delete")
        ]
    elif variant == 'b':
        title = "SkyNet Internal Control Plane"
        desc = "Instance Management"
        headers = ["Instance ID", "Status", "Action"]
        rows = [
            ("i-wiener", "Running", "instance=i-wiener", "Terminate"),
            ("i-carlos", "Running", "instance=i-carlos", "Terminate")
        ]
    else:
        title = "FreightCorp Internal Dispatch"
        desc = "Shipment Override"
        headers = ["Shipment ID", "Status", "Action"]
        rows = [
            ("SH-wiener", "In Transit", "shipment=SH-wiener", "Cancel"),
            ("SH-carlos", "In Transit", "shipment=SH-carlos", "Cancel")
        ]
         
    rows_html = ""
    for r in rows:
        rows_html += f'<tr><td>{r[0]}</td><td>{r[1]}</td><td><a href="http://localhost/admin/delete?{r[2]}" class="delete-btn">{r[3]}</a></td></tr>'

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{title}</title>
        <style>
            body {{ font-family: sans-serif; padding: 20px; }}
            .panel {{ border: 1px solid #ccc; padding: 20px; border-radius: 5px; max-width: 600px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            .delete-btn {{ color: red; text-decoration: none; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="panel">
            <h2>{title}</h2>
            <h3>{desc}</h3>
            <table>
                <tr>
                    <th>{headers[0]}</th>
                    <th>{headers[1]}</th>
                    <th>{headers[2]}</th>
                </tr>
                {rows_html}
            </table>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

async def delete_user_internal(variant: str, target: str, x_internal_ssrf: str, instance: dict):
    if x_internal_ssrf != "true":
         return HTMLResponse(content="<h1>401 Unauthorized</h1>", status_code=401)
         
    if target in ["carlos", "i-carlos", "SH-carlos"]:
         try:
             record = await issue_flag_for_instance(instance['instance_id'], f'lab4:1{variant}')
             flag = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
         except Exception as e:
             flag = "FLAG{ERROR_GENERATING_FLAG}"
             
         if variant == 'a':
             success_msg = f"User '{target}' deleted successfully!"
         elif variant == 'b':
             success_msg = f"Instance '{target}' terminated successfully!"
         else:
             success_msg = f"Shipment '{target}' cancelled successfully!"
             
         html_content = f"""
         <!DOCTYPE html>
         <html>
         <head><title>Action Successful</title></head>
         <body>
             <h2 style="color: green;">Success: {success_msg}</h2>
             <p>Congratulations, you solved the lab!</p>
             <p><b>Your Flag: {flag}</b></p>
             <a href="http://localhost/admin">Back to Admin</a>
         </body>
         </html>
         """
         return HTMLResponse(content=html_content)
         
    return HTMLResponse(content="<h3>Action failed or invalid target.</h3><a href='http://localhost/admin'>Back</a>", status_code=200)

@router.post("/lab4/1/{variant}/check")
async def check_ssrf(variant: str, request_data: SSRFCheckRequest, request: Request, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")

    target_url = request_data.stockApi

    if target_url.startswith("http://stock.cloudstock.internal/api/check"):
         return {"stock": 425}
    if target_url.startswith("http://internal.cloud.local/status"):
         return {"status": "Healthy", "uptime": "99.9%"}
    if target_url.startswith("http://logistics.internal/api/track"):
         return {"location": "In Transit", "eta": "2 Days"}
    
    if is_loopback(target_url):
        try:
             path_and_query = target_url.split("localhost", 1)[-1] if "localhost" in target_url else target_url.split("127.0.0.1", 1)[-1]
             if path_and_query.startswith(":"):
                 path_and_query = "/" + path_and_query.split("/", 1)[-1] if "/" in path_and_query else "/"
                 
             if path_and_query == "/admin" or path_and_query == "/admin/":
                 return await get_admin_panel_internal(variant, "true", instance)
             elif path_and_query.startswith("/admin/delete"):
                 parsed = urlparse(path_and_query)
                 qs = parse_qs(parsed.query)
                 target = qs.get("username", [None])[0] or qs.get("instance", [None])[0] or qs.get("shipment", [None])[0]
                 return await delete_user_internal(variant, target, "true", instance)
             else:
                 return Response(content="404 Not Found", status_code=404)
        except Exception as e:
             return Response(content=f"Error executing internal request: {str(e)}", status_code=500)

    # Simulated generic failure for all other requests
    return Response(content="Could not connect to external service.", status_code=400)


@router.get("/lab4/1/{variant}/admin")
async def get_admin_panel(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
    return await get_admin_panel_internal(variant, x_internal_ssrf or "", instance)

@router.get("/lab4/1/{variant}/admin/delete")
async def delete_user(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
    target = request.query_params.get("username") or request.query_params.get("instance") or request.query_params.get("shipment")
    return await delete_user_internal(variant, target, x_internal_ssrf or "", instance)


# LAB 4.2

async def get_admin_panel_internal_2(variant: str, x_internal_ssrf: str, instance: dict):
    if x_internal_ssrf != "true":
         return HTMLResponse(content="<h1>401 Unauthorized</h1><p>Admin interface is only available if requested from the internal network.</p>", status_code=401)
         
    if variant == 'a':
        title = "Arcade Avenue Administration"
        desc = "User Management"
        headers = ["Username", "Role", "Action"]
        rows = [
            ("wiener", "User", "username=wiener", "Delete"),
            ("carlos", "User", "username=carlos", "Delete")
        ]
    elif variant == 'b':
        title = "Nimbus Internal Control Plane"
        desc = "Instance Management"
        headers = ["Instance ID", "Status", "Action"]
        rows = [
            ("i-wiener", "Running", "instance=i-wiener", "Terminate"),
            ("i-carlos", "Running", "instance=i-carlos", "Terminate")
        ]
    else:
        title = "Portline Freight Operations"
        desc = "Shipment Override"
        headers = ["Shipment ID", "Status", "Action"]
        rows = [
            ("SH-wiener", "In Transit", "shipment=SH-wiener", "Cancel"),
            ("SH-carlos", "In Transit", "shipment=SH-carlos", "Cancel")
        ]
         
    rows_html = ""
    for r in rows:
        rows_html += f'<tr><td>{r[0]}</td><td>{r[1]}</td><td><a href="/admin/delete?{r[2]}" class="delete-btn">{r[3]}</a></td></tr>'

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{title}</title>
        <style>
            body {{ font-family: monospace; padding: 20px; background-color: #000; color: #0f0; }}
            .panel {{ border: 1px solid #0f0; padding: 20px; max-width: 600px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #0f0; }}
            th, td {{ border: 1px solid #0f0; padding: 8px; text-align: left; }}
            th {{ background-color: #020; }}
            .delete-btn {{ color: red; text-decoration: none; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="panel">
            <h2>{title}</h2>
            <h3>{desc}</h3>
            <table>
                <tr>
                    <th>{headers[0]}</th>
                    <th>{headers[1]}</th>
                    <th>{headers[2]}</th>
                </tr>
                {rows_html}
            </table>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

async def delete_user_internal_2(variant: str, target: str, x_internal_ssrf: str, instance: dict):
    if x_internal_ssrf != "true":
         return HTMLResponse(content="<h1>401 Unauthorized</h1>", status_code=401)
         
    if target in ["carlos", "i-carlos", "SH-carlos"]:
         try:
             record = await issue_flag_for_instance(instance['instance_id'], f'lab4:2{variant}')
             flag = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
         except Exception as e:
             flag = "FLAG{ERROR_GENERATING_FLAG}"
             
         if variant == 'a':
             success_msg = f"User '{target}' deleted successfully!"
         elif variant == 'b':
             success_msg = f"Instance '{target}' terminated successfully!"
         else:
             success_msg = f"Shipment '{target}' cancelled successfully!"
             
         html_content = f"""
         <!DOCTYPE html>
         <html>
         <head><title>Action Successful</title></head>
         <body style="background:#000; color:#0f0; font-family:monospace; padding:20px;">
             <h2 style="color: lime;">Success: {success_msg}</h2>
             <p>Congratulations, you solved the lab!</p>
             <p><b>Your Flag: {flag}</b></p>
         </body>
         </html>
         """
         return HTMLResponse(content=html_content)
         
    return HTMLResponse(content="<h3>Action failed or invalid target.</h3>", status_code=200)

@router.post("/lab4/2/{variant}/check")
async def check_ssrf_2(variant: str, request_data: SSRFCheckRequest, request: Request, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")

    target_url = request_data.stockApi

    if "api/check" in target_url:
        return {"stock": 425}
    if "status" in target_url:
        return {"status": "Healthy", "uptime": "99.9%"}
    if "api/track" in target_url:
        return {"location": "In Transit", "eta": "2 Days"}

    match = re.search(r'http://192\.168\.0\.(\d+):8080(.*)', target_url)
    if match:
        octet = int(match.group(1))
        path_and_query = match.group(2)
        
        h = int(hashlib.md5(instance['instance_id'].encode()).hexdigest(), 16)
        admin_octet = (h % 254) + 1
        
        if octet == admin_octet:
             if not path_and_query or path_and_query == "/" or path_and_query == "/admin":
                 return await get_admin_panel_internal_2(variant, "true", instance)
             elif path_and_query.startswith("/admin/delete"):
                 parsed = urlparse(path_and_query)
                 qs = parse_qs(parsed.query)
                 target = qs.get("username", [None])[0] or qs.get("instance", [None])[0] or qs.get("shipment", [None])[0]
                 return await delete_user_internal_2(variant, target, "true", instance)
             else:
                 return Response(content="404 Not Found", status_code=404)
        else:
             return Response(content="Could not connect to host. Connection timed out.", status_code=500)

    # Simulated generic failure
    return Response(content="Could not connect to external service.", status_code=400)


@router.get("/lab4/2/{variant}/admin")
async def get_admin_panel_2(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
    return await get_admin_panel_internal_2(variant, x_internal_ssrf or "", instance)

@router.get("/lab4/2/{variant}/admin/delete")
async def delete_user_2(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
    target = request.query_params.get("username") or request.query_params.get("instance") or request.query_params.get("shipment")
    return await delete_user_internal_2(variant, target, x_internal_ssrf or "", instance)
