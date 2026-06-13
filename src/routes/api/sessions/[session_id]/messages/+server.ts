import { store } from "$lib/store";
import { json } from "@sveltejs/kit";

export async function GET({ url, params }) {
  const tag = url.searchParams.get("tag");
  const sessionID = params.session_id;

  const session = store.find((s) => s.id === sessionID);
  if (!session) {
    return json({ ok: false, error: `Session with id ${sessionID} not found` }, { status: 404 });
  }

  return json({
    ok: true,
    id: session.id,
    name: session.name,
    messages: tag ? session.tags.filter((t) => t.tag === tag) : session.tags
  });
}
