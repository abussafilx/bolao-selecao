import { getStore } from "@netlify/blobs";

const STORE_NAME = "bolao";
const ENTRIES_KEY = "entries";

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
      const raw = await store.get(ENTRIES_KEY, { type: "json" });
      return new Response(JSON.stringify(raw || []), { status: 200, headers });
    }

    if (req.method === "POST") {
      const { nome, picks } = await req.json();
      if (!nome || !Array.isArray(picks) || picks.length !== 26) {
        return new Response(JSON.stringify({ error: "Dados inválidos." }), { status: 400, headers });
      }
      const entries = (await store.get(ENTRIES_KEY, { type: "json" })) || [];
      if (entries.find((e) => e.nome.toLowerCase() === nome.toLowerCase())) {
        return new Response(JSON.stringify({ error: "Nome já registado." }), { status: 409, headers });
      }
      const entry = {
        id: Date.now(),
        nome: nome.trim(),
        picks,
        data: new Date().toLocaleDateString("pt-BR"),
      };
      entries.push(entry);
      await store.setJSON(ENTRIES_KEY, entries);
      return new Response(JSON.stringify(entry), { status: 201, headers });
    }

    if (req.method === "DELETE") {
      const { id } = await req.json();
      const entries = (await store.get(ENTRIES_KEY, { type: "json" })) || [];
      const filtered = entries.filter((e) => e.id !== id);
      await store.setJSON(ENTRIES_KEY, filtered);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  } catch (err) {
    console.error("entries error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};

export const config = { path: "/api/entries" };
