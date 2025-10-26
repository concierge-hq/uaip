"""Brief Presentation - minimal response with just result and current state."""
import json
import asyncio
from concierge.presentations.base import Presentation
from concierge.core.state_manager import get_state_manager


class BriefPresentation(Presentation):
    
    def render_text(self, orchestrator) -> str:
        """
        Render brief response with just the result and current state.
        
        Used for task calls and actions after handshake to save tokens.
        """
        current_stage = orchestrator.get_current_stage()
        
        lines = [
            self.content,
            "",
            f"Current stage: {current_stage.name}",
            f"State: {self._format_current_state(orchestrator)}",
            f"Available tasks: {self._format_available_tasks(current_stage)}",
            f"Available transitions: {self._format_available_transitions(current_stage)}",
        ]
        
        return "\n".join(lines)
    
    def _format_current_state(self, orchestrator) -> str:
        """
        Format current state variables.
        State is cached in orchestrator after each operation.
        """
        stage_state = getattr(orchestrator, 'current_stage_state', {})
        return json.dumps(stage_state)
    
    def _format_available_tasks(self, stage) -> str:
        """List available task names"""
        if not stage.tasks:
            return "none"
        return ", ".join(stage.tasks.keys())
    
    def _format_available_transitions(self, stage) -> str:
        """List available transition targets"""
        if not stage.transitions:
            return "none"
        return ", ".join(stage.transitions)

