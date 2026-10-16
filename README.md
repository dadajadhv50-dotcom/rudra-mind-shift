# RUDRA MIND SHIFT 🧠⚡

A mobile-first futuristic memory and logic puzzle game, ready for GitHub and GitHub Pages.

## Features
- Memory Capture, Mind Shift, and Memory Trap modes
- Easy, medium, and hard difficulty
- 10-round sessions, scores, streaks, and levels
- Memory Fingerprint feedback based on session performance
- Browser-local progress saving (`localStorage`)
- PWA manifest and service worker for offline caching after first load
- Responsive neon interface for Android/mobile browsers
- No API key or external JavaScript library required

## Run
Open `index.html` in a modern browser. For PWA/offline service-worker support, serve it over HTTPS or localhost.

## Publish on GitHub Pages
1. Create a GitHub repository named `rudra-mind-shift`.
2. Extract this ZIP and upload **all files inside the folder** to the repository root, including the hidden `.github` folder.
3. Open **Settings → Pages** and enable GitHub Pages, or use the included Actions workflow.
4. If using Actions, set Pages source to **GitHub Actions** in Settings → Pages.
5. Check the **Actions** tab. After a successful deploy, open the Pages URL shown in the workflow.

## Android
Open the HTTPS Pages URL in Chrome and choose **⋮ → Install app** or **Add to Home screen**, if offered. This installs a web app/PWA shortcut; this project is not a compiled native APK.

## Not included yet
Online leaderboard, login, cloud sync, multiplayer, and server APIs are not connected. The current game is a 2D browser game with futuristic styling, not a full 3D engine game.

## Project files
- `index.html` — game screens
- `style.css` — neon responsive design
- `app.js` — puzzle logic and local progress
- `manifest.json` — PWA metadata
- `sw.js` — offline cache
- `assets/icon.svg` — RUDRA icon
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment
