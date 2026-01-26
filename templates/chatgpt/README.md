# concierge-app

ChatGPT widget app using Concierge with build system.

## Widgets

- **counter** — Interactive counter with +/- buttons
- **weather** — Weather card showing city and temperature
- **todo_list** — Todo list with checkboxes

## Setup

```bash
pip install -r requirements.txt
cd assets && npm install && cd ..
```

## Run locally

```bash
python main.py
```

On startup, Concierge runs `npm run build` in assets/ to compile widgets.
Server runs at http://0.0.0.0:8000/mcp

## Deploy

```bash
concierge deploy
```
