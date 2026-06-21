# PlotTwist

Turn your photos into a tiny, funny, ongoing surreal saga. Add a photo, get a chapter; every new photo continues the same story, remembering its recurring characters and cliffhangers. Pick from 11 story styles (Triptych, Noir, Bedtime, Tabloid, and more).

## How it works
- **Front end:** a single static `index.html` (vanilla JS, no build step).
- **Back end:** one serverless function at `api/story.js` that calls Claude with the uploaded photo. The API key stays server-side.
- If the function is unavailable, the app falls back to a built-in offline story generator so it never just breaks.

## Deploy on Vercel
1. Import this repo into Vercel (Framework Preset: **Other** — no build step needed).
2. Add an Environment Variable:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
   - *(optional)* `MODEL` = `claude-opus-4-8` (default) — set to `claude-haiku-4-5` for lower cost
3. Deploy. Open the URL, tap **Add a photo**, and start a saga.

## Privacy
No photos are stored in this repo or on the server. Images are sent once to Claude to generate the chapter; sagas are saved only in the user's own browser (localStorage).
