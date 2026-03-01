<script>
  let { children } = $props();
</script>

<div class="data-row">
  {@render children()}
</div>

<style>
.data-row {
  padding: 1em;
  background: #fff;
  border-radius: 8px;
  filter: drop-shadow(0px 4px 16px rgba(155, 155, 155, 0.1));
  position: relative;
}
</style>
