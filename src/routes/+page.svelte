<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TagStrip from "$lib/components/TagStrip.svelte";
  import MessageList from "$lib/components/MessageList.svelte";
  import ErrorBanner from "$lib/components/ErrorBanner.svelte";
  import type { ChatMessage } from "$lib/types";
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  export let data: {
    initial:
      | { ok: false; error: string; tags: string[]; activeTag: string | null; messages: ChatMessage[] }
      | { ok: true; tags: string[]; activeTag: string | null; messages: ChatMessage[] };
  };

  let tags: string[] = data.initial.tags ?? [];
  let activeTag: string | null = data.initial.activeTag ?? null;
  let messages: ChatMessage[] = (data.initial as any).messages ?? [];
  let loadError: string | null = data.initial.ok ? null : (data.initial as any).error ?? "Failed to load";

  async function refreshTagsAndMaybeActive() {
    const res = await fetch("/api/tags");
    const j = await res.json();

    if (!j.ok) {
      loadError = j.error ?? "Failed to load tags";
      return;
    }

    loadError = null;
    tags = j.tags ?? [];

    // If current active tag disappeared (server restart), clear selection.
    if (activeTag && !tags.includes(activeTag)) {
      activeTag = null;
      messages = [];
      return;
    }

    // If no active tag, pick the last.
    if (!activeTag && tags.length) {
      await selectTag(tags[tags.length - 1], { updateUrl: true });
    }
  }

  async function selectTag(tag: string, opts: { updateUrl?: boolean } = {}) {
    activeTag = tag;
    loadError = null;

    const res = await fetch(`/api/messages?tag=${encodeURIComponent(tag)}`);
    const j = await res.json();

    if (!j.ok) {
      loadError = j.error ?? "Failed to load messages";
      messages = [];
      return;
    }

    messages = j.messages ?? [];

    // Keep URL in sync for shareable deep links: /?tag=xyz
    if (opts.updateUrl) {
      goto(`/?tag=${encodeURIComponent(tag)}`, { replaceState: true, noScroll: true });
    }
  }

  // Client-only polling so the UI updates when API is hit externally.
  const POLL_MS = 1500;
  let timer: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    timer = setInterval(refreshTagsAndMaybeActive, POLL_MS);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<svelte:head>
  <title>Message Viewer</title>
</svelte:head>

<div class="app">
  <div class="topbar">
    <TagStrip {tags} {activeTag} on:select={(e) => selectTag(e.detail.tag, { updateUrl: true })} />
  </div>

  <div class="content">
    <ErrorBanner error={loadError} />

    {#if !activeTag}
      <div class="hint">Select a tag to view messages.</div>
    {:else if messages.length === 0}
      <div class="hint">No messages for “{activeTag}”.</div>
    {:else}
      <MessageList {messages} />
    {/if}
  </div>
</div>

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: #0b0b0c;
    color: #f3f3f3;
  }

  .topbar {
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    background: #111114;
  }

  .content {
    flex: 1;
    padding: 16px;
    overflow: auto;
  }

  .hint {
    opacity: 0.8;
    padding: 16px;
    border: 1px dashed rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    max-width: 720px;
  }
</style>
