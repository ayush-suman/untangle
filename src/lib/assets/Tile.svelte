<script lang="ts">
  export let title = "";
  export let body = "";
  export let className = "";
</script>

<div class={`tile ${className}`}>
  <div class="title">{title}</div>
  <div class="body">{body}</div>
  <slot />
</div>

<style>
  .tile {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 14px;
    padding: 16px;
    background: #fff;
  }

  .title {
    font-weight: 700;
    margin-bottom: 6px;
  }

  .body {
    opacity: 0.8;
    line-height: 1.45;
    font-size: 14px;
  }
</style>
