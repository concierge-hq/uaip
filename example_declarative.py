"""
Example of declarative @stage pattern with @tool methods.
"""
from concierge.core import stage, tool, Context, State

# Define a declarative stage
@stage(name="calculator")
class Calculator:
    """Perform mathematical calculations"""
    
    @tool
    def add(self, ctx: Context, state: State, a: int, b: int):
        """Add two numbers"""
        # ctx.global_state = global workflow state
        # state = local stage state
        result = a + b
        return state.set("result", result)
    
    @tool
    def multiply(self, ctx: Context, state: State, a: int, b: int):
        """Multiply two numbers"""
        result = a * b
        return state.set("result", result)


# Access the stage metadata
print(f"Stage name: {Calculator._stage.name}")
print(f"Stage description: {Calculator._stage.description}")
print(f"Tools: {list(Calculator._stage.tools.keys())}")

# Cannot instantiate
try:
    calc = Calculator()
except TypeError as e:
    print(f"\n✓ Prevented instantiation: {e}")

# Use the stage
stage_obj = Calculator._stage
print(f"\n✓ Stage has {len(stage_obj.tools)} tools")

