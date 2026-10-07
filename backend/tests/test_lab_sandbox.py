import os
import glob
import re

def test_no_unsafe_operations_in_labs():
    """
    Ensure that lab code (which is meant to be a simulated environment)
    does not use dangerous real-world functions like open(), os.path.join,
    FileResponse, subprocess, or httpx.
    """
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    lab_files = glob.glob(os.path.join(backend_dir, "app", "api", "lab*.py"))
    
    assert len(lab_files) > 0, "No lab files found to test"
    
    banned_patterns = [
        (r'\bopen\(', "open()"),
        (r'\bos\.path\.join\b', "os.path.join"),
        (r'\bFileResponse\b', "FileResponse"),
        (r'\bsubprocess\.', "subprocess"),
        (r'\bhttpx\.', "httpx")
    ]
    
    errors = []
    
    for file_path in lab_files:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        for i, line in enumerate(lines):
            # Ignore comments
            if line.strip().startswith("#"):
                continue
                
            for pattern, name in banned_patterns:
                if re.search(pattern, line):
                    errors.append(f"{os.path.basename(file_path)}:{i+1} uses banned function {name}")
                    
    assert not errors, "Sandbox violations found:\n" + "\n".join(errors)
