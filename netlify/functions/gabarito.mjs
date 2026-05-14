import { getStore } from "@netlify/blobs";

const STORE_NAME = "bolao";
const GABARITO_KEY = "gabarito";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const store = getStore(STORE_NAME);

  try {
    if (req.method === "GET") {
      const raw = await store.get(GABARITO_KEY, { type: "json" });
      return new Response(JSON.stringify(raw || null), { status: 200, headers });
    }

    if (req.method === "POST") {
      const { picks } = await req.json();
      if (!Array.isArray(picks) || picks.length !== 25) {
        return new Response(JSON.stringify({ error: "Selecione exatamente 25 jogadores." }), { status: 400, headers });
      }
      await store.setJSON(GABARITO_KEY, picks);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    if (req.method === "DELETE") {
      await store.delete(GABARITO_KEY);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  } catch (err) {
    console.error("gabarito error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};

export const config = { path: "/api/gabarito" };
