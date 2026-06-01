import importlib
import pkgutil
import sys
from typing import Dict, Type
from app.labs.base import BaseLab

class LabRegistry:
    def __init__(self):
        self._labs: Dict[str, BaseLab] = {}
        
    def register(self, lab: BaseLab):
        self._labs[lab.lab_id] = lab
        print(f"Registered Lab Module: {lab.lab_id}")
        
    def get_lab(self, lab_id: str) -> BaseLab:
        lab = self._labs.get(lab_id)
        if not lab:
            raise ValueError(f"Lab {lab_id} not found in registry")
        return lab
        
    def load_all_labs(self, package_name: str = "app.labs"):
        """Dynamically load all lab modules from the labs directory."""
        package = sys.modules.get(package_name)
        if not package:
            try:
                package = importlib.import_module(package_name)
            except ImportError as e:
                print(f"Error importing lab package: {e}")
                return

        for _, module_name, is_pkg in pkgutil.iter_modules(package.__path__):
            if is_pkg and module_name.startswith("lab_"):
                full_module_name = f"{package_name}.{module_name}"
                try:
                    module = importlib.import_module(full_module_name)
                    # We expect each lab package's __init__.py to have a `get_lab_instance` function
                    if hasattr(module, 'get_lab_instance'):
                        lab_instance = module.get_lab_instance()
                        self.register(lab_instance)
                except Exception as e:
                    print(f"Failed to load lab {module_name}: {e}")

registry = LabRegistry()
