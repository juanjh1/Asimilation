# Asimilation

**Asimilation** is a personal backend framework that gathers all my backend knowledge. It is inspired by frameworks from the Python ecosystem, such as Django and Flask, and adapts their concepts to Node.js. Although it started in JavaScript, the project has been **migrated to TypeScript** for better maintainability and type safety. The structure and patterns may not always follow typical JS conventions, as the design is heavily influenced by Pythonic backend philosophies.

> **Status:** 🚧 This project is under active development and may not work properly yet. Expect bugs and incomplete features.

## ✨ Features

- **Custom Routing System:** Inspired by Django, with a `Paths` class to manage URL patterns and their associated views.
- **HTTP Server:** Built on Node.js’s native `http` module for full control and educational purpose.
- **Status Logging:** Color-coded HTTP status logging for easy debugging and monitoring.
- **Middleware System:** Includes a **chained middleware system** similar to Express.js, allowing request flow control and extension.
- **Modular Structure:** Clear separation of concerns (routing, views, utilities, middleware).
- **TypeScript Migration:** The entire project has been migrated to **TypeScript**, improving scalability, type inference, and editor support.
- **Educational Purpose:** Code is commented and organized for learning and future expansion.

## 📁 Project Structure

C:.
│   .gitignore
│   package.json
│   readme.md
│   tsconfig.json
│
│
└───src
        main.ts
        middelware-manager-interface.ts
        middelware-manager.ts
        middelwares.ts
        router-manager.ts
        run.ts
        urls.ts
        utils.ts

## 🚀 Getting Started
1. **Install Node.js** (v18+ recommended)
2. Clone this repository
3. Run the server:
   ```bash
   npx tsx run.ts
   ```