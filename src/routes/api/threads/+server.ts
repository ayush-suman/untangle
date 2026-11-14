import { store } from "$lib/store";
import { json } from "@sveltejs/kit";
import type { ChatThread, ChatMessage } from "$lib/types";

/**
 * Normalise an assistant response into the viewer's ChatMessage shape ({ role, message }).
 * Accepts either `message` (array) or `content` (array, e.g. a structured block or tool calls)
 * so the response renders under its own tag regardless of the interceptor's payload key.
 */
function toChatMessage(response: unknown): ChatMessage | undefined {
  if (!response || typeof response !== "object") return response as undefined;
  const r = response as { role?: ChatMessage["role"]; message?: unknown; content?: unknown };
  const raw = Array.isArray(r.message) ? r.message : Array.isArray(r.content) ? r.content : [];
  return { role: r.role ?? "assistant", message: raw as ChatMessage["message"] };
}

/**
 * POST /api/messages
 * body: { sessionID, sessionName?, tag, messages, formatKeys?, schema? }
 * Adds the messages for a new tag. Fails if the tag already exists.
 */
export async function POST({ request }) {
  const { sessionID, promptID, tag, messages, formatKeys, schema } = await request.json();

  const thread: ChatThread = {
    promptID,
    tag,
    messages,
    messagesAt: new Date(),
    args: formatKeys,
    schema
  };

  const session = store.find((s) => s.id === sessionID);
  if (!session) {
    store.push({ id: sessionID, threads: { [promptID]: thread } });
  } else {
    if (session.threads[promptID] !== undefined) {
      return json({
        ok: false,
        error: `Tag ${tag} already exists in session with id ${sessionID}`
      }, { status: 400 });
    }
    session.threads[promptID] = thread;
  }
  return json({ ok: true, message: `Messages added for tag ${tag}` }, { status: 201 });
}

/**
 * GET /api/messages?sessionID=&tag=
 * Returns all sessions, optionally filtered by session and/or tag.
 */
export async function GET({ url }) {
  const sessionID = url.searchParams.get("sessionID");
  const promptID = url.searchParams.get("promptID");

  
  const sessions = store
    .filter((s) => !sessionID || s.id === sessionID)
    .map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      threads: promptID ? { [promptID]: s.threads[promptID] } : s.threads
    }));

  return json({ ok: true, sessions });
}

/**
 * PATCH /api/messages
 * body: { sessionID, tag, response }
 * Records the assistant response for an existing tag.
 */
export async function PATCH({ request }) {
  const { sessionID, promptID, response, errors, validator } = await request.json();

  const session = store.find((s) => s.id === sessionID);
  if (!session) {
    return json({ ok: false, message: "Session not found" }, { status: 404 });
  }

  const thread = session.threads[promptID];
  if (!thread) {
    return json({ ok: false, message: "Tag not found" }, { status: 404 });
  }

  if (errors !== undefined) {
    if (thread.validatorErrors === undefined) thread.validatorErrors = [];
    thread.validatorErrors.push({ validator: validator, response: toChatMessage(response)!, errors: errors, createdAt: new Date() });
    return json({ ok: true, message: "Validation Error added" });
  } else {
    thread.response = toChatMessage(response);
    thread.responseAt = new Date();
    return json({ ok: true, message: "Response added" });
  }
  
}
