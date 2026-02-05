<script lang="ts">
  export let href: string | null = null;
  export let variant: "primary" | "ghost" = "primary";
  export let className = "";
  export let target: string | null = null;
  export let rel: string | null = null;
</script>

{#if href}
  <a
    class={`btn ${variant} ${className}`}
    href={href}
    target={target ?? undefined}
    rel={rel ?? undefined}
  >
    <slot />
  </a>
{:else}
  <button class={`btn ${variant} ${className}`}>
    <slot />
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid transparent;
    transition: transform 0.05s ease, background 0.15s ease, border-color 0.15s ease;
    user-select: none;
  }

  .btn:active {
    transform: translateY(1px);
  }

  .primary {
    background: #111;
    color: #fff;
  }

  .primary:hover {
    background: #000;
  }

  .ghost {
    background: transparent;
    color: #111;
    border-color: rgba(0, 0, 0, 0.15);
  }

  .ghost:hover {
    border-color: rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.03);
  }
</style>
