<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>Page not found - Admin</title>
</svelte:head>

<div class="error-container">
  <h1>{page.error?.message}</h1>
  <div class="error-content">
    <h2>Página no encontrada</h2>
  </div>
</div>

<style>
  .error-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
  }
</style>
