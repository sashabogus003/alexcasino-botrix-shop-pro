// api/user/[nickname].js
// GET /api/user/:nickname — ищет пользователя в Leaderboard и возвращает JSON как есть.

const CHANNEL = process.env.CHANNEL || "alexcasino";

module.exports = async (req, res) => {
  try {
    const { nickname } = req.query;
    if (!nickname) {
      return res.status(400).json({ ok: false, error: "Missing nickname" });
    }
    const url = `https://botrix.live/api/public/leaderboard?platform=kick&user=${encodeURIComponent(CHANNEL)}&search=${encodeURIComponent(String(nickname))}`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ ok: false, error: "Botrix leaderboard fetch failed", detail: text });
    }
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
};
