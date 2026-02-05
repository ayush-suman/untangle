import { store } from "$lib/store";
import type { ChatMessage, Role } from "$lib/types";
import { json } from "@sveltejs/kit";



function isRole(x: unknown): x is Role {
  return x === "system" || x === "user" || x === "assistant";
}

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function validateMessages(x: unknown): ChatMessage[] {
  if (!Array.isArray(x)) throw new Error("messages must be an array");

  const out: ChatMessage[] = [];
  for (const item of x) {
    if (!isPlainObject(item)) throw new Error("each message must be an object");
    const role = item.role;
    const message = item.message;

    if (!isRole(role)) throw new Error("role must be system|user|assistant");
    if (!(typeof message === "string" || isPlainObject(message))) {
      throw new Error("message must be string or object");
    }

    out.push({ role, message });
  }
  return out;
}

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
  try {
    const body = await request.json();
    if (!isPlainObject(body)) throw new Error("body must be an object");

    const tag = body.tag;
    if (typeof tag !== "string" || !tag.trim()) throw new Error("tag must be a non-empty string");

    const messages = validateMessages(body.messages);

    store.push({ tag, messages, createdAt: new Date() });
    console.log(body)
    console.log(store)
    return json({
      ok: true,
      tags: Array.from(store.keys()).sort(),
      count: messages.length
    }, {
        headers: noStoreHeaders
    });
  } catch (err) {
    return json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 }
    );
  }
}

/**
 * GET /api/messages
 * - /api/messages -> { tags, data: { [tag]: messages } }
 * - /api/messages?tag=xyz -> { tag, messages }
 */
export async function GET({ url }) {
  const tag = url.searchParams.get("tag");

  if (tag) {
    var messages;
    var createdAt;
    var response;
    var responseAt;
    for (const data of store) {
        if (data.tag === tag) {
            messages = data.messages;
            createdAt = data.createdAt;
            response = data.response;
            responseAt = data.responseAt;
            break;
        }
    }
    if (messages) {
        return json({
        ok: true,
        messages,
        createdAt,
        response,
        responseAt
        });
    } else {
        return json({
            ok: false,
            error: "Tag not found"
        }, {
            status: 404
        })
    }
  }

  const messageRecords: Record<string, ChatMessage[]> = {}
  for (const data of store) {
    messageRecords[data.tag] = data.messages
  }

  return json({
    ok: true,
    messages: messageRecords
  }, {
        headers: noStoreHeaders
    });
}


export async function PATCH({ request }) {
    const body = await request.json();
    console.log(body)
    console.log(store)
    const { tag, response } = body;
    var data = store.findLast(data => data.tag === tag)
    console.log(data)
    if (data) {
      data.response = {"role": "assistant", "message": response };
      data.responseAt = new Date();
      return json({
        ok: true
      })
    } else {
        return json({
            ok: false,
            error: "Tag not found"
        }, {
            status: 404
        })
    }
}