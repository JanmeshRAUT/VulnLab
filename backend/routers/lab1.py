import os
import hashlib
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import PlainTextResponse, FileResponse
from pydantic import BaseModel

router = APIRouter(prefix="/api/lab1", tags=["Lab 1"])

# Helper from the original app ported to FastAPI
def get_or_generate_flag(identity_key: str, lab_id: str, variation: str = 'default'):
    """Generate a reproducible, unique research deliverable for a subject"""
    secret_key = os.environ.get('SECRET_KEY', 'default_vulnerable_key_replace_in_prod')
    seed_string = f"{identity_key}-{lab_id}-{variation}-{secret_key}"
    short_hash = hashlib.sha256(seed_string.encode()).hexdigest()[:12]
    prefix = lab_id.split('_')[0]
    return f"FLAG{{{prefix}_{variation}_{short_hash}}}"

def get_random_flag(request: Request, lab_id: str, variation: str = 'default'):
    """Generate dynamic flag and save to FastAPI session."""
    # Note: In the new system, we rely heavily on user_id in session
    identity_key = request.session.get('user_id')
    if not identity_key:
        identity_key = request.headers.get('X-SSRF-Researcher-GUID')
        
    if not identity_key:
        # Fallbacks for unauthenticated
        if lab_id == 'lab1':
            if variation == 'variation_A': return "FLAG{file_system_traversal_alpha}"
            if variation == 'variation_B': return "FLAG{directory_enumeration_beta}"
            if variation == 'variation_C': return "FLAG{path_manipulation_gamma}"
        return "FLAG{unauthenticated_research_lock}"
        
    issued_flag = get_or_generate_flag(identity_key, lab_id, variation)
    
    # Store in session so submission validation (later) can verify it
    lab_flags = request.session.get('lab_flags', {})
    lab_issued = list(lab_flags.get(lab_id, []))
    if issued_flag not in lab_issued:
        lab_issued.append(issued_flag)
    if len(lab_issued) > 25:
        lab_issued = lab_issued[-25:]
    lab_flags[lab_id] = lab_issued
    request.session['lab_flags'] = lab_flags
    
    return issued_flag


BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# -------------------------
# LAB 1.1: DocuVault
# -------------------------
@router.get("/1/files")
async def lab1_1_files():
    """Return JSON list of files instead of rendering a template."""
    return [
        'Invoice_2024_001.pdf', 'Invoice_2024_002.pdf', 'Project_Alpha_Specs.docx', 
        'Q1_Financial_Report.xlsx', 'Meeting_Minutes_Jan.txt', 'Employee_Handbook_v2.pdf',
        'Architecture_Diagram_Final.png', 'Client_Contract_AcmeCorp.pdf',
        'Budget_Allocation_2024.xlsx', 'Security_Policy_Draft.docx',
        'Server_Logs_Backup.txt', 'Marketing_Assets.zip', 'Team_Photo_Retreat.jpg',
        'Vendor_List.csv', 'readme.txt'
    ]

