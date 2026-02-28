<script lang="ts">
let { children } = $props();
</script>

<header class="header">
  {@render children()}
</header>

<style>
.header {
  position: fixed;
  height: var(--height-header);
  background: var(--bg-header);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5em;
  z-index: 12;
}
</style>
