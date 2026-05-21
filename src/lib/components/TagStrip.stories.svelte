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
  args={{ tags: [], selectedTag: undefined }}
/>

<Story
  name="Few Tags"
  args={{ tags: ["run-001", "run-002", "alpha"], selectedTag: "run-002" }}
/>

<Story
  name="Many Tags (Scrollable)"
  args={{
    tags: Array.from({ length: 30 }, (_, i) => `tag-${String(i + 1).padStart(2, "0")}`),
    selectedTag: "tag-12"
  }}
/>