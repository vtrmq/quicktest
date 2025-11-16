<script lang="ts">
  import type { LayoutData } from './$types';
  import { Header, Main, BoxNav, Link } from '$lib/components';
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
    <Header>
      &nbsp;
      <BoxNav>
        <Link href="/">Home</Link>
      </BoxNav>
    </Header>
    <Main>
      {@render children()}
    </Main>
  </div>
{/if}

<style>
.page-container {
  min-height: 100vh;
  /*background-image: var(--bg-gradient-movil);*/
  transition: var(--transition);
}
@media(min-width: 700px) {
  .page-container {
    /*background-image: var(--bg-gradient-pc);*/
    background: floralwhite;
  }
}
</style>
