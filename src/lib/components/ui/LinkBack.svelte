<script>
  import svgArrowLeft from '$lib/assets/svg/arrow-left.svg?raw';
  let { children, href = '/' } = $props()
</script>

<a class="link" {href}>
  <span class="arrow-left">{@html svgArrowLeft}</span>
  {@render children()} 
</a>

<style>
:global(.arrow-left > svg) {
  width: 26px;
}
.arrow-left {
  display: flex;
}
.link {
  color: var(--color-link);
  font-family: var(--font-normal);
  font-size: 1.6em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
@media(min-width: 700px) {
  .link {
    font-size: 1.3em;
  }
}
</style>
