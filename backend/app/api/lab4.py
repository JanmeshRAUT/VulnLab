from fastapi import APIRouter, Request, HTTPException, Response, Header, Depends
from fastapi.responses import HTMLResponse
import httpx
from typing import Optional
from app.core.config import settings
from pydantic import BaseModel
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance
router = APIRouter()

class SSRFCheckRequest(BaseModel):
    stockApi: str

# Mock responses for normal usage
MOCK_API_DATA = {
    "http://stock.cloudstock.internal/api/check": {"stock": 425},
    "http://internal.cloud.local/status": {"status": "Healthy", "uptime": "99.9%"},
    "http://logistics.internal/api/track": {"location": "In Transit", "eta": "2 Days"}
}

def is_loopback(url: str) -> bool:
    """Check if the target URL points to the local loopback."""
    # This is a simple check. In a real lab environment, you'd want to handle variations
    # like 127.0.0.1, localhost, 0.0.0.0, [::1], etc.
    return "localhost" in url.lower() or "127.0.0.1" in url.lower()

@router.post("/lab4/1/{variant}/check")
async def check_ssrf(variant: str, request_data: SSRFCheckRequest, request: Request, instance: dict = Depends(get_valid_instance)):
    """
    Vulnerable SSRF endpoint.
    It takes the 'stockApi' parameter from the client and fetches it server-side.
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")

    target_url = request_data.stockApi

    # MOCKING: If it's one of our expected internal mock endpoints, return mock data.
    if target_url.startswith("http://stock.cloudstock.internal/api/check"):
         return {"stock": 425}
    if target_url.startswith("http://internal.cloud.local/status"):
         return {"status": "Healthy", "uptime": "99.9%"}
    if target_url.startswith("http://logistics.internal/api/track"):
         return {"location": "In Transit", "eta": "2 Days"}
    
    # SSRF EXECUTION: 
    # If the user targets localhost/127.0.0.1, we must route it internally
    # to avoid network issues inside containers where localhost might not resolve correctly.
    if is_loopback(target_url):
        # Rewrite the URL to point to our internal FastAPI routes
        try:
             # Extract the path after localhost/127.0.0.1
             # E.g., http://localhost/admin/delete?username=carlos -> /admin/delete?username=carlos
             path_and_query = target_url.split("localhost", 1)[-1]
             if "127.0.0.1" in target_url:
                 path_and_query = target_url.split("127.0.0.1", 1)[-1]
             
             # Clean up the port if the user provided one (e.g. localhost:8000/admin)
             if path_and_query.startswith(":"):
                 path_and_query = "/" + path_and_query.split("/", 1)[-1] if "/" in path_and_query else "/"
                 
             # Construct the internal path to our mocked admin interface
             internal_url = f"http://127.0.0.1:8000/api/lab4/1/{variant}{path_and_query}"
             
             # Fetch it! Notice we are passing a custom header to prove it came via SSRF
             # We also pass cookies and the session header to preserve the instance session
             ssrf_headers = {"X-Internal-SSRF": "true"}
             if request.headers.get("X-Variant-Session-ID"):
                 ssrf_headers["X-Variant-Session-ID"] = request.headers.get("X-Variant-Session-ID")
                 
             async with httpx.AsyncClient() as client:
                 response = await client.get(internal_url, headers=ssrf_headers, cookies=request.cookies)
                 
                 # If it returned HTML (like the admin page), return it as an HTML response
                 if "text/html" in response.headers.get("Content-Type", ""):
                     return HTMLResponse(content=response.text, status_code=response.status_code)
                 
                 # Otherwise return JSON/raw text
                 try:
                     return response.json()
                 except:
                     return Response(content=response.text, status_code=response.status_code)
                     
        except Exception as e:
             return Response(content=f"Error executing internal request: {str(e)}", status_code=500)

    # Allow outbound requests if they want to hit an external webhook/collaborator
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
             response = await client.get(target_url)
             try:
                 return response.json()
             except:
                 return Response(content=response.text, status_code=response.status_code)
    except Exception as e:
        return Response(content=f"Could not connect to external service.", status_code=400)


@router.get("/lab4/1/{variant}/admin")
async def get_admin_panel(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    """
    The internal admin panel.
    Only accessible if the request originated from the SSRF vulnerability (simulated by X-Internal-SSRF header).
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")

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

