"""Error communication."""
from concierge.communications.base import Communications
from concierge.communications.messages import ERROR_MESSAGE
from concierge.core.results import ErrorResult


class ErrorMessage(Communications):
    """Message for errors"""
    
    def render(self, result: ErrorResult) -> str:
        """Render error message"""
        error_context = []
        
        if result.allowed:
            error_context.append(f"Allowed options: {', '.join(result.allowed)}")
        
        return ERROR_MESSAGE.format(
            message=result.message,
            context='\n'.join(error_context) if error_context else ""
        )

