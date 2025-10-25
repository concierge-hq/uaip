"""Comprehensive Presentation - full context with stage, tools, state, etc."""
import json
from concierge.presentations.base import Presentation
from concierge.external.contracts import (
    ToolCall, 
    StageTransition,
    ACTION_METHOD_CALL,
    ACTION_STAGE_TRANSITION
)


class ComprehensivePresentation(Presentation):
    
    def render_text(self, orchestrator) -> str:
        """
        Render comprehensive response with full context.
        
        Fetches all metadata from orchestrator and formats it with the content.
        """
        workflow = orchestrator.workflow
        current_stage = orchestrator.get_current_stage()
        
        lines = [
            "=" * 80,
            "RESPONSE:",
            self.content,
            "",
            "=" * 80,
            "ADDITIONAL CONTEXT:",
            "",
            f"WORKFLOW: {workflow.name}",
            f"Description: {workflow.description}",
            "",
            "STRUCTURE:",
            self._format_stages_structure(workflow),
            "",
            f"CURRENT POSITION: {current_stage.name}",
            "",
            "CURRENT STATE:",
            self._format_current_state(current_stage),
            "",
            "YOU MAY CHOOSE THE FOLLOWING ACTIONS:",
            "",
            "1. ACTION CALLS (Tools):",
            self._format_tools(current_stage),
            "",
            "2. STAGE CALLS (Transitions):",
            self._format_transitions(current_stage),
            "",
            "You must ONLY respond with a single JSON object matching the schema below. Do not add comments or extra text.",
            "=" * 80,
        ]
        
        return "\n".join(lines)
    
    def _format_stages_structure(self, workflow) -> str:
        """Format the workflow stages structure"""
        stages_list = []
        for stage_name in workflow.stages.keys():
            stages_list.append(f"  - {stage_name}")
        return "\n".join(stages_list) if stages_list else "  (no stages)"
    
    def _format_current_state(self, stage) -> str:
        """Format current state variables"""
        state_data = dict(stage.local_state.data)
        if state_data:
            return json.dumps(state_data, indent=2)
        return "{}"
    
    def _format_tools(self, stage) -> str:
        """Format available tools with descriptions and call format"""
        if not stage.tools:
            return "  No tools available"
        
        tool_lines = []
        for tool_name, tool in stage.tools.items():
            tool_schema = tool.to_schema()
            tool_lines.append(f"  Tool: {tool_name}")
            tool_lines.append(f"    Description: {tool.description}")
            tool_lines.append(f"    Call Format:")
            
            example_call = ToolCall(
                action=ACTION_METHOD_CALL,
                tool=tool_name,
                args=self._generate_example_args(tool_schema["input_schema"])
            )
            tool_lines.append(f"      {json.dumps(example_call.model_dump(), indent=6)}")
            tool_lines.append("")
        
        return "\n".join(tool_lines)
    
    def _format_transitions(self, stage) -> str:
        """Format available transitions with exact JSON format"""
        if not stage.transitions:
            return "  No transitions available"
        
        transition_lines = []
        for target_stage in stage.transitions:
            transition_lines.append(f"  Transition to: {target_stage}")
            
            # Generate example using StageTransition contract
            transition_call = StageTransition(
                action=ACTION_STAGE_TRANSITION,
                stage=target_stage
            )
            transition_lines.append(f"    {json.dumps(transition_call.model_dump())}")
            transition_lines.append("")
        
        return "\n".join(transition_lines)
    
    def _generate_example_args(self, input_schema) -> dict:
        """Generate example arguments from input schema"""
        if not input_schema or "properties" not in input_schema:
            return {}
        
        example_args = {}
        for prop_name, prop_schema in input_schema.get("properties", {}).items():
            prop_type = prop_schema.get("type", "string")
            
            if prop_type == "string":
                example_args[prop_name] = f"<{prop_name}>"
            elif prop_type == "integer":
                example_args[prop_name] = 0
            elif prop_type == "number":
                example_args[prop_name] = 0.0
            elif prop_type == "boolean":
                example_args[prop_name] = True
            elif prop_type == "array":
                example_args[prop_name] = []
            elif prop_type == "object":
                example_args[prop_name] = {}
            else:
                example_args[prop_name] = f"<{prop_name}>"
        
        return example_args