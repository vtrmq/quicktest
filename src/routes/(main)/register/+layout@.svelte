<script lang="ts">
  import { DataFrame  } from '$lib/components';
  let { children } = $props();
</script>

<div class="page-container">
  <DataFrame width="400px">
    {@render children()}
  </DataFrame>
</div>

<style>
.page-container {
  min-height: 100vh;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 4em 1em;
}
@media(min-width: 700px) {
  .page-container {
    background: floralwhite;
  }
}
</style>
