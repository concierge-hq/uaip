"""
Simplified Concierge example - no primitives needed!
Just use Python naturally.
"""
import asyncio
from concierge.core.state import State
from concierge.core.workflow import Workflow, Stage, Tool, WorkflowSession


# ============================================
# Option 1: Simplest approach - just functions
# ============================================

@tool("search", writes=["search_results"])
def search_products(state: State, query: str) -> State:
    """Search for products in the catalog"""
    # Your actual business logic here
    results = [
        {"id": 1, "name": f"Item matching '{query}'", "price": 99.99},
        {"id": 2, "name": f"Another '{query}' item", "price": 149.99}
    ]
    return state.set("search_results", results)


@tool("add_to_cart", reads=["cart"], writes=["cart"])
def add_to_cart(state: State, item_id: int) -> State:
    """Add item to shopping cart"""
    cart = state.get("cart", [])
    cart.append(item_id)
    return state.set("cart", cart)


@tool("checkout", requires=["user_id", "cart"])
async def process_checkout(state: State) -> tuple[dict, State]:
    """Process the checkout"""
    cart = state.get("cart", [])
    total = len(cart) * 50  # Simple calculation
    
    # Simulate async payment processing
    await asyncio.sleep(0.5)
    
    order = {
        "id": "ORD123",
        "items": cart,
        "total": total,
        "status": "confirmed"
    }
    
    # Return result and new state
    return order, state.set("last_order", order).set("cart", [])


# ============================================
# Build workflow - super simple!
# ============================================

def build_simple_workflow() -> Workflow:
    """Build a simple shopping workflow"""
    
    workflow = Workflow("shopping")
    
    # Browse stage
    browse = Stage("browse", "Browse and search products")
    browse.add_tool(search_products)
    browse.add_tool(add_to_cart)
    browse.transitions = ["checkout"]
    
    # Checkout stage
    checkout = Stage("checkout", "Complete your order")
    checkout.add_tool(process_checkout)
    checkout.prerequisites = ["cart"]  # Must have items in cart
    checkout.transitions = ["browse"]  # Go back to shopping
    
    workflow.add_stage(browse, initial=True)
    workflow.add_stage(checkout)
    
    return workflow


# ============================================
# Option 2: Using classes with decorators
# ============================================

from dataclasses import dataclass
from typing import List

# You can use regular Python classes/dataclasses for state shape
@dataclass
class User:
    id: str
    email: str
    name: str = "Anonymous"

@dataclass
class CartItem:
    product_id: int
    quantity: int
    price: float


def build_advanced_workflow() -> Workflow:
    """
    Example with Python dataclasses for structure.
    But State still just stores dicts - no enforcement!
    """
    workflow = Workflow("advanced_shopping")
    
    # You can organize tools in classes if you want
    class ShoppingTools:
        @tool("login")
        def login(state: State, email: str, password: str) -> State:
            """User login"""
            # In real app, check password
            user = User(id="123", email=email, name="John")
            # Convert to dict for state (or use Pydantic for auto-conversion)
            return state.set("user", {
                "id": user.id,
                "email": user.email,
                "name": user.name
            })
        
        @tool("add_item", writes=["cart.items", "cart.total"])
        def add_item(state: State, product_id: int, quantity: int = 1) -> State:
            """Add item with quantity"""
            items = state.get("cart.items", [])
            items.append({
                "product_id": product_id,
                "quantity": quantity,
                "price": 29.99  # Would fetch from DB
            })
            
            total = sum(item["price"] * item["quantity"] for item in items)
            
            return state.update("cart", {
                "items": items,
                "total": total
            })
    
    tools = ShoppingTools()
    
    browse = Stage("browse")
    browse.add_tool(tools.login)
    browse.add_tool(tools.add_item)
    browse.transitions = ["checkout"]
    
    workflow.add_stage(browse, initial=True)
    
    return workflow


# ============================================
# Option 3: Even simpler with lambdas
# ============================================

def build_minimal_workflow() -> Workflow:
    """Ultra-minimal example"""
    w = Workflow("minimal")
    
    # Define everything inline
    browse = Stage("browse")
    browse.tools["greet"] = tool("greet")(
        lambda state, name: state.set("greeting", f"Hello {name}!")
    )
    browse.tools["count"] = tool("count")(
        lambda state: state.increment("counter")
    )
    
    w.add_stage(browse)
    return w


# ============================================
# Run examples
# ============================================

async def main():
    print("=== Concierge Simplified Examples ===\n")
    
    # Example 1: Simple workflow
    print("1. Simple Shopping Workflow")
    print("-" * 40)
    
    workflow = build_simple_workflow()
    session = workflow.create_session()
    
    # Set initial state (no primitives needed!)
    session.state = session.state.set("user_id", "user123")
    
    # Search for products
    result = await session.execute_tool("search", {"query": "laptop"})
    print(f"Search result: {result}")
    
    # Add to cart
    result = await session.execute_tool("add_to_cart", {"item_id": 1})
    print(f"Add to cart: {result}")
    
    # Check state
    print(f"Cart contents: {session.state.get('cart')}")
    
    # Transition to checkout
    result = session.transition_to("checkout")
    print(f"Transition: {result}")
    
    # Process checkout
    result = await session.execute_tool("checkout")
    print(f"Checkout: {result}")
    
    # Example 2: Advanced with dataclasses
    print("\n2. Advanced Workflow with Dataclasses")
    print("-" * 40)
    
    workflow = build_advanced_workflow()
    session = workflow.create_session()
    
    # Login
    result = await session.execute_tool("login", {
        "email": "user@example.com",
        "password": "secret"
    })
    print(f"Login: {result}")
    print(f"User: {session.state.get('user')}")
    
    # Add items
    result = await session.execute_tool("add_item", {
        "product_id": 42,
        "quantity": 2
    })
    print(f"Added item: {result}")
    print(f"Cart state: {session.state.get('cart')}")
    
    # Example 3: Minimal
    print("\n3. Minimal Example")
    print("-" * 40)
    
    workflow = build_minimal_workflow()
    session = workflow.create_session()
    
    result = await session.execute_tool("greet", {"name": "World"})
    print(f"Greeting: {session.state.get('greeting')}")
    
    for i in range(3):
        await session.execute_tool("count")
    print(f"Counter: {session.state.get('counter')}")
    
    # Show generated prompt
    print("\n4. Generated LLM Prompt")
    print("-" * 40)
    stage = session.get_stage()
    print(stage.generate_prompt(session.state))


if __name__ == "__main__":
    asyncio.run(main())