@router.get("/lab4/1/{variant}/admin/delete")
async def delete_user(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    """
    The sensitive action endpoint. Deletes a user/instance/shipment.
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    if x_internal_ssrf != "true":
         return HTMLResponse(content="<h1>401 Unauthorized</h1>", status_code=401)
         
    target = request.query_params.get("username") or request.query_params.get("instance") or request.query_params.get("shipment")
    
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

@router.post("/lab4/2/{variant}/check")
async def check_ssrf_2(variant: str, request_data: SSRFCheckRequest, request: Request, instance: dict = Depends(get_valid_instance)):
    """
    Vulnerable SSRF endpoint for Lab 4.2 (Blind SSRF)
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")

    target_url = request_data.stockApi

    # Always log the admin octet for this session (useful for testing)
    import hashlib
    _h = int(hashlib.md5(instance['instance_id'].encode()).hexdigest(), 16)
    _admin_octet = (_h % 254) + 1
    print(f"[LAB4.2][DEBUG] instance_id={instance['instance_id']} | variant={variant} | admin_octet={_admin_octet} | target=http://192.168.0.{_admin_octet}:8080/admin")

    # Normal expected behavior mocking
    if "api/check" in target_url:
        return {"stock": 425}
    if "status" in target_url:
        return {"status": "Healthy", "uptime": "99.9%"}
    if "api/track" in target_url:
        return {"location": "In Transit", "eta": "2 Days"}

    import re
    import hashlib
    # Match the internal 192.168.0.X subnet
    match = re.search(r'http://192\.168\.0\.(\d+):8080(.*)', target_url)
    
    if match:
        octet = int(match.group(1))
        path_and_query = match.group(2)
        
        # Derive the admin IP octet from the instance ID to make it unique per session
        h = int(hashlib.md5(instance['instance_id'].encode()).hexdigest(), 16)
        admin_octet = (h % 254) + 1  # 1-254
        
        if octet == admin_octet:
             # Default path
             if not path_and_query or path_and_query == "/":
                 path_and_query = "/admin"
             
             internal_url = f"http://127.0.0.1:8000/api/lab4/2/{variant}{path_and_query}"
             ssrf_headers = {"X-Internal-SSRF": "true"}
             if request.headers.get("X-Variant-Session-ID"):
                 ssrf_headers["X-Variant-Session-ID"] = request.headers.get("X-Variant-Session-ID")
                 
             try:
                 async with httpx.AsyncClient() as client:
                     response = await client.get(internal_url, headers=ssrf_headers, cookies=request.cookies)
                     if "text/html" in response.headers.get("Content-Type", ""):
                         return HTMLResponse(content=response.text, status_code=response.status_code)
                     try:
                         return response.json()
                     except:
                         return Response(content=response.text, status_code=response.status_code)
             except Exception as e:
                 return Response(content=f"Error executing internal request: {str(e)}", status_code=500)
        else:
             # For any other 192.168.0.X, we return a 500 error simulating an unreachable host
             return Response(content="Could not connect to host. Connection timed out.", status_code=500)

    # Let other non-192.168.0.X URLs be fetched (for external collaborator tests)
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
             response = await client.get(target_url)
             try:
                 return response.json()
             except:
                 return Response(content=response.text, status_code=response.status_code)
    except Exception as e:
        return Response(content=f"Could not connect to external service.", status_code=400)


@router.get("/lab4/2/{variant}/admin")
async def get_admin_panel_2(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    """
    The internal admin panel for 4.2.
    Only accessible if the request originated from the simulated SSRF.
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")

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


@router.get("/lab4/2/{variant}/admin/delete")
async def delete_user_2(variant: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    """
    The sensitive action endpoint. Deletes a user/instance/shipment.
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    if x_internal_ssrf != "true":
         return HTMLResponse(content="<h1>401 Unauthorized</h1>", status_code=401)
         
    target = request.query_params.get("username") or request.query_params.get("instance") or request.query_params.get("shipment")
    
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
