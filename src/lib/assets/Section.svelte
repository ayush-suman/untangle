<script lang="ts">
  export let className = "";
  export let tone: "plain" | "muted" = "plain";
</script>

<section class={`section ${tone} ${className}`}>
  <slot />
</section>

<style>
  .section {
    padding: 56px 0;
  }

  @media (min-width: 900px) {
    .section {
      padding: 80px 0;
    }
  }

  .muted {
    background: rgba(0, 0, 0, 0.03);
  }
</style>
