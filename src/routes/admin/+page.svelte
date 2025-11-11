<script lang="ts">
  import type { PreRegistration } from '$lib/types'
  let { data } = $props();
  //console.log(data)
  let preRegistrations:PreRegistration[] = data.preRegistrations ?? [];
</script>

<h1>Welcome Admin</h1>
<div class="wrapper">
  {#each preRegistrations as preRegistration: preRegistrations, i}
    <div>{i+1}. {preRegistration.name} {preRegistration.surnames}</div>
  {/each}
</div>
<a href="/logout">Logout</a>

<style>
  .wrapper {
    margin: 2em 0;
  }
</style>
