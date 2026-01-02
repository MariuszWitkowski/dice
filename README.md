# Dice Project

This project is a modern TypeScript and JavaScript setup using:

- **Runner:** Bun
- **Bundler:** Vite
- **Test Runner:** Vitest
- **Linter/Formatter:** Oxc

## Getting Started

1.  **Install Bun:** Follow the instructions on the [official Bun website](https://bun.sh/).
2.  **Install dependencies:**
    ```bash
    bun install
    ```

## Available Scripts

-   `bun dev`: Starts the development server.
-   `bun build`: Builds the project for production.
-   `bun test`: Runs the tests.
-   `bun lint`: Lints the code.
-   `bun format`: Formats the code.

## CI/CD

This project uses GitHub Actions for CI/CD.

-   **CI:** On every pull request to `main`, the CI workflow will run the linter and tests.
-   **CD:** On every push to `main`, the CD workflow will build the project and deploy it to GitHub Pages.

## Versioning

This project uses semantic versioning. On every pull request, the version number in `package.json` and `index.html` should be updated according to the changes made.
