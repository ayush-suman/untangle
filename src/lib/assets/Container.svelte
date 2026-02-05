<script lang="ts">
  export let maxWidth: "sm" | "md" | "lg" | "xl" = "lg";
  export let className = "";

  const map: Record<typeof maxWidth, string> = {
    sm: "max-width: 720px;",
    md: "max-width: 900px;",
    lg: "max-width: 1100px;",
    xl: "max-width: 1280px;"
  };
</script>

<div
  class={`container ${className}`}
  style={`${map[maxWidth]}`}
>
  <slot />
</div>

<style>
  .container {
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
  }

  @media (min-width: 900px) {
    .container {
      padding: 0 28px;
    }
  }
</style>