@router.get("/1/download")
async def lab1_1_download(request: Request, file: str):
    """
    VULNERABLE ENDPOINT: Path Traversal
    The 'file' parameter is directly concatenated.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file specified")
        
    # PHYSICAL SYSTEM FILE SIMULATION (Using etc/passwd)
    if 'etc/passwd' in file.replace('\\', '/') or 'passwd' in file.lower():
        try:
            passwd_path = os.path.join(BASE_PATH, 'etc', 'passwd')
            with open(passwd_path, 'r') as f:
                lines = f.readlines()
            
            # Inject flag
            if len(lines) >= 4:
                lines[1] = get_random_flag(request, 'lab1', 'variation_A') + "\n"
                lines[2] = "# [ACCESS RESTRICTED]: Proceed to Lab 1.2 for current deliverable.\n"
                lines[3] = "# [ACCESS RESTRICTED]: Proceed to Lab 1.3 for current deliverable.\n"
            return PlainTextResponse("".join(lines))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error accessing system file template: {e}")

    # VULNERABILITY: Unsafe Join
    # For a local dev setup, we'll pretend there's a user workspace
    # In original app: user_ws = get_user_workspace() -> docuvault/invoices
    intended_dir = os.path.join(BASE_PATH, 'data', 'docuvault', 'invoices')
    file_path = os.path.normpath(os.path.join(intended_dir, file))
    
    # Force text/plain for simulated office/pdf documents so the browser doesn't try to parse them
    ext = os.path.splitext(file_path)[1].lower()
    simulated_media = "text/plain" if ext in ['.pdf', '.docx', '.xlsx', '.csv', '.zip'] else None

    if os.path.exists(file_path):
        return FileResponse(file_path, media_type=simulated_media)
    else:
        # Create dummy file if it doesn't exist for the lab to work
        if "Invoice" in file or "readme" in file or "Report" in file or "Specs" in file or "Policy" in file or "Handbook" in file:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w') as f:
                f.write(f"This is a simulated dummy file for {file}\n\n[Lab 1.1 Content]")
            return FileResponse(file_path, media_type=simulated_media)
            
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

# -------------------------
# LAB 1.2: ShopExpress
# -------------------------
@router.get("/2/products")
async def lab1_2_products():
    return [
        {
            'id': 1, 'name': 'Eco-Friendly Bamboo Coffee Cup', 'price': 12.99,
            'description': 'Sustainable bamboo cup with silicone lid and grip.',
            'image': 'prod_1.png'
        },
        {
            'id': 2, 'name': 'Recycled Plastic Travel Mug', 'price': 15.50,
            'description': 'Made from 100% recycled plastics. Durable and leak-proof.',
            'image': 'prod_2.png'
        },
        {
            'id': 3, 'name': 'Artisan Pour-Over Dripper', 'price': 24.00,
            'description': 'Ceramic pour-over coffee maker for the perfect blooming extraction.',
            'image': 'prod_3.png'
        },
        {
            'id': 4, 'name': 'Fair Trade Organic Beans (1lb)', 'price': 18.99,
            'description': 'Single-origin Ethiopian Yirgacheffe beans. Light roast with floral notes.',
            'image': 'prod_4.png'
        },
        {
            'id': 5, 'name': 'Minimalist Espresso Cups (Set of 2)', 'price': 14.00,
            'description': 'Matte black ceramic espresso cups, heavily insulated to retain heat.',
            'image': 'prod_5.png'
        },
        {
            'id': 6, 'name': 'Cold Brew Glass Pitcher', 'price': 29.99,
            'description': '1-liter borosilicate glass pitcher with a removable stainless steel filter.',
            'image': 'prod_6.png'
        }
    ]

@router.get("/2/image")
async def lab1_2_image(request: Request, filename: str):
    """
    VULNERABLE ENDPOINT: Path Traversal via Image Loader
    """
    if not filename:
        raise HTTPException(status_code=400, detail="No filename specified")
        
    if 'etc/passwd' in filename.replace('\\', '/') or 'passwd' in filename.lower():
        try:
            passwd_path = os.path.join(BASE_PATH, 'etc', 'passwd')
            with open(passwd_path, 'r') as f:
                lines = f.readlines()
            if len(lines) >= 4:
                lines[1] = "# [ACCESS RESTRICTED]: Retrieve from Lab 1.1 deliverables.\n"
                lines[2] = get_random_flag(request, 'lab1', 'variation_B') + "\n"
                lines[3] = "# [ACCESS RESTRICTED]: Proceed to Lab 1.3 for current deliverable.\n"
            return PlainTextResponse("".join(lines))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    intended_dir = os.path.join(BASE_PATH, 'img')
    file_path = os.path.normpath(os.path.join(intended_dir, filename))
    
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='image/png')
    else:
        # Create dummy file if it doesn't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(f"Simulated image {filename}")
        return FileResponse(file_path, media_type='text/plain')

# -------------------------
# LAB 1.3: PixelMarket
# -------------------------
@router.get("/3/media")
async def lab1_3_media():
    return [
        {'file': 'summer_vacation_001.jpg', 'title': 'Golden Hour Beach', 'author': 'Sarah Jenkins', 'tags': ['Nature', 'Travel'], 'views': '2.4k', 'price': 29},
        {'file': 'office_party_2023.jpg', 'title': 'Corporate Celebration', 'author': 'TechLife Media', 'tags': ['Business', 'Events'], 'views': '1.1k', 'price': 49},
        {'file': 'product_launch.jpg', 'title': 'Minimalist Product Shot', 'author': 'Studio 54', 'tags': ['Product', 'Minimal'], 'views': '8.5k', 'price': 99},
        {'file': 'hiking_adventure.jpg', 'title': 'Mountain Summit', 'author': 'Alex Climbs', 'tags': ['Adventure', 'Nature'], 'views': '5k', 'price': 35},
        {'file': 'design_mockup_v2.jpg', 'title': 'UI/UX Dashboard Kit', 'author': 'Creative UI', 'tags': ['Tech', 'Design'], 'views': '12k', 'price': 59},
        {'file': 'city_skyline.jpg', 'title': 'Urban Nightlife', 'author': 'City Lights', 'tags': ['City', 'Travel'], 'views': '3.2k', 'price': 45},
        {'file': 'abstract_background.jpg', 'title': 'Neon Abstract 4K', 'author': 'Digital Dreams', 'tags': ['Abstract', 'Art'], 'views': '900', 'price': 15},
        {'file': 'coffee_break.jpg', 'title': 'Morning Espresso', 'author': 'Barista Daily', 'tags': ['Food', 'Lifestyle'], 'views': '4.1k', 'price': 25},
    ]

@router.get("/3/image")
async def lab1_3_image(request: Request, filename: str):
    """
    VULNERABLE ENDPOINT: Path Traversal via Image Loader
    """
    if not filename:
        raise HTTPException(status_code=400, detail="No filename specified")
        
    if 'etc/passwd' in filename.replace('\\', '/') or 'passwd' in filename.lower():
        try:
            passwd_path = os.path.join(BASE_PATH, 'etc', 'passwd')
            with open(passwd_path, 'r') as f:
                lines = f.readlines()
            if len(lines) >= 4:
                lines[1] = "# [ACCESS RESTRICTED]: Retrieve from Lab 1.1 deliverables.\n"
                lines[2] = "# [ACCESS RESTRICTED]: Retrieve from Lab 1.2 deliverables.\n"
                lines[3] = get_random_flag(request, 'lab1', 'variation_C') + "\n"
            return PlainTextResponse("".join(lines))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    intended_dir = os.path.join(BASE_PATH, 'img')
    file_path = os.path.normpath(os.path.join(intended_dir, filename))
    
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='image/jpeg')
    else:
        # Create dummy file if it doesn't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(f"Simulated image {filename}")
        return FileResponse(file_path, media_type='text/plain')
