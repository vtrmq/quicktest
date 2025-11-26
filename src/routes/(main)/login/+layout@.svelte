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
  background: #fff;
}
@media(min-width: 700px) {
  .page-container {
    min-height: 100vh;
    transition: var(--transition);
    background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%);
  }
}
</style>
