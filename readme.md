# Asimilation

**Asimilation** is a personal backend framework that gathers all my backend knowledge. It is inspired by frameworks from the Python ecosystem, such as Django and Flask, and adapts their concepts to Node.js. Please note that, although written in JavaScript, the structure and patterns may not always follow typical JS conventions, as the design is heavily influenced by Python backend frameworks.

> **Status:** 🚧 This project is in active development and may not work properly yet. Expect bugs and incomplete features.

## Features

- **Custom Routing System:** Inspired by Django, with a `Paths` class to manage URL patterns and their associated views.
- **HTTP Server:** Built on Node.js's native `http` module for full control and learning.
- **Status Logging:** Color-coded HTTP status logging for easy debugging and monitoring.
- **Modular Structure:** Clear separation of concerns (routing, views, utilities).
- **Educational Purpose:** Code is commented and structured for learning and future expansion.

## Project Structure

```
Portafolio/
├── main.js         # Main server logic
├── paths.js        # Routing system
├── run.js          # Entry point to start the server
├── utils.js        # Utility functions (logging, helpers)
├── views.js        # Views (handlers for each route)
```

## Getting Started

1. **Install Node.js** (v18+ recommended).
2. Clone this repository.
3. Run the server:
   ```bash
   node run.js
   ```
4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

- Define your routes and views in `paths.js` and `views.js`.
- The server listens for HTTP requests and matches the URL to a registered route.
- If found, it executes the associated view function and returns a JSON response.
- All requests and responses are logged with color-coded status codes for clarity.

## Why Asimilation?

This project is a living document of my backend journey, as I "assimilate" new concepts and best practices. It's designed to be simple, hackable, and a foundation for future backend experiments.

---

Feel free to explore,