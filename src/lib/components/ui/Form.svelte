<script>
  let { children, width = 'auto' } = $props()
</script>

<div class="container-form" style='max-width: {width};'>
  {@render children()} 
</div>

<style>
  .container-form {
    background: var(--bg-form);
    width: 100%;
    padding: 1.8em;
    border-radius: var(--border-radius);
    box-shadow: rgb(32 36 39 / 5%) 0px 12px 27px -5px, #353e432e 0px 3px 20px 0px;
    transition: var(--transition);
  }
</style>
