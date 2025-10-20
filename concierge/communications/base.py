
from abc import ABC, abstractmethod


class Communications(ABC):
    """Base class for all message communications"""
    
    @abstractmethod
    def render(self, context: dict) -> str:
        """Render message with context data"""
        pass
    