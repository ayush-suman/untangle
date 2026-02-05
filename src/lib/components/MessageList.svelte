<script lang="ts">
  import type { ChatMessage } from "$lib/types";
  import MessageBubble from "./MessageBubble.svelte";

  export let messages: ChatMessage[] = [];
  export let createdAt: Date; 
  export let response: ChatMessage | undefined = undefined; 
  export let responseAt: Date | undefined = undefined;
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log(new Date().getTimezoneOffset())
  const fmt = (d: Date) => new Date(d).toLocaleTimeString("en-IN", { timeZone: 'Asia/Kolkata' })

  $: createdTs = fmt(createdAt);
  $: responseTs = responseAt ? fmt(responseAt) : null;
</script>

<div class="messages">
  <div class="timestamp">{createdTs}</div>
  {#each messages as m, i (i)}
    <MessageBubble role={m.role} message={m.message} />
  {/each}
  {#if response}
    <div class="timestamp">{responseTs}</div>
    <MessageBubble role={response.role} message={response.message} />
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
