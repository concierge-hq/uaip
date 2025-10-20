"""Message templates - pure strings with placeholders."""

HANDSHAKE_MESSAGE = """Welcome to {app_name} powered by Concierge.
{app_description}

Available workflows ({workflow_count}):
{workflows_list}

What would you like to do?
Respond with JSON:
{{
  "action": "select_workflow",
  "workflow_id": "workflow_name"
}}"""


STAGE_MESSAGE = """Workflow: {workflow_name}
Stage: {current_stage} (step {stage_index} of {total_stages})
Description: {stage_description}

Available tools: {available_tools}
Next stages: {next_stages}
Previous stages: {previous_stages}

Current state:
{state}

What would you like to do?
1. Call a tool: {{"action": "method_call", "tool": "tool_name", "args": {{...}}}}
2. Transition: {{"action": "stage_transition", "stage": "stage_name"}}"""


TRANSITION_RESULT_MESSAGE = """Successfully transitioned from '{from_stage}' to '{to_stage}'.

{stage_message}"""


TOOL_RESULT_MESSAGE = """Tool '{tool_name}' executed successfully.

Result:
{result}

{stage_message}"""


ERROR_MESSAGE = """Error: {message}

{context}"""

