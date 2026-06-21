// PlotTwist — Vercel serverless function. Calls Claude with the uploaded photo.
// The API key lives in a Vercel Environment Variable (ANTHROPIC_API_KEY), never in the repo.
const MODEL = process.env.MODEL || "claude-opus-4-8";

const STYLES = {
  triptych:  "a surreal cinematic 'micro-movie' in three quick beats (a moment before, the scene, an escalation after). Give it punchy film-still energy.",
  oneliner:  "ONE vivid, surreal, funny sentence that feels like a memory you shouldn't have survived.",
  noir:      "a hard-boiled film-noir detective beat. Everything is a clue. Dry, shadowy, suspicious.",
  fantasy:   "an epic high-fantasy saga fragment — prophecies, ancient enemies, chosen heroes.",
  nature:    "a deadpan nature-documentary narration ('Here we observe...'), as if the subject were wildlife.",
  bedtime:   "a cozy, gentle, TODDLER-SAFE bedtime story beat. Warm and whimsical, never scary or edgy.",
  truecrime: "an ominous true-crime-podcast beat ('Investigators still can't explain...'). Serialized dread.",
  tabloid:   "a ridiculous supermarket-tabloid blurb with ALL-CAPS-worthy headline energy and breathless gossip.",
  hero:      "a comic-book superhero-origin beat. Powers awaken, a nemesis stirs, stakes escalate.",
  soap:      "an over-the-top soap-opera beat. Melodrama, betrayal, dramatic pauses, secret twins.",
  myth:      "an ancient Greek-myth / fable beat with meddling gods and a moral ('And so it was decreed...')."
};

const SCHEMA = {
  type: "object",
  properties: {
    sagaTitle: { type: "string", description: "Short catchy title for the whole saga (meaningful on chapter 1)." },
    title:     { type: "string", description: "Optional short chapter title; empty string if none." },
    kick:      { type: "string", description: "Tiny label, e.g. 'Chapter 3' or 'Scene 3'." },
    text:      { type: "string", description: "The chapter itself, 1-4 sentences." },
    hook:      { type: "string", description: "A forward cliffhanger, prefixed with '→ '." },
    newLore:   { type: "array", items: { type: "string" }, description: "0-2 short names of new recurring characters/objects introduced." }
  },
  required: ["sagaTitle","title","kick","text","hook","newLore"],
  additionalProperties: false
};

function buildPrompt(body){
  const s = body.saga || {};
  const style = STYLES[body.styleId] || STYLES.oneliner;
  const isFirst = (body.chapterIndex||0) === 0;
  let ctx;
  if (!isFirst) {
    ctx = `\nThis continues an ONGOING saga titled "${s.title||"(untitled)"}".`;
    if (s.lore && s.lore.length) ctx += ` Recurring characters/jokes so far: ${s.lore.join(", ")}.`;
    if (s.lastText) ctx += `\nThe previous chapter said: "${s.lastText}"`;
    if (s.lastHook) ctx += `\nThe previous chapter ended on this cliffhanger: "${s.lastHook}". Your new chapter MUST pay it off, then raise a new one.`;
  } else {
    ctx = "\nThis is Chapter 1 — kick off a brand-new saga and plant a recurring character or motif.";
  }
  return `You are PlotTwist, a surreal, emotionally-charged, FUNNY storyteller. Look at this photo and write the next tiny chapter as ${style}
${ctx}

Rules:
- Keep it SHORT: 1-4 sentences. Punchy, vivid, surprising.
- Do NOT literally describe the photo. Invent a tiny absurd world around it.
- Always END on a forward-looking HOOK that makes the reader want the next chapter.
- The comedy is shared by people who were actually there — lean into in-joke energy.
Return JSON only.`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) { res.status(500).json({ error: "missing ANTHROPIC_API_KEY" }); return; }
  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    if (!body) body = {};
    const img = String(body.image || "");
    const m = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/);
    if (!m) { res.status(400).json({ error: "bad image" }); return; }

    const payload = {
      model: MODEL,
      max_tokens: 500,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: m[1], data: m[2] } },
          { type: "text", text: buildPrompt(body) }
        ]
      }]
    };

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) { res.status(502).json({ error: "api " + r.status }); return; }
    if (data.stop_reason === "refusal") { res.status(502).json({ error: "refusal" }); return; }
    const textBlock = (data.content || []).find(b => b.type === "text");
    if (!textBlock) { res.status(502).json({ error: "no text" }); return; }
    res.status(200).json(JSON.parse(textBlock.text));
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
};
