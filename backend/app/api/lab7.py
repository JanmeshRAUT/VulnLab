import sqlite3
from fastapi import APIRouter, Depends, Request
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance

router = APIRouter()

def setup_db(variant: str):
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE products (
            id INTEGER PRIMARY KEY,
            name TEXT,
            category TEXT,
            released INTEGER
        )
    ''')
    
    products = []
    if variant == 'a':
        products = [
            (1, 'Corporate Gift Basket', 'Gifts', 1),
            (2, 'Tech Gadget Bundle', 'Gifts', 1),
            (3, 'Executive Pen Set', 'Gifts', 1),
            (4, 'Next-Gen VR Headset', 'Electronics', 0), # Unreleased
            (5, 'Smart Coffee Mug', 'Kitchen', 1),
            (6, 'Quantum Phone Pro', 'Electronics', 0), # Unreleased
            (7, 'Ultra-Light Laptop 2027', 'Computers', 0), # Unreleased
            (8, 'Artisan Chocolate Box', 'Food', 1),
            (9, 'Luxury Spa Set', 'Bath', 1),
            (10, 'Personalized Leather Wallet', 'Accessories', 1),
            (11, 'Smart Watch Series X', 'Electronics', 1),
            (12, 'Hoverboard Pro', 'Toys', 0), # Unreleased
            (13, 'Noise-Cancelling Headphones', 'Electronics', 1),
            (14, 'Gourmet Tea Collection', 'Food', 1),
            (15, 'Levitating Bluetooth Speaker', 'Electronics', 0) # Unreleased
        ]
    elif variant == 'b':
        products = [
            (1, 'Introduction to Algorithms', 'Non-Fiction', 1),
            (2, 'The Great Gatsby', 'Fiction', 1),
            (3, 'Design Patterns', 'Non-Fiction', 1),
            (4, 'The Winds of Winter', 'Fiction', 0), # Unreleased
            (5, 'Clean Code', 'Non-Fiction', 1),
            (6, 'Dune Messiah', 'Fiction', 1),
            (7, 'A Dream of Spring', 'Fiction', 0), # Unreleased
            (8, 'The Pragmatic Programmer', 'Non-Fiction', 1),
            (9, '1984', 'Fiction', 1),
            (10, 'Sapiens: A Brief History of Humankind', 'Non-Fiction', 1),
            (11, 'The Hobbit', 'Fiction', 1),
            (12, 'Doors of Stone', 'Fiction', 0), # Unreleased
            (13, 'To Kill a Mockingbird', 'Fiction', 1),
            (14, 'Thinking, Fast and Slow', 'Non-Fiction', 1),
            (15, 'Project Hail Mary', 'Fiction', 1)
        ]
    else:
        products = [
            (1, 'Quantum GPU RTX 9000', 'Electronics', 1),
            (2, 'Mech Keyboard v2', 'Computers', 1),
            (3, 'Neural Link Headset', 'Electronics', 0), # Unreleased
            (4, 'AI Server Rack', 'Servers', 1),
            (5, 'Holographic Monitor', 'Computers', 0), # Unreleased
            (6, 'Quantum SSD 10TB', 'Computers', 1),
            (7, '8K Curved Display', 'Monitors', 1),
            (8, 'Ergonomic Developer Chair', 'Furniture', 1),
            (9, 'Photon Processor Unit', 'Electronics', 0), # Unreleased
            (10, 'Liquid Cooling System Pro', 'Computers', 1),
            (11, 'Smart Home Hub 3.0', 'Electronics', 1),
            (12, 'Drone Delivery Robot', 'Robotics', 0), # Unreleased
            (13, 'Wireless Charging Desk', 'Furniture', 1),
            (14, 'VR Haptic Suit', 'Gaming', 1),
            (15, 'Portable Fusion Reactor', 'Power', 0) # Unreleased
        ]
        
    cursor.executemany('INSERT INTO products VALUES (?,?,?,?)', products)
    conn.commit()
    return conn

@router.get("/lab7/1/{variant}")
async def get_products(variant: str, category: str = '', instance: dict = Depends(get_valid_instance)):
    conn = setup_db(variant)
    cursor = conn.cursor()
    
    try:
        # VULNERABLE QUERY - string concatenation
        if category:
            query = f"SELECT * FROM products WHERE category = '{category}' AND released = 1"
        else:
            query = "SELECT * FROM products WHERE released = 1"
            
        cursor.execute(query)
        rows = cursor.fetchall()
        
        products = []
        unreleased_found = False
        
        for row in rows:
            product = {
                'id': row[0],
                'name': row[1],
                'category': row[2],
                'released': row[3]
            }
            products.append(product)
            if product['released'] == 0:
                unreleased_found = True
                
        flag = None
        if unreleased_found:
            record = await issue_flag_for_instance(instance['instance_id'], f'lab7:1{variant}')
            flag = record['flag_value'] if record else 'FLAG{sqli_bypass_successful}'
            
        return {"products": products, "flag": flag}
        
    except sqlite3.Error as e:
        # In a real app we might not return the raw error, but often SQLi labs do
        return {"products": [], "error": str(e)}
    finally:
        conn.close()

from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

def setup_auth_db(variant: str):
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT,
            role TEXT
        )
    ''')
    
    users = [
        (1, 'administrator', 'w32dks9d8sdf29jdf', 'admin'),
        (2, 'carlos', 'montoya99', 'user'),
        (3, 'wiener', 'peter', 'user')
    ]
        
    cursor.executemany('INSERT INTO users VALUES (?,?,?,?)', users)
    conn.commit()
    return conn

