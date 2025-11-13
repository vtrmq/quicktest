<script>
  let { children, href = '/' } = $props()
</script>

<a class="link" {href}>
  {@render children()}
</a>

<style>
:global(.icon) {
  width: 26px;
}
.link {
  gap: 0.5em;
  color: #fff;
  font-family: var(--font-bold);
  font-size: 1.1em;
  text-decoration: none;
  background: #65c15d;
  width: 100%;
  height: 50px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.link:hover {
  background: #62b15c;
}
@media(min-width: 500px) {
  .link {
    max-width: var(--max-width);
    font-size: 1em;
  }
}
</style>
