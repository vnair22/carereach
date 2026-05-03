# CareReach

AI-powered admin tools for small healthcare practices.

## Pages
- `/` — Landing page (public marketing site)
- `/dashboard` — App dashboard (three AI tools)

## Setup

1. Install dependencies:
```
npm install
```

2. Run locally:
```
npm run dev
```

3. Build for production:
```
npm run build
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → Add New Project → select your repo
3. Click Deploy — done

The `vercel.json` file is already configured so page routing works correctly.

## Tech Stack
- React 18
- React Router v6
- Vite
- Anthropic Claude API (claude-sonnet-4-20250514)

## Files
```
src/
  main.jsx       — entry point
  App.jsx        — routing
  Landing.jsx    — marketing page at /
  Dashboard.jsx  — app at /dashboard
```
