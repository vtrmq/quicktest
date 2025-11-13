<script>
  let { children, fixed = false } = $props()
</script>
<main class:fixed={fixed}>
  {@render children()} 
</main>

<style>
  .fixed {
    position: relative;
    top: var(--height-header);
    width: 100%;
  }
</style>

