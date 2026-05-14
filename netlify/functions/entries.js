const { getStore } = require("@netlify/blobs");

const STORE_NAME = "bolao";
const ENTRIES_KEY = "entries";

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
      const raw = await store.get(ENTRIES_KEY, { type: "json" });
      return { statusCode: 200, headers, body: JSON.stringify(raw || []) };
    }

    if (event.httpMethod === "POST") {
      const { nome, picks } = JSON.parse(event.body || "{}");
      if (!nome || !Array.isArray(picks) || picks.length !== 26) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Dados inválidos." }) };
      }
      const entries = (await store.get(ENTRIES_KEY, { type: "json" })) || [];
      if (entries.find((e) => e.nome.toLowerCase() === nome.toLowerCase())) {
        return { statusCode: 409, headers, body: JSON.stringify({ error: "Nome já registado." }) };
      }
      const entry = {
        id: Date.now(),
        nome: nome.trim(),
        picks,
        data: new Date().toLocaleDateString("pt-BR"),
      };
      entries.push(entry);
      await store.setJSON(ENTRIES_KEY, entries);
      return { statusCode: 201, headers, body: JSON.stringify(entry) };
    }

    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body || "{}");
      const entries = (await store.get(ENTRIES_KEY, { type: "json" })) || [];
      const filtered = entries.filter((e) => e.id !== id);
      await store.setJSON(ENTRIES_KEY, filtered);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  } catch (err) {
    console.error("entries error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
