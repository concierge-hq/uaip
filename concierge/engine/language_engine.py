"""Language Engine: Parses JSON input and routes to orchestrator."""
from concierge.core.actions import MethodCallAction, StageTransitionAction
from concierge.core.results import Result, ToolResult, TransitionResult, ErrorResult
from concierge.engine.orchestrator import Orchestrator
from concierge.communications import (
    StageMessage,
    ToolResultMessage,
    TransitionResultMessage,
    ErrorMessage
)


class LanguageEngine:
    """
    Language engine that receives JSON input and routes to orchestrator.
    Handles parsing, execution, and message formatting.
    """
    
    def __init__(self, orchestrator: Orchestrator):
        self.orchestrator = orchestrator
    
    async def process(self, llm_json: dict) -> str:
        """
        Process LLM JSON input and return formatted message.
        
        Expected formats:
        - {"action": "method_call", "tool": "tool_name", "args": {...}}
        - {"action": "stage_transition", "stage": "stage_name"}
        """
        action_type = llm_json.get("action")
        
        if action_type == "method_call":
            action = MethodCallAction(
                tool_name=llm_json["tool"],
                args=llm_json.get("args", {})
            )
            result = await self.orchestrator.execute_method_call(action)
            if isinstance(result, ToolResult):
                return self._format_tool_result(result)
            return self._format_error_result(result)
        
        elif action_type == "stage_transition":
            action = StageTransitionAction(
                target_stage=llm_json["stage"]
            )
            result = await self.orchestrator.execute_stage_transition(action)
            if isinstance(result, TransitionResult):
                return self._format_transition_result(result)
            return self._format_error_result(result)
        
        else:
            return self._format_error_result(ErrorResult(message=f"Unknown action type: {action_type}"))
    
    def _format_tool_result(self, result: ToolResult) -> str:
        """Format tool execution result with current stage context"""
        stage = self.orchestrator.get_current_stage()
        workflow = self.orchestrator.workflow
        state = stage.local_state

        return ToolResultMessage().render(result, stage, workflow, state)
    
    def _format_transition_result(self, result: TransitionResult) -> str:
        """Format transition result with new stage context"""
        stage = self.orchestrator.get_current_stage()
        workflow = self.orchestrator.workflow
        state = stage.local_state
        
        return TransitionResultMessage().render(result, stage, workflow, state)
    
    def _format_error_result(self, result: ErrorResult) -> str:
        """Format error message"""
        return ErrorMessage().render(result)

