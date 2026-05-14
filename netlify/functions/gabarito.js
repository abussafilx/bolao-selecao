import { getStore } from "@netlify/blobs";

const STORE_NAME = "bolao";
const GABARITO_KEY = "gabarito";

export default async (req, context) => {
  const store = getStore(STORE_NAME);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // GET — return current gabarito
  if (req.method === "GET") {
    const raw = await store.get(GABARITO_KEY, { type: "json" });
    return Response.json(raw || null);
  }

  // POST — save gabarito (25 picks)
  if (req.method === "POST") {
    const body = await req.json();
    const { picks } = body;

    if (!picks || picks.length !== 25) {
      return Response.json({ error: "Selecione exatamente 25 jogadores." }, { status: 400 });
    }

    await store.setJSON(GABARITO_KEY, picks);
    return Response.json({ ok: true });
  }

  // DELETE — clear gabarito
  if (req.method === "DELETE") {
    await store.delete(GABARITO_KEY);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/gabarito" };
