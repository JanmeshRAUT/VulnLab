from app.labs.base import BaseLab
from typing import Dict, Any

class SQLiLab(BaseLab):
    @property
    def lab_id(self) -> str:
        return "lab_01_sqli"
        
    async def setup_instance(self, instance_id: str, user_id: str) -> Dict[str, Any]:
        # Here we would interact with Docker/K8s to spawn the container
        # For now, return mock connection info
        print(f"Provisioning SQLi lab for instance {instance_id}")
        return {
            "host": "sqli-lab.vulnlab.local",
            "port": 8080,
            "proxy_url": f"https://{instance_id}.vulnlab.local"
        }
        
    async def teardown_instance(self, instance_id: str) -> bool:
        # Cleanup logic
        print(f"Tearing down SQLi lab instance {instance_id}")
        return True

def get_lab_instance() -> BaseLab:
    return SQLiLab()
