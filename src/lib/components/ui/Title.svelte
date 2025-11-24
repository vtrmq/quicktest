<script>
  let { children } = $props()
</script>

<h1 class="h-title">{@render children()}</h1>

<style>
  .h-title {
    font-size: 1.8em;
    font-family: var(--font-bold);
    width: fit-content;
    color: var(--color-title);
  }
</style>
