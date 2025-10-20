"""Transition result communication."""
from concierge.communications.base import Communications
from concierge.communications.messages import TRANSITION_RESULT_MESSAGE
from concierge.core.results import TransitionResult
from concierge.core.stage import Stage
from concierge.core.workflow import Workflow
from concierge.core.state import State


class TransitionResultMessage(Communications):
    """Message after successful stage transition"""
    
    def render(self, result: TransitionResult, stage: Stage, workflow: Workflow, state: State) -> str:
        """Render transition result with new stage context"""
        from concierge.communications.stage import StageMessage
        
        stage_message = StageMessage().render(stage, workflow, state)
        
        return TRANSITION_RESULT_MESSAGE.format(
            from_stage=result.from_stage,
            to_stage=result.to_stage,
            stage_message=stage_message
        )

