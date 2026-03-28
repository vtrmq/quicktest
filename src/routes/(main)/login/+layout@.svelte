<script lang="ts">
  import type { LayoutData } from './$types';
  import { Main, BoxNav } from '$lib/components'; // Header, Link
  import { onMount } from 'svelte';
  let isVisible: boolean = $state(false);
	let { data, children }: { data: LayoutData; children: any } = $props();

  onMount(()=>{
    if (data.login) {
      isVisible = true;
    }
  })
</script>

<svelte:head>
  <title>Login - QuickTest</title>	
</svelte:head>

{#if isVisible}
  <div class="page-container">
    <header>
      <BoxNav>
        <a class="link" href="/">Home</a>
      </BoxNav>
    </header>
    <Main>
      {@render children()}
    </Main>
  </div>
{/if}

<style>
header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: var(--height-header);
  margin-bottom: 1em;
}
  .link {
    font-family: var(--font-normal);
    text-transform: uppercase;
    font-size: 1.1em;
    text-decoration: none;
    color: #2d2c2c;
    font-weight: 600;
  }
.page-container {
  background: #fff;
}
@media(min-width: 700px) {
  .page-container {
    min-height: 100vh;
    transition: var(--transition);
    /*background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%);*/
    background-image: radial-gradient(at 0% 0%, rgba(0, 116, 204, 0.25) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 168, 34, 0.25) 0px, transparent 50%);
  }
}
</style>
