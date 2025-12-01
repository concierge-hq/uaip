# Contributing to Concierge

Thank you for your interest in contributing to Concierge! This document provides guidelines for contributing to the project.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Agentic-Web-Interfaces/concierge.git
cd concierge
```

2. Install dependencies:
```bash
pip install -e .
```

3. Run tests:
```bash
pytest
```

## Code Style

### Formatting with Ruff

This project uses [Ruff](https://github.com/astral-sh/ruff) for code formatting and linting. Ruff is a fast Python linter and formatter written in Rust.

#### Installation

Install Ruff:
```bash
pip install ruff
```

For VS Code users, install the [Ruff extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff).

#### Configuration

Ruff configuration is in `pyproject.toml`:
- Line length: 120 characters
- Target Python version: 3.9+
- Enabled lints: pycodestyle, pyflakes, isort, flake8-bugbear, flake8-comprehensions

#### Format your code

```bash
# Format all files
ruff format .

# Check formatting without making changes
ruff format --check .

# Run linter
ruff check .

# Fix auto-fixable linting issues
ruff check --fix .
```

### EditorConfig

This project uses `.editorconfig` to maintain consistent coding styles. Most modern editors support EditorConfig either natively or through plugins.

Key settings:
- Indentation: 4 spaces
- Line endings: LF
- Charset: UTF-8
- Trailing whitespace: Not trimmed (Ruff handles this)

### VS Code Settings

If you use VS Code, the `.vscode/settings.json` file will:
- Enable format-on-save with Ruff
- Automatically organize imports on save

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** and ensure they're formatted:
   ```bash
   ruff format .
   ruff check --fix .
   git commit -m "feat: add support for X"
   ```

3. **Run tests** to ensure nothing is broken:
   ```bash
   pytest
   ```

4. **Push your branch** and create a pull request:
   ```bash
   git push -u origin feat/your-feature-name
   ```

5. **Link related issues** in your PR description using `Closes #issue-number`

## Commit Message Convention

We follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Testing

All new features should include tests. Place test files in the `tests/` directory.

## Questions?

Feel free to open an issue for any questions or concerns!
