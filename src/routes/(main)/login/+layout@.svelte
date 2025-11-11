<script lang="ts">
  import type { LayoutData } from './$types';
  import { Header, Main, BtnTheme, BoxNav, Link } from '$lib/components';
	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<svelte:head>
  <title>Login</title>	
</svelte:head>

{#if data.login}
  <div class="page-container">
    <Header>
      &nbsp;
      <BoxNav>
        <Link href="/">Home</Link>
        <BtnTheme />
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
  background-image: var(--bg-gradient-movil);
  transition: var(--transition);
}
@media(min-width: 700px) {
  .page-container {
    background-image: var(--bg-gradient-pc);
  }
}
</style>
