# UAIP Protocol Specification

**Version:** 0.1.0  
**Status:** Draft

## Overview

The Universal Agent Interactive Protocol (UAIP) defines a standard interface for structured interactions between autonomous agents and application services. Unlike traditional tool-calling protocols, UAIP enforces execution order through explicit stages, workflows, and state management.

## Transport

UAIP uses HTTP as its transport layer.

| Property | Value |
|----------|-------|
| Protocol | HTTP/1.1 or HTTP/2 |
| Content-Type | `application/json` |
| Session Header | `X-Session-Id` |

## Types

### Workflow

A directed graph of stages with defined transitions.

```typescript
interface Workflow {
  name: string;
  description?: string;
  initial_stage: string;
  stages: Record<string, Stage>;
  transitions: Record<string, string[]>;
}
```

### Stage

A logical step containing callable tasks. Only tasks within the current stage are accessible.

```typescript
interface Stage {
  name: string;
  description?: string;
  tasks: Record<string, Task>;
  prerequisites?: string[];
}
```

### Task

A callable unit of business logic with typed parameters.

```typescript
interface Task {
  name: string;
  description: string;
  parameters: JSONSchema;
  returns?: JSONSchema;
}
```

### State

Persistent key-value store shared across stages within a session.

```typescript
interface State {
  get(key: string, default?: any): any;
  set(key: string, value: any): void;
}
```

### Session

A stateful interaction context bound to a workflow instance.

```typescript
interface Session {
  session_id: string;
  workflow: string;
  current_stage: string;
  state: State;
}
```

## Endpoints

### POST /initialize

Creates a new session for a workflow.

**Request:**
```json
{
  "workflow_name": "string"
}
```

**Response:**
```json
{
  "session_id": "string (uuid)",
  "workflow": "string",
  "initial_stage": "string",
  "stages": ["string"]
}
```

**Headers:**
- Response includes `X-Session-Id`

---

### POST /execute

Executes an action within an active session.

**Headers:**
- `X-Session-Id: <session_id>` (required)

**Request:**
```json
{
  "workflow_name": "string",
  "action": "method_call" | "stage_transition" | "state_input",
  ...action_params
}
```

#### Action: method_call

Invokes a task within the current stage.

```json
{
  "workflow_name": "store",
  "action": "method_call",
  "task": "add_to_cart",
  "args": {
    "product_id": "SKU-001",
    "quantity": 2
  }
}
```

#### Action: stage_transition

Transitions to a different stage. Must follow workflow's transition graph.

```json
{
  "workflow_name": "store",
  "action": "stage_transition",
  "stage": "checkout"
}
```

#### Action: state_input

Updates workflow state.

```json
{
  "workflow_name": "store",
  "action": "state_input",
  "state_updates": {
    "user.email": "user@example.com"
  }
}
```

---

### GET /api/workflows/{name}

Returns the schema for a registered workflow.

**Response:**
```json
{
  "name": "string",
  "description": "string",
  "initial_stage": "string",
  "stages": {
    "<stage_name>": {
      "name": "string",
      "description": "string",
      "tasks": {
        "<task_name>": {
          "name": "string",
          "description": "string",
          "parameters": {}
        }
      },
      "transitions": ["string"]
    }
  }
}
```

## Errors

All errors return a JSON object with a `detail` field.

```json
{
  "detail": "string"
}
```

| Status | Condition |
|--------|-----------|
| 400 | Missing or invalid request body |
| 400 | Missing `X-Session-Id` header on `/execute` |
| 404 | Workflow not found |
| 404 | Session not found |
| 422 | Invalid action type |
| 422 | Task not in current stage |
| 422 | Invalid stage transition |
