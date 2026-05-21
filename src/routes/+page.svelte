<script lang="ts">
  import TagStrip from "$lib/components/TagStrip.svelte";
  import MessageList from "$lib/components/MessageList.svelte";
  import ErrorBanner from "$lib/components/ErrorBanner.svelte";
  import type { ChatMessage } from "$lib/types";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
   import { onMount } from 'svelte';

  let { data }: { data: PageData } = $props();

  let current = $state<{
    sessionID?: string,
    tag?: string
  }>({});

  let messageCache: Record<string, Record<string, {
    messages: ChatMessage[] 
    messagesAt: Date
    response?: ChatMessage
    responseAt?: Date
  } | null>> = $state({});

  let sessions: Array<{
      id: string,
      name?: string
      description?: string
      tags: string[]
  }> = $state([]);

  let currentSession = $derived(current.sessionID ? sessions.find((s) => s.id === current.sessionID) : null);

  let currentMessages: {
    messages: ChatMessage[], 
    messagesAt: Date,
    response?: ChatMessage,
    responseAt?: Date
  } | null = $state(null);

  // let currentSession = $derived(sessions.find((v) => v.id === current?.sessionID));
  // let currentTag = $derived(currentSession?.tags.find((t) => t === current?.tag));
  // let currentData = $derived(currentSession ? currentTag ? cache[currentSession.id][currentTag] : null : null);

  let loadError: string | null = $state(null);
  
  onMount(() => {
    console.log(data.initial)
    if (data.initial.ok) {
      for (let session of data.initial.sessions) {
        const s = sessions.find((s) => s.id === session.id)
        if (s) {
          s.tags = session.messages.map((t) => t.tag);
        } else {
        sessions.unshift({
            id: session.id,
            name: session.name,
            description: session.description,
            tags: session.messages.map((t) => { return t.tag })
          });
        }

        messageCache[session.id] = {};
        for (let tag of session.messages) {
          messageCache[session.id][tag.tag] = {
            messages: tag.messages,
            messagesAt: tag.messagesAt,
            response: tag.response,
            responseAt: tag.responseAt
          }
        }
      }
      if (data.initial.sessions.length > 0) {
        const latestSession = data.initial.sessions[data.initial.sessions.length - 1];
        current = { 
          sessionID: latestSession.id,
          tag: latestSession.messages[latestSession.messages.length - 1].tag
        };
      }
    }
  });

  $effect(() => { 
    loadError = null;
    if (current.sessionID) {
      const matchingTag = currentSession?.tags.find((t) => t === current.tag);
      if (!matchingTag) {
        current.tag = currentSession?.tags[currentSession.tags.length - 1];
      }
      if (current.tag) {
        goto(
          `/?sessionID=${encodeURIComponent(current.sessionID)}&tag=${encodeURIComponent(current.tag)}`,
          { 
            replaceState: true, 
            noScroll: true 
          }
        );
        if (!(current.sessionID in messageCache && current.tag in messageCache[current.sessionID])) {
          loadMessages(current.sessionID, current.tag!).then(() => {
            currentMessages = messageCache[current.sessionID!][current.tag!];
          })
        } else {
          currentMessages = messageCache[current.sessionID!][current.tag!];
          loadMessages(current.sessionID, current.tag);
        }
      }
    } else {
      goto(
        "/",
        { 
          replaceState: true, 
          noScroll: true 
        }
      );
    }
  })

  async function getAllSessions() {
    const res = await fetch("/api/sessions");
    console.log("Getting all sessions");
    console.log(res);
    const json: {
      ok: boolean,
      sessions: {
        id: string,
        name?: string,
        description?: string,
        tags: string[]
      }[]
    } = await res.json();
    console.log(json);
    if (!json.ok) {
      return;
    }

    for (let session of json.sessions) {
      const s = sessions.find((s) => s.id === session.id);
      if (s) {
        s.tags = session.tags;
      } else {
        sessions.unshift({
          id: session.id,
          name: session.name,
          description: session.description,
          tags: session.tags.map((t) => { return t })
        });
      }
    }

    if (!current.sessionID) {
      if (json.sessions.length > 0) {
        let latest = json.sessions[json.sessions.length - 1];
        current.sessionID = latest.id;
      }
    }
  }

  async function loadMessages(sessionID: string, tag: string) {
    const res = await fetch(`/api/sessions/${encodeURIComponent(sessionID)}/messages?tag=${encodeURIComponent(tag)}`);
    const json = await res.json();
    if (!json.ok) {
      loadError = json.error ?? "Error loading messages";
      return
    }

    if (!(json.id in messageCache)) {
      messageCache[json.id] = {}
    }

    const message = json.messages.find((m: { tag: string; messages: ChatMessage[], messagesAt: Date, response: ChatMessage, responseAt: Date}) => m.tag === tag)

    messageCache[json.id][tag] = {
      messages: message.messages,
      messagesAt: message.messagesAt,
      response: message.response,
      responseAt: message.responseAt
    }
    if (!current.tag) {
      current.tag = tag;
    }

  }

  // Client-only polling so the UI updates when API is hit externally.
  const POLL_MS = 1500;

  $effect(() => {
    const timer = setInterval(getAllSessions, POLL_MS);
    return () => clearInterval(timer);
  });
</script>

<svelte:head>
  <title>Message Viewer</title>
</svelte:head>


<div class="layout">
  <aside class="sidebar">
    <div class="header">
      Untangle
    </div>
    
    <nav>
      {#each sessions as s}
        <button class="session {current.sessionID === s.id ? "selected" : ""}" onclick={() => { current.sessionID = s.id }}>
          <div>{s.name}</div>
        </button>
      {/each}
    </nav>
  </aside>

  <div class="app">
    <div class="topbar">
      {#if currentSession?.tags}
        <TagStrip tags={currentSession.tags} selectedTag={current.tag} onSelect={(id) => { current!.tag = id }} />
      {/if}
    </div>

    <div class="content">
      <ErrorBanner error={loadError} />

      {#if !current.tag}
        <div class="hint">Select a tag to view messages.</div>
      {:else if !currentMessages || currentMessages.messages.length === 0}
        <div class="hint">No messages for “{current.tag}”.</div>
      {:else}
        <MessageList 
          messages={currentMessages.messages} 
          messagesAt={currentMessages.messagesAt} 
          response={currentMessages.response} 
          responseAt={currentMessages.responseAt}
        />
      {/if}
    </div>
  </div>
</div>

<style>
  .layout {
    display: flex;
  }

  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: #0b0b0c;
    color: #f3f3f3;
    flex-grow: 1;
    min-width: 0;
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

  .header {
    font-size: large;
    margin-inline-start: 20px;
    margin-top: 18px;
    margin-bottom: 16px;
    font-family: 'system-ui';
    color: #f0f0f0;
  }

  .session {
    border: none;
    background: rgba(255,255,255,0.06);
    color: #fff;
    padding: 12px 12px;
    margin-inline-start: 16px;
    border-radius: 4px;
    cursor: pointer;
    flex: 1 0 auto;
    width: 226px;
    text-align: start;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: 0.1s;
    margin: 2px 12px;
  }

  .session:hover {
    background: rgba(255,255,255,0.1);
  }

  .session.selected {
    background: rgba(255,255,255,0.16);
  }

  .sidebar {
    width: 250px;
    height: 100vh;
    background: #030304;
    transition: transform 0.3s ease-in-out;
    overflow-x: hidden;
    overflow-y: auto;
    flex-shrink: 0;
  }
</style>
