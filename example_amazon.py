"""
Example: Building Amazon shopping workflow with Concierge.
Shows how stages, tools, and state management work together.
"""
import asyncio
from concierge.core import State, Tool, Stage, Workflow, WorkflowSession


# ============================================
# Define custom constructs for this workflow
# ============================================

def SearchConstruct():
    """Search state within browse stage"""
    return Construct(
        name="search",
        primitives={
            "query": String("query", description="Search query"),
            "filters": Dict("filters", description="Active filters"),
            "results": List("results", description="Search results"),
            "selected_category": String("selected_category", description="Selected category")
        },
        description="Search and filter state",
        scope="local"  # Local to browse stage
    )


def CheckoutConstruct():
    """Checkout information"""
    return Construct(
        name="checkout",
        primitives={
            "payment_method": String("payment_method", required=True, 
                                    choices=["credit_card", "debit_card", "paypal"]),
            "shipping_address": String("shipping_address", required=True),
            "order_total": Float("order_total", min_value=0),
            "order_id": String("order_id")
        },
        description="Checkout information",
        scope="local"  # Local to checkout stage
    )


# ============================================
# Define tools (business logic)
# ============================================

def create_search_tool():
    """Tool for searching products"""
    def search_products(state: State, query: str, category: str = None) -> tuple:
        """Search for products"""
        # Simulate database search
        results = [
            {"id": "1", "name": f"Laptop matching '{query}'", "price": 999.99},
            {"id": "2", "name": f"Phone matching '{query}'", "price": 599.99},
            {"id": "3", "name": f"Tablet matching '{query}'", "price": 399.99}
        ]
        
        # Return result and state updates
        return results, {
            "state_updates": {
                "search.query": query,
                "search.results": results,
                "search.selected_category": category
            }
        }
    
    return Tool(
        name="search",
        description="Search for products",
        func=search_products,
        reads=["search.query", "search.filters"],
        writes=["search.query", "search.results", "search.selected_category"]
    )


def create_add_to_cart_tool():
    """Tool for adding items to cart"""
    def add_to_cart(state: State, item_id: str, quantity: int = 1) -> tuple:
        """Add item to cart"""
        # Get current cart
        cart_items = state.get("cart", "items", [])
        cart_total = state.get("cart", "total", 0.0)
        
        # Find item from search results
        search_results = state.get("search", "results", [])
        item = next((r for r in search_results if r["id"] == item_id), None)
        
        if not item:
            return {"error": "Item not found"}, {}
        
        # Add to cart
        cart_items.append({
            "id": item_id,
            "name": item["name"],
            "price": item["price"],
            "quantity": quantity
        })
        cart_total += item["price"] * quantity
        
        return {"added": item["name"]}, {
            "state_updates": {
                "cart.items": cart_items,
                "cart.total": cart_total,
                "cart.count": len(cart_items)
            }
        }
    
    return Tool(
        name="add_to_cart",
        description="Add item to shopping cart",
        func=add_to_cart,
        reads=["search.results", "cart.items", "cart.total"],
        writes=["cart.items", "cart.total", "cart.count"]
    )


async def process_payment_async(state: State, payment_method: str) -> dict:
    """Async payment processing"""
    # Simulate async payment gateway call
    await asyncio.sleep(1)
    
    total = state.get("cart", "total", 0)
    order_id = f"ORD-{int(total)}-{payment_method[:3].upper()}"
    
    return {
        "success": True,
        "order_id": order_id,
        "amount_charged": total,
        "state_updates": {
            "checkout.order_id": order_id,
            "checkout.order_total": total,
            "cart.items": [],  # Clear cart after purchase
            "cart.total": 0,
            "cart.count": 0
        }
    }


def create_checkout_tool():
    """Tool for processing checkout"""
    return Tool(
        name="process_payment",
        description="Process payment and complete order",
        func=process_payment_async,
        reads=["cart.total", "checkout.payment_method", "checkout.shipping_address"],
        writes=["checkout.order_id", "checkout.order_total", "cart.items", "cart.total"],
        requires=["checkout.payment_method", "checkout.shipping_address", "user.id"]
    )


# ============================================
# Build the workflow
# ============================================

