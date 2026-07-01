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
             # We also pass cookies to preserve the instance session
             async with httpx.AsyncClient() as client:
                 response = await client.get(internal_url, headers={"X-Internal-SSRF": "true"}, cookies=request.cookies)
                 
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
    If a real user hits this directly in their browser, they will get a 401.
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")

    if x_internal_ssrf != "true":
         # If the user just browses to /admin, deny them.
         return HTMLResponse(content="<h1>401 Unauthorized</h1><p>Admin interface is only available if requested from the local loopback interface (127.0.0.1).</p>", status_code=401)
         
    # If the SSRF hit this, return the admin interface HTML
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Internal Admin Panel</title>
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
            <h2>Administration Interface</h2>
            <p>Welcome, local administrator.</p>
            
            <h3>User Management</h3>
            <table>
                <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
                <tr>
                    <td>wiener</td>
                    <td>User</td>
                    <td><a href="http://localhost/admin/delete?username=wiener" class="delete-btn">Delete</a></td>
                </tr>
                <tr>
                    <td>carlos</td>
                    <td>User</td>
                    <td><a href="http://localhost/admin/delete?username=carlos" class="delete-btn">Delete</a></td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.get("/lab4/1/{variant}/admin/delete")
async def delete_user(variant: str, username: str, request: Request, x_internal_ssrf: Optional[str] = Header(None), instance: dict = Depends(get_valid_instance)):
    """
    The sensitive action endpoint. Deletes a user.
    """
    if instance.get("lab_id") != "4" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    if x_internal_ssrf != "true":
         return HTMLResponse(content="<h1>401 Unauthorized</h1>", status_code=401)
         
    if username == "carlos":
         try:
             record = await issue_flag_for_instance(instance['instance_id'], f'lab4:1{variant}')
             flag = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
         except Exception as e:
             flag = "FLAG{ERROR_GENERATING_FLAG}"
             
         html_content = f"""
         <!DOCTYPE html>
         <html>
         <head><title>User Deleted</title></head>
         <body>
             <h2 style="color: green;">Success: User 'carlos' deleted successfully!</h2>
             <p>Congratulations, you solved the lab!</p>
             <p><b>Your Flag: {flag}</b></p>
             <a href="http://localhost/admin">Back to Admin</a>
         </body>
         </html>
         """
         return HTMLResponse(content=html_content)
    
    return HTMLResponse(content=f"User {username} deleted.", status_code=200)
