import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import PlainTextResponse, FileResponse
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance

router = APIRouter(prefix="/lab1", tags=["Lab 1"])
BASE_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@router.get("/1/files")
async def lab1_1_files(instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "1" or instance.get("variant_id") != "1": 
        raise HTTPException(status_code=403, detail="Instance mismatch")
    return [
        'Invoice_2024_001.pdf', 'Invoice_2024_002.pdf', 'Project_Alpha_Specs.docx', 
        'Q1_Financial_Report.xlsx', 'Meeting_Minutes_Jan.txt', 'Employee_Handbook_v2.pdf',
        'Architecture_Diagram_Final.png', 'Client_Contract_AcmeCorp.pdf',
        'Budget_Allocation_2024.xlsx', 'Security_Policy_Draft.docx',
        'Server_Logs_Backup.txt', 'Marketing_Assets.zip', 'Team_Photo_Retreat.jpg',
        'Vendor_List.csv', 'readme.txt'
    ]

@router.get("/1/download")
async def lab1_1_download(file: str, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "1" or instance.get("variant_id") != "1": 
        raise HTTPException(status_code=403, detail="Instance mismatch")
    if not file:
        raise HTTPException(status_code=400, detail="No file specified")
        
    if 'etc/passwd' in file.replace('\\', '/') or 'passwd' in file.lower():
        try:
            record = await issue_flag_for_instance(instance['instance_id'], 'lab1:variation_A')
            flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
            
            lines = [
                "root:x:0:0:root:/root:/bin/ash",
                "bin:x:1:1:bin:/bin:/sbin/nologin",
                "daemon:x:2:2:daemon:/sbin:/sbin/nologin",
                "adm:x:3:4:adm:/var/adm:/sbin/nologin",
                "lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin",
                "sync:x:5:0:sync:/sbin:/bin/sync",
                "shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown",
                "halt:x:7:0:halt:/sbin:/sbin/halt",
                "mail:x:8:12:mail:/var/mail:/sbin/nologin",
                "news:x:9:13:news:/usr/lib/news:/sbin/nologin",
                "uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin",
                "operator:x:11:0:operator:/root:/sbin/nologin",
                "man:x:13:15:man:/usr/man:/sbin/nologin",
                "postmaster:x:14:12:postmaster:/var/mail:/sbin/nologin",
                "cron:x:16:16:cron:/var/spool/cron:/sbin/nologin",
                "ftp:x:21:21::/var/lib/ftp:/sbin/nologin",
                "sshd:x:22:22:sshd:/dev/null:/sbin/nologin",
                "at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin",
                "squid:x:31:31:Squid:/var/cache/squid:/sbin/nologin",
                "xfs:x:33:33:X Font Server:/etc/X11/fs:/sbin/nologin",
                "games:x:35:35:games:/usr/games:/sbin/nologin",
                "cyrus:x:85:12::/usr/cyrus:/sbin/nologin",
                "vpopmail:x:89:89::/var/vpopmail:/sbin/nologin",
                "ntp:x:123:123:NTP:/var/empty:/sbin/nologin",
                "smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin",
                "guest:x:405:100:guest:/dev/null:/sbin/nologin",
                "nobody:x:65534:65534:nobody:/:/sbin/nologin",
                "nginx:x:100:101:nginx:/var/lib/nginx:/sbin/nologin",
                "vnstat:x:101:102:vnstat:/var/lib/vnstat:/bin/false",
                "redis:x:102:103:redis:/var/lib/redis:/bin/false",
                f"{flag_value}",
                "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin"
            ]
            return PlainTextResponse("\n".join(lines))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error accessing system file template: {e}")

    intended_dir = os.path.join(BASE_PATH, 'data', 'docuvault', 'invoices')
    file_path = os.path.normpath(os.path.join(intended_dir, file))
    
    ext = os.path.splitext(file_path)[1].lower()
    simulated_media = "text/plain" if ext in ['.pdf', '.docx', '.xlsx', '.csv', '.zip'] else None

    if os.path.exists(file_path):
        return FileResponse(file_path, media_type=simulated_media)
    else:
        if "Invoice" in file or "readme" in file or "Report" in file or "Specs" in file or "Policy" in file or "Handbook" in file:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w') as f:
                f.write(f"This is a simulated dummy file for {file}\n\n[Lab 1.1 Content]")
            return FileResponse(file_path, media_type=simulated_media)
            
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

@router.get("/2/products")
async def lab1_2_products(instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "1" or instance.get("variant_id") != "2": 
        raise HTTPException(status_code=403, detail="Instance mismatch")
    return [
        {
            'id': 1, 'name': 'Eco-Friendly Bamboo Coffee Cup', 'price': 12.99,
            'description': 'Sustainable bamboo cup with silicone lid and grip.',
            'image': 'images/prod_1.png'
        },
        {
            'id': 2, 'name': 'Recycled Plastic Travel Mug', 'price': 15.50,
            'description': 'Made from 100% recycled plastics. Durable and leak-proof.',
            'image': 'images/prod_2.png'
        },
        {
            'id': 3, 'name': 'Artisan Pour-Over Dripper', 'price': 24.00,
            'description': 'Ceramic pour-over coffee maker for the perfect blooming extraction.',
            'image': 'images/prod_3.png'
        },
        {
            'id': 4, 'name': 'Fair Trade Organic Beans (1lb)', 'price': 18.99,
            'description': 'Single-origin Ethiopian Yirgacheffe beans. Light roast with floral notes.',
            'image': 'images/prod_4.png'
        },
        {
            'id': 5, 'name': 'Minimalist Espresso Cups (Set of 2)', 'price': 14.00,
            'description': 'Matte black ceramic espresso cups, heavily insulated to retain heat.',
            'image': 'images/prod_5.png'
        },
        {
            'id': 6, 'name': 'Cold Brew Glass Pitcher', 'price': 29.99,
            'description': '1-liter borosilicate glass pitcher with a removable stainless steel filter.',
            'image': 'images/prod_6.png'
        }
    ]

@router.get("/2/image")
async def lab1_2_image(filename: str, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "1" or instance.get("variant_id") != "2": 
        raise HTTPException(status_code=403, detail="Instance mismatch")
    if not filename:
        raise HTTPException(status_code=400, detail="No filename specified")
        
    if 'etc/passwd' in filename.replace('\\', '/') or 'passwd' in filename.lower():
        try:
            record = await issue_flag_for_instance(instance['instance_id'], 'lab1:variation_B')
            flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
            
            lines = [
                                "root:x:0:0:root:/root:/bin/ash",
                "bin:x:1:1:bin:/bin:/sbin/nologin",
                "daemon:x:2:2:daemon:/sbin:/sbin/nologin",
                "adm:x:3:4:adm:/var/adm:/sbin/nologin",
                "lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin",
                "sync:x:5:0:sync:/sbin:/bin/sync",
                "shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown",
                "halt:x:7:0:halt:/sbin:/sbin/halt",
                "mail:x:8:12:mail:/var/mail:/sbin/nologin",
                "news:x:9:13:news:/usr/lib/news:/sbin/nologin",
                "uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin",
                "operator:x:11:0:operator:/root:/sbin/nologin",
                "man:x:13:15:man:/usr/man:/sbin/nologin",
                "postmaster:x:14:12:postmaster:/var/mail:/sbin/nologin",
                "cron:x:16:16:cron:/var/spool/cron:/sbin/nologin",
                "ftp:x:21:21::/var/lib/ftp:/sbin/nologin",
                "sshd:x:22:22:sshd:/dev/null:/sbin/nologin",
                "at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin",
                "squid:x:31:31:Squid:/var/cache/squid:/sbin/nologin",
                "xfs:x:33:33:X Font Server:/etc/X11/fs:/sbin/nologin",
                "games:x:35:35:games:/usr/games:/sbin/nologin",
                "cyrus:x:85:12::/usr/cyrus:/sbin/nologin",
                "vpopmail:x:89:89::/var/vpopmail:/sbin/nologin",
                "ntp:x:123:123:NTP:/var/empty:/sbin/nologin",
                "smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin",
                "guest:x:405:100:guest:/dev/null:/sbin/nologin",
                "nobody:x:65534:65534:nobody:/:/sbin/nologin",
                "nginx:x:100:101:nginx:/var/lib/nginx:/sbin/nologin",
                "vnstat:x:101:102:vnstat:/var/lib/vnstat:/bin/false",
                "redis:x:102:103:redis:/var/lib/redis:/bin/false",
                f"{flag_value}",
                "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin"
            ]
            return PlainTextResponse("\n".join(lines))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error accessing system file template: {e}")

    # Strip the 'images/' prefix for actual file resolution so mock images load correctly
    actual_filename = filename
    if actual_filename.startswith("images/"):
        actual_filename = actual_filename[7:]
    
    file_path = os.path.join(BASE_PATH, 'img', actual_filename)
    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'wb') as f:
            f.write(b"dummy image content")
    return FileResponse(file_path)

@router.get("/3/media")
async def lab1_3_media(instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "1" or instance.get("variant_id") != "3": 
        raise HTTPException(status_code=403, detail="Instance mismatch")
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
async def lab1_3_image(filename: str, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "1" or instance.get("variant_id") != "3": 
        raise HTTPException(status_code=403, detail="Instance mismatch")
    if not filename:
        raise HTTPException(status_code=400, detail="No filename specified")
        
    if 'etc/passwd' in filename.replace('\\', '/') or 'passwd' in filename.lower():
        try:
            record = await issue_flag_for_instance(instance['instance_id'], 'lab1:variation_C')
            flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
            
            lines = [
                "root:x:0:0:root:/root:/bin/ash",
                "bin:x:1:1:bin:/bin:/sbin/nologin",
                "daemon:x:2:2:daemon:/sbin:/sbin/nologin",
                "adm:x:3:4:adm:/var/adm:/sbin/nologin",
                "lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin",
                "sync:x:5:0:sync:/sbin:/bin/sync",
                "shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown",
                "halt:x:7:0:halt:/sbin:/sbin/halt",
                "mail:x:8:12:mail:/var/mail:/sbin/nologin",
                "news:x:9:13:news:/usr/lib/news:/sbin/nologin",
                "uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin",
                "operator:x:11:0:operator:/root:/sbin/nologin",
                "man:x:13:15:man:/usr/man:/sbin/nologin",
                "postmaster:x:14:12:postmaster:/var/mail:/sbin/nologin",
                "cron:x:16:16:cron:/var/spool/cron:/sbin/nologin",
                "ftp:x:21:21::/var/lib/ftp:/sbin/nologin",
                "sshd:x:22:22:sshd:/dev/null:/sbin/nologin",
                "at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin",
                "squid:x:31:31:Squid:/var/cache/squid:/sbin/nologin",
                "xfs:x:33:33:X Font Server:/etc/X11/fs:/sbin/nologin",
                "games:x:35:35:games:/usr/games:/sbin/nologin",
                "cyrus:x:85:12::/usr/cyrus:/sbin/nologin",
                "vpopmail:x:89:89::/var/vpopmail:/sbin/nologin",
                "ntp:x:123:123:NTP:/var/empty:/sbin/nologin",
                "smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin",
                "guest:x:405:100:guest:/dev/null:/sbin/nologin",
                "nobody:x:65534:65534:nobody:/:/sbin/nologin",
                "nginx:x:100:101:nginx:/var/lib/nginx:/sbin/nologin",
                "vnstat:x:101:102:vnstat:/var/lib/vnstat:/bin/false",
                "redis:x:102:103:redis:/var/lib/redis:/bin/false",
                f"{flag_value}"
            ]
            return PlainTextResponse("\n".join(lines))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error accessing system file template: {e}")

    file_path = os.path.join(BASE_PATH, 'img', filename)
    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'wb') as f:
            f.write(b"dummy media content")
    return FileResponse(file_path)
