<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import MessageList from "./MessageList.svelte";

  const { Story } = defineMeta({
    title: "MessageViewer/MessageList",
    component: MessageList
  });
</script>

<Story
  name="Conversation"
  args={{
    messages: [
      { role: "system", message: "System notice: This is a demo." },
      { role: "user", message: "Hey" },
      { role: "assistant", message: "Hi. What do you need?" },
      { role: "user", message: { intent: "search", query: "SvelteKit storybook" } },
      { role: "assistant", message: { result: ["a", "b", "c"], count: 3 } }
    ]
  }}
/>
