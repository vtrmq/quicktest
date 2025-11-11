<script>
  let { children } = $props()
</script>

<div class="wr-nav">
  {@render children()} 
</div>

<style>
  .wr-nav {
    display: flex;
    gap: 1em;
    align-items: center;
    margin-right: 0.5em;
  }
</style>
