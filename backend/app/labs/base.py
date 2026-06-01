from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseLab(ABC):
    @property
    @abstractmethod
    def lab_id(self) -> str:
        """The unique identifier for this lab module"""
        pass
        
    @abstractmethod
    async def setup_instance(self, instance_id: str, user_id: str) -> Dict[str, Any]:
        """
        Logic to provision the lab environment (e.g., spin up Docker).
        Returns connection info.
        """
        pass
        
    @abstractmethod
    async def teardown_instance(self, instance_id: str) -> bool:
        """
        Cleanup logic to destroy the lab environment.
        """
        pass
