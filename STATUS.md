# PlotTwist — Status
_Auto-updated by Status Brain on every push. Last change: Add Status Brain workflow._

**Status:** Live  
**What it is:** A web app that turns photos into funny, ongoing surreal stories in multiple styles, with each new photo continuing the same saga.  
**Stack:** Vanilla JavaScript (frontend), Node.js serverless function (backend), Claude API, Vercel.

## What works right now
- Upload a photo → Claude generates a story chapter in one of 11 selectable styles (Noir, Bedtime, Tabloid, One-Liner, Triptych, etc.)
- Each new photo continues the same story, remembering characters and cliffhangers from prior chapters
- All story state saved in browser localStorage (no server storage of sagas)
- Photos sent to Claude once per chapter, then discarded (privacy-first)
- 11 distinct story style prompts hardened to avoid literal photo descriptions
- Fallback offline story generator if API is unavailable
- Landing page explains the concept + 3-step UX flow
- Full-image display with reveal animation and empty state
- Re-roll any chapter or remove it entirely
- Responsive single-file HTML frontend (no build step)
- Environment variable configuration for API key and model selection
- Vercel-ready deployment (one-click import)
- No-cache headers on landing page to keep UX fresh

## Recent changes (newest first)
- 2026-07-20 — Add Status Brain workflow and script for automated status reporting
- 2026-06-21 — Fix core: stories now built from actual photo content (reverted bad ignore-image prompt); add no-cache headers; empty-state + reveal animation
- 2026-06-21 — Redesign landing: explain app + 3 steps, remove confusing stock preview, default to One-Liner style
- 2026-06-21 — Switch to Claude Sonnet 4.6 for better story quality
- 2026-06-21 — Fix: remove unsupported effort param that broke all story calls on Haiku
- 2026-06-21 — Fix: full-image display, AI-aware re-roll on any chapter + remove, stock photos for Surprise Me
- 2026-06-21 — Switch to Claude Haiku 4.5 for cost optimization
- 2026-06-21 — Initial v1 launch: photo-to-saga app with serverless Claude function

## Reusable parts (for other projects)
- **Status Brain** — automated plain-English project status from git commits and code state — `status-brain.mjs` and `.github/workflows/status-brain.yml`
- **Offline story fallback** — built-in story generator that runs client-side when API unavailable — embedded in `index.html`
- **Vercel serverless Claude wrapper** — handles API key securely, no build step needed — `api/story.js`

## Not done / next
- Model selection UI (currently only via environment variable)
- Story history/export (sagas live in localStorage only, no download option)
- Share saga links (would require server-side persistence)
- Image preview before upload
- Batch photo uploads
- Explicit tests or error tracking beyond fallback behavior
- Mobile UI polish (works, but not optimized for all screen sizes)
