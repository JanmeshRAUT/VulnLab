from fastapi import APIRouter, Depends, HTTPException, Request, Response
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance
import re

router = APIRouter()

@router.post("/lab6/1/{variant}/check-stock")
async def check_stock_level(
    variant: str,
    request: Request,
    instance: dict = Depends(get_valid_instance)
):
    """
    Simulates a vulnerable OS command injection endpoint.
    The application supposedly runs:
    stock_checker.sh <productId> <storeId>
    """
    if instance.get("lab_id") != "6" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    form_data = await request.form()
    
    product_id = form_data.get('productId', '')
    
    # Accept different store identifier parameters based on variant
    store_param = 'storeId'
    if variant == 'b':
        store_param = 'locationId'
    elif variant == 'c':
        store_param = 'branchId'
        
    store_id = form_data.get(store_param, '')
    
    # In a real app, this might be:
    # command = f"/usr/bin/stock_checker.sh {product_id} {store_id}"
    # result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    # We will safely simulate this command injection for learning purposes
    
    full_args = f"{product_id} {store_id}"
    
    # If the user injected a pipe or semicolon and 'whoami'
    # Pattern matching typical command injection: | whoami, ; whoami, && whoami
    # We'll parse out the commands separated by shell operators
    commands = re.split(r'[|;&\n]', full_args)
    
    output = ""
    
    for cmd in commands:
        cmd = cmd.strip()
        if not cmd:
            continue
            
        if cmd == "whoami":
            # If they successfully ran whoami, we issue the flag
            try:
                record = await issue_flag_for_instance(instance['instance_id'], f'lab6:1{variant}')
                flag = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
                output += f"peter\nCongratulations! Your flag is: {flag}\n"
            except Exception as e:
                output += f"peter\nFLAG{{ERROR_GENERATING_FLAG}}\n"
        elif cmd.isdigit() or re.match(r'^\d+\s+\d+$', cmd):
            # Normal stock check simulation
            output += "Stock level: 42\n"
        elif cmd.startswith("stock_checker"):
            # Normal operation
            pass
        elif cmd == "ls":
            output += "stock_checker.sh\nconfig.json\n"
        else:
            output += f"sh: 1: {cmd.split()[0] if cmd else ''}: not found\n"
            
    if not output:
        output = "Error: Invalid arguments"
        
    return Response(content=output, media_type="text/plain")
