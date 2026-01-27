<script lang="ts">
  export let error: string | null = null;
</script>

{#if error}
  <div class="error">{error}</div>
{/if}

<style>
  .error {
    margin-bottom: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(182, 27, 27, 0.25);
    border: 1px solid rgba(182, 27, 27, 0.45);
    max-width: 900px;
    color: #fff;
  }
</style>