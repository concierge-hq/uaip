from concierge.serving.api import app, initialize_api
from concierge.serving.manager import SessionManager
from concierge.core.registry import get_registry

# Import workflows (auto-registers)
import examples.simple_stock
import examples.zillow.workflow

if __name__ == "__main__":
    registry = get_registry()
    workflows = registry.list_workflows()
        
    session_managers = {
        w.name: SessionManager(registry.get_workflow(w.name))
        for w in workflows
    }
    
    initialize_api(session_managers, tracker=None)
    
    print(f"   Listening: http://localhost:8082")
    print(f"   UI APIs: /api/workflows, /api/statistics")
    print(f"   LLM API: POST /execute")
    print()
    
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8082)

