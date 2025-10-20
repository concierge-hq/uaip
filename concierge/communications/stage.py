"""Stage message communication."""
import json
from concierge.communications.base import Communications
from concierge.communications.messages import STAGE_MESSAGE
from concierge.core.stage import Stage
from concierge.core.workflow import Workflow
from concierge.core.state import State


class StageMessage(Communications):
    """Message for stage execution context"""
    
    def render(self, stage: Stage, workflow: Workflow, state: State) -> str:
        """Render stage message with available actions"""
        stage_index = list(workflow.stages.keys()).index(stage.name) + 1
        
        return STAGE_MESSAGE.format(
            workflow_name=workflow.name,
            current_stage=stage.name,
            stage_index=stage_index,
            total_stages=len(workflow.stages),
            stage_description=stage.description,
            available_tools=', '.join(t.name for t in stage.tools.values()),
            next_stages=', '.join(stage.transitions),
            previous_stages='', 
            state=json.dumps(state.data, indent=2)
        )

