<script>
  let { children } = $props()
</script>
<header class="header">
  {@render children()} 
</header>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--height-header);
  }
</style>
