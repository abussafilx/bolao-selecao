import { getStore } from "@netlify/blobs";

const STORE_NAME = "bolao";
const ENTRIES_KEY = "entries";

export default async (req, context) => {
  const store = getStore(STORE_NAME);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // GET — list all entries
  if (req.method === "GET") {
    const raw = await store.get(ENTRIES_KEY, { type: "json" });
    return Response.json(raw || []);
  }

  // POST — add new entry
  if (req.method === "POST") {
    const body = await req.json();
    const { nome, picks } = body;

    if (!nome || !picks || picks.length !== 26) {
      return Response.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const entries = (await store.get(ENTRIES_KEY, { type: "json" })) || [];

    if (entries.find((e) => e.nome.toLowerCase() === nome.toLowerCase())) {
      return Response.json({ error: "Nome já registado." }, { status: 409 });
    }

    const entry = {
      id: Date.now(),
      nome: nome.trim(),
      picks,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    entries.push(entry);
    await store.setJSON(ENTRIES_KEY, entries);

    return Response.json(entry, { status: 201 });
  }

  // DELETE — remove entry by id
  if (req.method === "DELETE") {
    const { id } = await req.json();
    const entries = (await store.get(ENTRIES_KEY, { type: "json" })) || [];
    const filtered = entries.filter((e) => e.id !== id);
    await store.setJSON(ENTRIES_KEY, filtered);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/entries" };
