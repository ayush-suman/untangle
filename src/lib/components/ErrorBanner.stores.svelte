<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ErrorBanner from "./ErrorBanner.svelte";

  const { Story } = defineMeta({
    title: "MessageViewer/ErrorBanner",
    component: ErrorBanner
  });
</script>

<Story name="Hidden" args={{ error: null }} />
<Story name="Visible" args={{ error: "Failed to load messages (demo error)." }} />
