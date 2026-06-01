import os
import subprocess
from fastapi import APIRouter, Request, HTTPException, Form, Depends
from fastapi.responses import PlainTextResponse
from .session_utils import get_valid_instance, get_random_flag

router = APIRouter(prefix="/api/lab6", tags=["Lab 6"])

# -------------------------
# LAB 6.1: OS Command Injection via Stock Check
# -------------------------

# Variation A: MegaMart
@router.post("/1/check-stock")
async def lab6_1_check_stock(request: Request, productId: str = Form(""), storeId: str = Form(""), instance: dict = Depends(get_valid_instance)):
    try:
        command = f"echo Stock check for product {productId} at store {storeId} && echo Units available: 42"
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True, timeout=5)
        output = result.strip()
        if 'whoami' in storeId.lower() or 'id' in storeId.lower():
            output = f"{output}\n{get_random_flag(instance, 'lab6', variation='variation_A')}"
        return PlainTextResponse(output)
    except subprocess.TimeoutExpired:
        return PlainTextResponse("Error: Command timed out")
    except Exception as e:
        return PlainTextResponse(f"Error executing stock check: {str(e)}")

# Variation B: AutoParts Pro
@router.post("/1/b/check-stock")
async def lab6_1_b_check_stock(request: Request, productId: str = Form(""), locationId: str = Form(""), instance: dict = Depends(get_valid_instance)):
    try:
        command = f"echo Warehouse query: SKU {productId} at location {locationId} && echo Inventory count: 156"
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True, timeout=5)
        output = result.strip()
        if 'whoami' in locationId.lower() or 'id' in locationId.lower():
            output = f"{output}\n{get_random_flag(instance, 'lab6', variation='variation_B')}"
        return PlainTextResponse(output)
    except subprocess.TimeoutExpired:
        return PlainTextResponse("Error: Query timed out")
    except Exception as e:
        return PlainTextResponse(f"System error: {str(e)}")

# Variation C: PharmaCare
@router.post("/1/c/check-stock")
async def lab6_1_c_check_stock(request: Request, productId: str = Form(""), branchId: str = Form(""), instance: dict = Depends(get_valid_instance)):
    try:
        command = f"echo Prescription verification: NDC {productId} at branch {branchId} && echo Stock level: 89 units"
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True, timeout=5)
        output = result.strip()
        if 'whoami' in branchId.lower() or 'id' in branchId.lower():
            output = f"{output}\n{get_random_flag(instance, 'lab6', variation='variation_C')}"
        return PlainTextResponse(output)
    except subprocess.TimeoutExpired:
        return PlainTextResponse("Error: Verification timeout")
    except Exception as e:
        return PlainTextResponse(f"Database error: {str(e)}")
