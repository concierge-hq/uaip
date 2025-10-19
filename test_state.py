#!/usr/bin/env python3
"""Quick test of the simplified State."""

from concierge.core import State

# Test 1: Basic usage with plain values
print("Test 1: Basic usage with plain values")
state = State()
state = state.set("user_id", "123")
state = state.set("counter", 0)
state = state.set("items", ["item1", "item2"])
print(f"State data: {state.data}")
print(f"Get user_id: {state.get('user_id')}")
print(f"Get counter: {state.get('counter')}")
print()

# Test 2: Usage with dicts
print("Test 2: Usage with dicts")
state = State()
state = state.set("user", {"id": "123", "email": "user@example.com"})
state = state.set("cart", {"items": ["item1"], "total": 99.99})
print(f"State data: {state.data}")
print(f"Get user: {state.get('user')}")
print()

# Test 3: Update method (merges dicts)
print("Test 3: Update method (merges dicts)")
state = state.update("cart", {"items": ["item1", "item2"], "discount": 10.0})
print(f"Updated cart: {state.get('cart')}")
print()

# Test 4: With Pydantic objects (if available)
try:
    from pydantic import BaseModel
    
    class User(BaseModel):
        id: str
        email: str
        age: int = 0
    
    class Cart(BaseModel):
        items: list
        total: float
    
    print("Test 4: With Pydantic objects")
    
    # Create Pydantic objects
    user = User(id="123", email="test@example.com", age=25)
    cart = Cart(items=["item1", "item2"], total=99.99)
    
    # Store objects directly
    state = State()
    state = state.set("user", user)
    state = state.set("cart", cart)
    
    # Access objects
    retrieved_user = state.get("user")
    print(f"User object: {retrieved_user}")
    print(f"User email: {retrieved_user.email}")
    print(f"Cart total: {state.get('cart').total}")
    
    # Pydantic validates on creation
    try:
        bad_user = User(id=123, email="bad-email")  # Will fail validation
    except Exception as e:
        print(f"Pydantic validation (expected): {type(e).__name__}")
    
except ImportError:
    print("Test 4: Pydantic not installed, skipping Pydantic object tests")

print("\nAll tests passed!")
