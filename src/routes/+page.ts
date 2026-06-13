import type { PageLoad } from "./$types";
import type { ChatMessage } from "$lib/types";

type LoadOk = {
  ok: true;
  sessions: {
    id: string,
    name?: string,
    description?: string,
    messages: {
      id: number,
      tag: string,
      messages: ChatMessage[],
      messagesAt: Date,
      response?: ChatMessage,
      responseAt?: Date,
      formatKeys?: Record<string, unknown>,
      schema?: Record<string, unknown>
    }[]
  }[]
};

type LoadErr = {
  ok: false;
  error: string;
};

export const load: PageLoad = async ({ fetch, url }) => {
  const sessionID = url.searchParams.get("sessionID");
  const tag = url.searchParams.get("tag");
  
  let route = "/api/messages";

  if (sessionID) {
    route += `?sessionID=${encodeURIComponent(sessionID)}`;
    if (tag) {
      route += `&tag=${encodeURIComponent(tag)}`;
    }
  }
  const res = await fetch(route);
  const data = await res.json();
  
  let initial: LoadErr | LoadOk;

  if (!data?.ok) {
    initial = {
      ok: false,
      error: data?.error ?? "Failed to load tags"
    };
  } else {
    console.log(data.sessions)
    initial = {
      ok: true,
      sessions: data.sessions
    };
  }

  return { initial };
}
