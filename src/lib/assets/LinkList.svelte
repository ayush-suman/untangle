<script lang="ts" context="module">
  export type LinkItem = {
    label: string;
    href: string;
    note?: string;
    external?: boolean;
  };

  export let items: LinkItem[] = [];
  export let className = "";
</script>

<div class={`list ${className}`}>
  {#each items as item}
    <a
      class="row"
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
    >
      <span class="label">{item.label}</span>
      {#if item.note}
        <span class="note">{item.note}</span>
      {/if}
    </a>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    text-decoration: none;
    color: inherit;
    background: #fff;
  }

  .row:hover {
    border-color: rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.02);
  }

  .label {
    font-weight: 600;
  }

  .note {
    font-size: 13px;
    opacity: 0.75;
  }
</style>
