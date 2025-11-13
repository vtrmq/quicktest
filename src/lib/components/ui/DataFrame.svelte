<script>
  let { children, width = 'auto' } = $props()
</script>

<div class="container" style='max-width: {width};'>
  {@render children()} 
</div>

<style>
  .container {
    background: #fff;
    width: 100%;
  }
  @media(min-width: 700px) {
    .container {
      padding: 1.8em;
      border-radius: var(--border-radius);
      box-shadow: rgb(32 36 39 / 5%) 0px 12px 27px -5px, #353e432e 0px 3px 20px 0px;
    }
  }
</style>
