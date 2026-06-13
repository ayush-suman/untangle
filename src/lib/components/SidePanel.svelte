<script lang="ts">
  import { fly } from "svelte/transition";

  let {
    title,
    data,
    onClose
  }: {
    title: string;
    data: unknown;
    onClose: () => void;
  } = $props();

  let pretty = $derived(
    data === undefined || data === null
      ? ""
      : JSON.stringify(data, null, 2)
  );
</script>

<div class="panel" transition:fly={{ x: 620, duration: 200 }}>
  <div class="panel-header">
    <span class="panel-title">{title}</span>
    <button class="close" onclick={onClose} aria-label="Close panel">×</button>
  </div>
  <div class="panel-body">
    {#if pretty}
      <pre>{pretty}</pre>
    {:else}
      <div class="empty">No data.</div>
    {/if}
  </div>
</div>

<style>
  .panel {
    position: absolute;
    top: 0;
    right: 44px;
    bottom: 0;
    width: 640px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    background: #111114;
    border-left: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: -8px 0 24px rgba(0, 0, 0, 0.45);
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .panel-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #f3f3f3;
  }

  .close {
    border: none;
    background: transparent;
    color: #f3f3f3;
    font-size: 1.3rem;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
    opacity: 0.7;
    transition: 0.1s;
  }

  .close:hover {
    opacity: 1;
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 12px 14px;
  }

  pre {
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8rem;
    line-height: 1.5;
    color: #e6e6e6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .empty {
    opacity: 0.7;
    font-size: 0.85rem;
  }
</style>
