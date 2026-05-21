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
</script>

<div class="messages">
  <div class="timestamp">{fmt(messagesAt)}</div>
  {#each messages as m, i (i)}
    <MessageBubble role={m.role} message={m.message} />
  {/each}
  {#if response}
    <!-- <div class="timestamp">{responseAt ? fmt(responseAt) : null}</div> -->
    <!-- <MessageBubble role={response.role} message={response.message} /> -->
  {/if}
</div>

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
</style>
