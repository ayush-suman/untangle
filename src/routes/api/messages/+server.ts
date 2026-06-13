import { store } from "$lib/store";
import { json } from "@sveltejs/kit";


const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0"
} as const;

/**
 * POST /api/messages
 * body: { tag: string, messages: ChatMessage[] }
 * Replaces messages for tag.
 */
export async function POST({ request }) {
  const body = await request.json();
  const sessionID = body.sessionID;
  const sessionName = body.sessionName;
  const tag = body.tag;
  const formatKeys = body.formatKeys;
  const schema = body.schema;
  const session = store.find((s) => s.id == sessionID);
  if (!session) {
    store.push({
      id: sessionID,
      name: sessionName,
      tags: [{
        tag: tag,
        messages: body.messages,
        messagesAt: new Date(),
        formatKeys: formatKeys,
        schema: schema
      }]
    })
  } else {
    const data = session.tags.find((t) => t.tag === tag);
    console.log("Found data", data)
    if (data) {
      return json({
        ok: false,
        error: `Tag ${tag} already exists in session with id ${sessionID}`
      }, {
        status: 400
      })
    } else {
      session.tags.push({
        tag: tag,
        messages: body.messages,
        messagesAt: new Date(),
        formatKeys: formatKeys,
        schema: schema
      })
    }
  }
  return json({
    ok: true,
    message: `Messages added for tag ${tag}`
  }, {
    status: 201
  })
}

/**
 * GET /api/messages
 */
export async function GET({ url }) {
  const sessionID = url.searchParams.get("sessionID");
  const tag = url.searchParams.get("tag");

  let sessions = store.map((s) => { 
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      messages: tag ? s.tags.filter((t) => t.tag === tag) : s.tags
    }
  });
  if (sessionID) {
    sessions = sessions.filter((s) => s.id === sessionID)
  }
  return json({
    ok: true,
    sessions: sessions
  }, {
    status: 200
  })
}


export async function PATCH({ request }) {
    const body = await request.json();
    const sessionID = body.sessionID;
    const tag = body.tag;
    const response = body.response;
    console.log(tag);
    let session = store.find((s) => s.id === sessionID);
    console.log("Session", session)
    if (!session) {
      return json({
        ok: false,
        message: "Session not found"
      }, {
        status: 404
      })
    }
    let data = session.tags.find((t) => t.tag === tag);
    console.log("Data", data)
    if (!data) {
      return json({
        ok: false,
        message: "Tag not found"
      }, {
        status: 404
      })
    }
    data.response = { role: "assistant", message: response };
    data.responseAt = new Date();
    return json({
      ok: true,
      message: "Response added"
    }, {
      status: 200
    })
}