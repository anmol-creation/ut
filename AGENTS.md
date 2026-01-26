# UT.ac Coding Guidelines

This document outlines the coding standards, architectural decisions, and development rules for UT.ac.

## Core Philosophy

1.  **Privacy First:** All tools must operate entirely client-side. No user data should be sent to any server. Use local APIs (Canvas, etc.) where possible.
2.  **Offline Capability:** Tools must be functional even without an internet connection once loaded.
3.  **Performance:** Optimize for weak networks. Use minimal dependencies and ensure fast load times.
4.  **No Frameworks:** The project uses plain HTML, CSS (Tailwind via CDN), and Vanilla JavaScript. Do not introduce frameworks like React, Vue, or Angular.

## Directory Structure

*   **Root:** Contains global files (`index.html`, `README.md`, `AGENTS.md`, etc.).
*   **tools/**: Each tool resides in its own subdirectory (e.g., `tools/grammar-checker/`).
    *   `index.html`: The tool's entry point.
    *   `logic/`: Contains pure JavaScript logic files.
    *   `ui/`: Contains UI-related scripts.
    *   `styles/`: Contains custom CSS if needed.
    *   `tests/`: Contains local tests.

## Coding Standards

*   **HTML:** Use semantic HTML5 elements. Ensure accessibility (ARIA labels, alt text).
*   **CSS:** Use Tailwind CSS utility classes. Avoid custom CSS unless absolutely necessary.
*   **JavaScript:**
    *   Use ES6+ features (const/let, arrow functions, modules).
    *   Keep functions pure and testable.
    *   Avoid inline JavaScript.
    *   Use `textContent` instead of `innerHTML` to prevent XSS.

## Contribution Workflow

1.  **Fork & Clone:** Fork the repository and clone it locally.
2.  **Create a Branch:** Create a new branch for your feature or fix.
3.  **Implement:** Write code following these guidelines.
4.  **Test:** verify your changes locally.
5.  **Submit:** Open a Pull Request with a clear description of your changes.

## Security

*   **Input Validation:** Validate all user inputs on the client side.
*   **Dependencies:** Review any external libraries for security vulnerabilities before including them.
