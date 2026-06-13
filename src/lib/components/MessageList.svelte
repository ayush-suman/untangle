<script lang="ts">
  import type { ChatMessage } from "$lib/types";
  import MessageBubble from "./MessageBubble.svelte";

  const { messages, messagesAt, response, responseAt}: {
    messages: ChatMessage[],
    messagesAt: Date,
    response: ChatMessage | undefined,
    responseAt: Date | undefined
  } = $props();
  const fmt = (d: Date) => new Date(d).toLocaleTimeString("en-IN", { timeZone: 'Asia/Kolkata' });

  let responseEl = $state<HTMLDivElement | null>(null);
  let responseVisible = $state(false);

  const viewResponse = () =>
    responseEl?.scrollIntoView({ behavior: "smooth", block: "end" });

  $effect(() => {
    if (!responseEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => (responseVisible = entry.isIntersecting)
    );
    observer.observe(responseEl);
    return () => observer.disconnect();
  });
</script>

<div class="messages">
  <div class="timestamp">{fmt(messagesAt)}</div>
  {#each messages as m, i (i)}
    <MessageBubble role={m.role} message={m.message} />
  {/each}
  {#if response}
    <div class="timestamp">{responseAt ? fmt(responseAt) : null}</div>
    <div bind:this={responseEl}>
      <MessageBubble role={response.role} message={response.message} />
    </div>
  {/if}
</div>

{#if response && !responseVisible}
  <button class="view-response" onclick={viewResponse}>
    View Response
  </button>
{/if}

<style>
  .timestamp {
    font-size: 12px;
    opacity: 0.6;
    margin: 8px 0 6px;
    text-align: center;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .view-response {
    /* Anchored to .body (the relative ancestor); offset by the 44px
       toolstrip so it centers over the message list, not the viewport. */
    position: absolute;
    bottom: 20px;
    left: calc((100% - 44px) / 2);
    transform: translateX(-50%);
    z-index: 40;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    background: rgba(26, 138, 56, 0.92);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
    transition: 0.1s;
  }

  .view-response:hover {
    background: #1a8a38;
  }
</style>
