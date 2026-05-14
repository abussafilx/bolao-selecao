const { getStore } = require("@netlify/blobs");

const STORE_NAME = "bolao";
const GABARITO_KEY = "gabarito";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  const store = getStore(STORE_NAME);

  try {
    if (event.httpMethod === "GET") {
      const raw = await store.get(GABARITO_KEY, { type: "json" });
      return { statusCode: 200, headers, body: JSON.stringify(raw || null) };
    }

    if (event.httpMethod === "POST") {
      const { picks } = JSON.parse(event.body || "{}");
      if (!Array.isArray(picks) || picks.length !== 25) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Selecione exatamente 25 jogadores." }) };
      }
      await store.setJSON(GABARITO_KEY, picks);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "DELETE") {
      await store.delete(GABARITO_KEY);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  } catch (err) {
    console.error("gabarito error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
