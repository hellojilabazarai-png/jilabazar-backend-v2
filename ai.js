// POST /api/ai
// Body: { prompt, maxTokens }
// OpenAI API key sirf yahan (server ke environment variable OPENAI_API_KEY) mein rehti hai.
// Frontend sirf ye endpoint call karta hai — key kabhi browser mein nahi jaati.

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt, maxTokens = 500 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "prompt zaroori hai" });
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI abhi configure nahi hai" });

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error?.message || "OpenAI error" });

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ ok: true, text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error, dubara try karein" });
  }
};