@router.post("/lab7/2/{variant}/login")
async def login(variant: str, req: LoginRequest, instance: dict = Depends(get_valid_instance)):
    conn = setup_auth_db(variant)
    cursor = conn.cursor()
    
    try:
        # VULNERABLE QUERY - string concatenation
        query = f"SELECT * FROM users WHERE username = '{req.username}' AND password = '{req.password}'"
        cursor.execute(query)
        user = cursor.fetchone()
        
        if user:
            return {
                "success": True, 
                "message": f"Welcome back, {user[1]}", 
                "role": user[3],
                "username": user[1]
            }
        else:
            return {"success": False, "message": "Invalid username or password"}
            
    except sqlite3.Error as e:
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

@router.get("/lab7/2/{variant}/users")
async def get_users(variant: str, instance: dict = Depends(get_valid_instance)):
    # Mocking user list retrieval with multiple users to obfuscate the target
    return {"users": [
        {"id": 1, "username": "administrator", "role": "admin"},
        {"id": 2, "username": "ajohnson", "role": "user"},
        {"id": 3, "username": "mbrown", "role": "user"},
        {"id": 4, "username": "dsmith", "role": "user"},
        {"id": 5, "username": "tjones", "role": "admin"},
        {"id": 6, "username": "pwilson", "role": "user"},
        {"id": 7, "username": "kmartinez", "role": "user"},
        {"id": 8, "username": "carlos", "role": "user"},
        {"id": 9, "username": "wiener", "role": "user"},
        {"id": 10, "username": "jlee", "role": "user"},
        {"id": 11, "username": "hnguyen", "role": "user"},
        {"id": 12, "username": "rgarcia", "role": "admin"},
        {"id": 13, "username": "emiller", "role": "user"},
        {"id": 14, "username": "sdavis", "role": "user"}
    ]}

@router.delete("/lab7/2/{variant}/users/{username}")
async def delete_user(variant: str, username: str, instance: dict = Depends(get_valid_instance)):
    if username.lower() == 'carlos':
        record = await issue_flag_for_instance(instance['instance_id'], f'lab7:2{variant}')
        flag = record['flag_value'] if record else 'FLAG{auth_bypass_successful}'
        return {"success": True, "flag": flag}
    return {"success": True}
