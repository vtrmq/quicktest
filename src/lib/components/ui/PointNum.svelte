<script>
  let { children } = $props();
</script>

<div class="item">{@render children()}</div>

<style>
.item {
  font-size: 1em;
  font-family: var(--font-bold);
  width: 40px;
  height: 40px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #9382fd 0%, #6049EB 100%);
  color: #fff;
  box-shadow: 0 6px 12px rgb(188 160 239 / 74%);
}
</style>
