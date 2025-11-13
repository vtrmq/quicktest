<script>
  let { children, href = '/admin', fn = ()=>{} } = $props()
  function onClick() {
    fn();
  }
</script>

<a class="link" {href} onclick={onClick}>
  {@render children()} 
</a>

<style>
  .link {
    color: var(--color-link);
    font-family: var(--font-normal);
    font-size: 1.1em;
    text-decoration: none;
  }
  .link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 1px;
  }
</style>
