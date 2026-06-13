import { store } from "$lib/store";
import { json } from "@sveltejs/kit";
import type { TagThread } from "$lib/types";

/**
 * POST /api/messages
 * body: { sessionID, sessionName?, tag, messages, formatKeys?, schema? }
 * Adds the messages for a new tag. Fails if the tag already exists.
 */
export async function POST({ request }) {
  const { sessionID, sessionName, tag, messages, formatKeys, schema } = await request.json();

  const thread: TagThread = {
    tag,
    messages,
    messagesAt: new Date(),
    formatKeys,
    schema
  };

  const session = store.find((s) => s.id === sessionID);
  if (!session) {
    store.push({ id: sessionID, name: sessionName, tags: [thread] });
  } else if (session.tags.some((t) => t.tag === tag)) {
    return json({
      ok: false,
      error: `Tag ${tag} already exists in session with id ${sessionID}`
    }, { status: 400 });
  } else {
    session.tags.push(thread);
  }

  return json({ ok: true, message: `Messages added for tag ${tag}` }, { status: 201 });
}

/**
 * GET /api/messages?sessionID=&tag=
 * Returns all sessions, optionally filtered by session and/or tag.
 */
export async function GET({ url }) {
  const sessionID = url.searchParams.get("sessionID");
  const tag = url.searchParams.get("tag");

  const sessions = store
    .filter((s) => !sessionID || s.id === sessionID)
    .map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      messages: tag ? s.tags.filter((t) => t.tag === tag) : s.tags
    }));

  return json({ ok: true, sessions });
}

/**
 * PATCH /api/messages
 * body: { sessionID, tag, response }
 * Records the assistant response for an existing tag.
 */
export async function PATCH({ request }) {
  const { sessionID, tag, response } = await request.json();

  const session = store.find((s) => s.id === sessionID);
  if (!session) {
    return json({ ok: false, message: "Session not found" }, { status: 404 });
  }

  const thread = session.tags.find((t) => t.tag === tag);
  if (!thread) {
    return json({ ok: false, message: "Tag not found" }, { status: 404 });
  }

  thread.response = { role: "assistant", message: response };
  thread.responseAt = new Date();
  return json({ ok: true, message: "Response added" });
}
