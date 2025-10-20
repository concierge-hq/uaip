"""Tool result communication."""
import json
from concierge.communications.base import Communications
from concierge.communications.messages import TOOL_RESULT_MESSAGE
from concierge.core.results import ToolResult
from concierge.core.stage import Stage
from concierge.core.workflow import Workflow
from concierge.core.state import State


class ToolResultMessage(Communications):
    """Message after tool execution"""
    
    def render(self, result: ToolResult, stage: Stage, workflow: Workflow, state: State) -> str:
        """Render tool result with stage context"""
        from concierge.communications.stage import StageMessage
        
        result_str = json.dumps(result.result, indent=2) if isinstance(result.result, dict) else str(result.result)
        stage_message = StageMessage().render(stage, workflow, state)
        
        return TOOL_RESULT_MESSAGE.format(
            tool_name=result.tool_name,
            result=result_str,
            stage_message=stage_message
        )

