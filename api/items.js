// api/items.js
// GET /api/items  — возвращает список товаров из Botrix
// Работает на Vercel Serverless (Node 18+/20, глобальный fetch доступен).

const CHANNEL = process.env.CHANNEL || "alexcasino";

module.exports = async (req, res) => {
  try {
    const url = `https://botrix.live/api/public/shop/items?u=${encodeURIComponent(CHANNEL)}&platform=kick`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ ok: false, error: "Botrix shop fetch failed", detail: text });
    }
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
};
