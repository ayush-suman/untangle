<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import TagStrip from "./TagStrip.svelte";

  const { Story } = defineMeta({
    title: "MessageViewer/TagStrip",
    component: TagStrip
  });
</script>

<Story
  name="Empty"
  args={{ tags: [], activeTag: null }}
/>

<Story
  name="Few Tags"
  args={{ tags: ["run-001", "run-002", "alpha"], activeTag: "run-002" }}
/>

<Story
  name="Many Tags (Scrollable)"
  args={{
    tags: Array.from({ length: 30 }, (_, i) => `tag-${String(i + 1).padStart(2, "0")}`),
    activeTag: "tag-12"
  }}
/>