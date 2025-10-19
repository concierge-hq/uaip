"""
State management for Concierge.
Simple immutable dictionary that can store any objects.
"""
from typing import Dict, Any, Optional, List
from copy import deepcopy
import json


class State:
    """
    Immutable state container.
    Store any Python objects - Pydantic models, dataclasses, plain values, dicts, etc.
    
    Example with plain values:
        state = State()
        state = state.set("user_id", "123")
        state = state.set("counter", 0)
        state = state.set("items", ["item1", "item2"])
    
    Example with Pydantic objects:
        from pydantic import BaseModel
        
        class User(BaseModel):
            id: str
            email: str
        
        class Cart(BaseModel):
            items: list
            total: float
        
        user = User(id="123", email="test@example.com")
        cart = Cart(items=["item1"], total=99.99)
        
        state = State()
        state = state.set("user", user)      
        state = state.set("cart", cart)      
        
        # Access
        user = state.get("user")
        print(user.email)  # "test@example.com"
    
    Example with mixed types:
        state = State()
        state = state.set("user", User(id="123", email="test@example.com"))  # Object
        state = state.set("counter", 0)                                       # Int
        state = state.set("config", {"debug": True, "timeout": 30})          # Dict
    """
    
    def __init__(self, data: Optional[Dict[str, Any]] = None):
        """
        Initialize state.
        Args:
            data: Initial state data (dict of key -> any value/object)
        """
        self._data = data or {}
        self._version = 0
    
    @property
    def data(self) -> Dict[str, Any]:
        """Get copy of state data"""
        return deepcopy(self._data)
    
    def set(self, key: str, value: Any) -> 'State':
        """
        Set key to value (replaces).
        Accepts any Python object - Pydantic models, plain values, dicts, etc.
        """
        new_data = deepcopy(self._data)
        new_data[key] = value
        
        new_state = State(new_data)
        new_state._version = self._version + 1
        return new_state
    
    def update(self, key: str, value: Any) -> 'State':
        """
        Update key with value.
        For dicts: merges with existing dict.
        For other types: replaces value.
        """
        current = self.get(key, {})
        if isinstance(current, dict) and isinstance(value, dict):
            merged = {**current, **value}
            return self.set(key, merged)
        return self.set(key, value)
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get value by key"""
        return self._data.get(key, default)
    
    def has(self, key: str) -> bool:
        """Check if key exists"""
        return key in self._data
    
    def delete(self, key: str) -> 'State':
        """Remove key from state"""
        new_data = {k: v for k, v in self._data.items() if k != key}
        return State(new_data)
    
    def append(self, key: str, value: Any) -> 'State':
        """Append to list at key"""
        current = self.get(key, [])
        return self.set(key, current + [value])
    
    def increment(self, key: str, amount: float = 1) -> 'State':
        """Increment numeric value"""
        current = self.get(key, 0)
        return self.set(key, current + amount)
    
    def merge(self, other: 'State') -> 'State':
        """Merge another state into this one"""
        new_data = deepcopy(self._data)
        new_data.update(other._data)
        new_state = State(new_data)
        new_state._version = max(self._version, other._version) + 1
        return new_state
    
    def subset(self, keys: List[str]) -> 'State':
        """Create new state with only specified keys"""
        new_data = {k: self._data[k] for k in keys if k in self._data}
        return State(new_data)
    
    def to_dict(self) -> dict:
        """Convert to plain dict"""
        return deepcopy(self._data)
    
    def to_json(self) -> str:
        """Convert to JSON string"""
        return json.dumps(self._data, indent=2)
    
    @classmethod
    def from_dict(cls, data: dict) -> 'State':
        """Create state from dict"""
        return cls(data)
    
    @classmethod
    def from_json(cls, json_str: str) -> 'State':
        """Create state from JSON"""
        return cls(json.loads(json_str))
    
    def __repr__(self) -> str:
        keys = list(self._data.keys())
        return f"State(keys={keys}, version={self._version})"
    
    def __eq__(self, other: Any) -> bool:
        return isinstance(other, State) and self._data == other._data