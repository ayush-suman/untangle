<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import MessageBubble from "./MessageBubble.svelte";

  const { Story } = defineMeta({
    title: "MessageViewer/MessageBubble",
    component: MessageBubble
  });
</script>

<Story
  name="System (Centered)"
  args={{ role: "system", message: "You are a helpful assistant." }}
/>

<Story
  name="User (Left)"
  args={{ role: "user", message: "Hello. Show me my messages." }}
/>

<Story
  name="Assistant (Right) - Structured"
  args={{
    role: "assistant",
    message: { type: "structured", text: "Sure.", tokens: 12, meta: { ok: true } }
  }}
/>
