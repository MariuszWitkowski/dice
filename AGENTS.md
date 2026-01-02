# Agent Instructions

This document provides instructions for AI agents working with this codebase.

## Technology Stack

- **Runner:** Bun
- **Bundler:** Vite
- **Test Runner:** Vitest
- **Linter/Formatter:** Oxc

## Development Workflow

### Installation
To install dependencies, run:
```bash
bun install
```

### Available Scripts
- `bun dev`: Starts the development server.
- `bun build`: Builds the project for production.
- `bun test`: Runs the tests.
- `bun lint`: Lints the code.
- `bun format`: Formats the code.

**Note:** When running tests, use `bun run test` to ensure it runs once and exits, avoiding watch mode.

## CI/CD

This project uses GitHub Actions for CI/CD.

-   **CI:** On every pull request to `main`, the CI workflow will run the linter and tests.
-   **CD:** On every push to `main`, the CD workflow will build the project and deploy it to GitHub Pages.

## Versioning

This project uses semantic versioning. On every pull request, the version number in `package.json` and `index.html` must be updated according to the changes made.
