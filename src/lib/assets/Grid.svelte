<script lang="ts">
  export let columns: 1 | 2 | 3 | 4 = 2;
  export let gap = 14;
  export let className = "";
</script>

<div
  class={`grid ${className}`}
  style={`--gap:${gap}px;`}
  data-cols={columns}
>
  <slot />
</div>

<style>
  .grid {
    display: grid;
    gap: var(--gap);
  }

  .grid[data-cols="1"] { grid-template-columns: 1fr; }
  .grid[data-cols="2"] { grid-template-columns: 1fr; }

  @media (min-width: 800px) {
    .grid[data-cols="2"] { grid-template-columns: repeat(2, 1fr); }
    .grid[data-cols="3"] { grid-template-columns: repeat(3, 1fr); }
    .grid[data-cols="4"] { grid-template-columns: repeat(4, 1fr); }
  }
</style>
