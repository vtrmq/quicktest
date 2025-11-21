<script lang="ts">
import { DataFrame  } from '$lib/components';
import { NAME_APP } from '$lib/utils';
let { children } = $props();
</script>

<svelte:head>
  <title>Registro - {NAME_APP}</title>
</svelte:head>

<div class="page-container">
  <DataFrame width="500px">
    <h1 class="name-app">{NAME_APP}</h1>
    {@render children()}
  </DataFrame>
</div>

<style>
.name-app {
  font-family: var(--font-bold);
  text-align: center;
  margin-bottom: 1em;
  color: brown;
  font-weight: bold;
  font-size: 2.2em;
}
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