def build_amazon_workflow() -> Workflow:
    """Build complete Amazon shopping workflow"""
    
    # Create workflow
    workflow = Workflow(
        name="amazon_shopping",
        description="Complete shopping experience with browse, cart, and checkout"
    )
    
    # Add global constructs
    workflow.add_global_construct(UserConstruct())
    workflow.add_global_construct(CartConstruct())
    
    # ========== Browse Stage ==========
    browse_stage = Stage(
        name="browse",
        description="Browse and search for products",
        transitions=["cart_review", "checkout"],
        prerequisites=[]  # No prerequisites to start browsing
    )
    
    # Add local constructs
    browse_stage.add_construct(SearchConstruct())
    
    # Add tools
    browse_stage.add_tool(create_search_tool())
    browse_stage.add_tool(create_add_to_cart_tool())
    
    # ========== Cart Review Stage ==========
    cart_stage = Stage(
        name="cart_review",
        description="Review and modify cart",
        transitions=["browse", "checkout"],
        prerequisites=["cart.items"]  # Need items in cart
    )
    
    # Tool to remove from cart
    def remove_from_cart(state: State, item_id: str) -> tuple:
        cart_items = state.get("cart", "items", [])
        cart_items = [item for item in cart_items if item["id"] != item_id]
        
        new_total = sum(item["price"] * item["quantity"] for item in cart_items)
        
        return {"removed": item_id}, {
            "state_updates": {
                "cart.items": cart_items,
                "cart.total": new_total,
                "cart.count": len(cart_items)
            }
        }
    
    cart_stage.add_tool(Tool(
        name="remove_item",
        description="Remove item from cart",
        func=remove_from_cart,
        reads=["cart.items"],
        writes=["cart.items", "cart.total", "cart.count"]
    ))
    
    # ========== Checkout Stage ==========
    checkout_stage = Stage(
        name="checkout", 
        description="Complete purchase",
        transitions=["order_confirmation"],
        prerequisites=["user.id", "cart.items"]  # Need user and items
    )
    
    checkout_stage.add_construct(CheckoutConstruct())
    checkout_stage.add_tool(create_checkout_tool())
    
    # ========== Order Confirmation Stage ==========
    confirmation_stage = Stage(
        name="order_confirmation",
        description="Order completed successfully",
        transitions=["browse"],  # Can start shopping again
        prerequisites=["checkout.order_id"]
    )
    
    # Add all stages to workflow
    workflow.add_stage(browse_stage, initial=True)
    workflow.add_stage(cart_stage)
    workflow.add_stage(checkout_stage)
    workflow.add_stage(confirmation_stage)
    
    return workflow


# ============================================
# Example usage
# ============================================

async def simulate_shopping_session():
    """Simulate a shopping session with the workflow"""
    
    # Create workflow and session
    workflow = build_amazon_workflow()
    session = workflow.create_session()
    
    print(f"Created session: {session.session_id}")
    print(f"Starting in stage: {session.current_stage}\n")
    
    # Simulate user login
    print("1. Simulating user login...")
    session.state = session.state.update("user", {
        "id": "user123",
        "email": "user@example.com",
        "name": "John Doe"
    })
    
    # Get current stage and show prompt
    stage = session.get_current_stage()
    print("\nGenerated prompt for LLM:")
    print("-" * 50)
    print(stage.generate_prompt(session.state))
    print("-" * 50)
    
    # Simulate LLM actions
    print("\n2. Searching for laptops...")
    result = await session.process_action({
        "action": "tool",
        "tool": "search",
        "args": {"query": "gaming laptop", "category": "electronics"}
    })
    print(f"Result: {result}")
    
    print("\n3. Adding item to cart...")
    result = await session.process_action({
        "action": "tool",
        "tool": "add_to_cart",
        "args": {"item_id": "1", "quantity": 1}
    })
    print(f"Result: {result}")
    
    print("\n4. Transitioning to checkout...")
    result = await session.process_action({
        "action": "transition",
        "stage": "checkout"
    })
    
    # Check what's missing
    if result["type"] == "elicit_required":
        print(f"Missing required fields: {result['missing']}")
        
        # Provide missing fields
        print("\n5. Providing checkout information...")
        session.state = session.state.update("checkout", {
            "payment_method": "credit_card",
            "shipping_address": "123 Main St, City, State 12345"
        })
        
        # Try transition again
        result = await session.process_action({
            "action": "transition",
            "stage": "checkout"
        })
    
    print(f"Result: {result['type']}")
    
    # Process payment
    print("\n6. Processing payment...")
    result = await session.process_action({
        "action": "tool",
        "tool": "process_payment",
        "args": {"payment_method": "credit_card"}
    })
    print(f"Result: {result}")
    
    # Show final state
    print("\n7. Final session state:")
    print("-" * 50)
    info = session.get_session_info()
    for key, value in info.items():
        print(f"{key}: {value}")
    
    print("\n8. State data:")
    for construct_name, construct_data in session.state.data.items():
        if construct_data:
            print(f"{construct_name}: {construct_data}")


if __name__ == "__main__":
    # Run the example
    asyncio.run(simulate_shopping_session())
