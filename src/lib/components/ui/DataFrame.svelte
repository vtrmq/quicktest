<script>
  let { children, width = 'auto' } = $props()
</script>

<div class="container" style='max-width: {width};'>
  {@render children()} 
</div>

<style>
  .container {
    width: 100%;
  }
  @media(min-width: 700px) {
    .container {
      background: #fff;
      padding: 1.8em;
      border-radius: var(--border-radius);
      box-shadow: rgb(32 36 39 / 0%) 0px 12px 27px -5px, #353e431c 0px 3px 20px 0px;
    }
  }
</style>
