// src/routes/+page.ts
import type { PageLoad } from "./$types";
import type { ChatMessage } from "$lib/types";

type LoadOk = {
  ok: true;
  tags: string[];
  activeTag: string | null;
  messages: ChatMessage[];
};

type LoadErr = {
  ok: false;
  error: string;
  tags: string[];
  activeTag: string | null;
  messages: ChatMessage[];
};

export const load: PageLoad = async ({ fetch, url }) => {
  const initialTag = url.searchParams.get("tag");

  const res = await fetch("/api/messages");
  const data = await res.json();

  if (!data?.ok) {
    const initial: LoadErr = {
      ok: false,
      error: data?.error ?? "Failed to load tags",
      tags: [],
      activeTag: null,
      messages: []
    };
    return { initial };
  }

  const tags: string[] = data.tags ?? [];

  const activeTag =
    initialTag && tags.includes(initialTag)
      ? initialTag
      : tags.length
        ? tags[tags.length - 1]
        : null;

  let messages: ChatMessage[] = [];
  if (activeTag) {
    const mres = await fetch(`/api/messages?tag=${encodeURIComponent(activeTag)}`);
    const mdata = await mres.json();
    if (mdata?.ok) messages = (mdata.messages ?? []) as ChatMessage[];
  }

  const initial: LoadOk = {
    ok: true,
    tags,
    activeTag,
    messages
  };

  return { initial };
};
