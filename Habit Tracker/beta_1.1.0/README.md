# Habit Tracker Developer Documentation

This repository contains an offline-first habit tracker built as a static web app. It is intended for quick setup, local development, and deployment to any static web host.

## Overview

- **Project type:** Static web application
- **Stack:** HTML, CSS, vanilla JavaScript
- **Browser APIs:** `localStorage`, service worker caching
- **PWA support:** `manifest.json` + `sw.js`
- **Runtime:** client-side only, no backend required

## Tech stack

- `index.html` — application HTML shell and SVG icon assets
- `styles.css` — app styling, responsive layout, theme support
- `app.js` — core habit tracker logic, state management, DOM rendering, export/import, settings
- `sw.js` — service worker for offline caching
- `manifest.json` — Progressive Web App metadata and icons
- `logo.svg`, `logo-192.png`, `logo-512.png` — PWA and favicon assets

## Prerequisites

- Modern browser with JavaScript enabled
- Optional for local dev:
  - `python3` (for simple static server)
  - `npm` / `http-server` or any static file server if preferred

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd "Habit Tracker/beta_1.1.0"
   ```

2. Inspect the file structure and verify the key files exist:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `sw.js`
   - `manifest.json`

No build pipeline is required for this app.

## Local development

### Option 1: Open directly in the browser

Open `index.html` in a modern browser. This is enough for manual testing, but using a local server is recommended when testing the service worker or PWA features.

### Option 2: Start a local HTTP server

From the repository root:

```bash
python3 -m http.server 8080
```

Then open:

```
http://localhost:8080/index.html
```

### Option 3: Use the provided launch script (Linux)

```bash
./LaunchApp_Linux.sh
```

For macOS and Windows, use `LaunchApp_Mac.command` or `LaunchApp_Windows.bat`.

## Project structure

- `index.html` — app entry point and markup
- `styles.css` — visual design and layout rules
- `app.js` — application behavior and storage handling
- `sw.js` — offline caching strategy
- `manifest.json` — PWA metadata
- `logo.svg`, `logo-192.png`, `logo-512.png` — icons
- `LaunchApp_Linux.sh`, `LaunchApp_Mac.command`, `LaunchApp_Windows.bat` — helper scripts
- `test.py` — utility script for generating SVG assets (not part of the runtime app)

## Build / Deployment

There is no build step required. Deployment is simply copying the repository files to a static host.

Recommended deployment targets:

- GitHub Pages
- Netlify
- Vercel
- any static file host or CDN

### Deploy via GitHub Pages

1. Push the repo to GitHub.
2. Enable GitHub Pages for the repository.
3. Choose the root branch as the publishing source.

### Deploy via CLI-style static host

- Upload or sync the repository files to the host root
- Ensure `index.html` is served as the default page

## Contribution guidelines

- Keep changes small and focused.
- Update related markup, styles, or scripts together.
- Verify the app works in at least one modern browser after changes.
- If adding new features, respect the existing static architecture and avoid introducing unnecessary build tooling unless justified.
- For bug fixes, test the following flows:
  - habit creation and editing
  - group management
  - completion tracking
  - export/import
  - theme/settings persistence

## Notes for future developers

- State is persisted using `localStorage` for habits, groups, and settings.
- Offline behavior is enabled with `sw.js`, which caches the app shell during install.
- The app is intentionally small and dependency-free.
- `test.py` is a support script for asset generation and is not required for normal app usage.

## License

MIT
