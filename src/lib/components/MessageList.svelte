<script lang="ts">
  import type { ChatMessage } from "$lib/types";
  import MessageBubble from "./MessageBubble.svelte";

  export let messages: ChatMessage[] = [];
</script>

<div class="messages">
  {#each messages as m, i (i)}
    <MessageBubble role={m.role} message={m.message} />
  {/each}
</div>

<style>
  .messages {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
