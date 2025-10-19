"""
Tool: Represents a single executable action with state awareness.
"""
from typing import Dict, List, Callable, Tuple, Type, Any, Optional
from dataclasses import dataclass, field
import inspect

from concierge.core.state import State
from concierge.core.construct import is_construct
from concierge.core.constructs import DefaultConstruct


@dataclass
class Tool:
    """
    A tool represents a single action that can be performed.
    
    - Tools return their output as a dict (or an empty dict)
    - State management is handled by the stage/workflow
    - Optional output construct for validation
    """
    name: str
    description: str
    func: Callable
    output: Optional[Type] = None  # Optional @construct for output validation
    
    # Async support
    is_async: bool = field(default=False, init=False)
    output_schema: Optional[dict] = field(default=None, init=False)
    
    def __post_init__(self):
        """Detect if function is async and extract output schema"""
        self.is_async = inspect.iscoroutinefunction(self.func)
        
        # If no output specified, use DefaultConstruct
        if self.output is None:
            self.output = DefaultConstruct
        
        # Validate output is a construct
        if not is_construct(self.output):
            raise TypeError(
                f"Tool '{self.name}' output must be a @construct. "
                f"Apply @construct decorator to your Pydantic BaseModel."
            )
        
        # Extract output schema (but skip validation for DefaultConstruct)
        if self.output is not DefaultConstruct:
            self.output_schema = self.output.model_json_schema()
        else:
            self.output_schema = None
    
    async def execute(self, state: State, **kwargs) -> dict:
        """
        Execute the tool with given state and arguments.
        Returns the tool output as a dict (empty dict if None).
        """
        if self.is_async:
            result = await self.func(state, **kwargs)
        else:
            result = self.func(state, **kwargs)
        return result

    def to_schema(self) -> dict:
        """Convert tool to schema for LLM prompting"""
        # Extract parameter info from function signature
        sig = inspect.signature(self.func)
        params = {}
        
        for param_name, param in sig.parameters.items():
            if param_name not in ['self', 'state', 'ctx']:
                param_type = "any"
                if param.annotation != inspect.Parameter.empty:
                    param_type = param.annotation.__name__ if hasattr(param.annotation, '__name__') else str(param.annotation)
                
                params[param_name] = {
                    "type": param_type,
                    "required": param.default == inspect.Parameter.empty
                }
        
        return {
            "name": self.name,
            "description": self.description,
            "parameters": params
        }


# Decorator  
class tool:
    """
    Mark a method as a tool. Tool receives (ctx, state, **kwargs).
    
    Usage:
        @tool
        def simple_tool(state, x: int) -> dict:
            return {"result": x}
        
        @tool(output=MyConstruct)
        def typed_tool(state, x: int) -> dict:
            return {"field": "value"}
    """
    
    def __new__(cls, func_or_output=None, output: Optional[Type] = None):
        # Handle @tool(output=X) syntax
        if output is not None:
            instance = super().__new__(cls)
            instance.output = output
            return instance
        
        # Handle direct decoration: @tool
        elif callable(func_or_output):
            func_or_output._is_tool = True
            func_or_output._tool_output = None
            return func_or_output
        
        # Handle @tool() syntax (called with no args)
        else:
            instance = super().__new__(cls)
            instance.output = None
            return instance
    
    def __call__(self, func: Callable) -> Callable:
        # Called as @tool(output=X) or @tool()
        func._is_tool = True
        func._tool_output = self.output
        return func

