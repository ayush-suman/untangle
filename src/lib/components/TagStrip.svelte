<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let tags: string[] = [];
  export let activeTag: string | null = null;

  const dispatch = createEventDispatcher<{ select: { tag: string } }>();
  function pick(tag: string) {
    dispatch("select", { tag });
  }
</script>

<div class="tagstrip" aria-label="Tags">
  {#if tags.length === 0}
    <div class="tag tag--empty">No tags yet</div>
  {:else}
    {#each tags as t}
      <button
        class="tag {activeTag === t ? 'tag--active' : ''}"
        on:click={() => pick(t)}
        title={t}
      >
        {t}
      </button>
    {/each}
  {/if}
</div>

<style>
  .tagstrip {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding-bottom: 6px;
  }

  .tagstrip::-webkit-scrollbar {
    height: 8px;
  }
  .tagstrip::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.18);
    border-radius: 999px;
  }

  .tag {
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.06);
    color: #fff;
    padding: 8px 12px;
    border-radius: 999px;
    cursor: pointer;
    flex: 0 0 auto;
    max-width: 260px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .tag--active {
    border-color: rgba(255,255,255,0.45);
    background: rgba(255,255,255,0.14);
  }

  .tag--empty {
    cursor: default;
    opacity: 0.8;
  }
</style>