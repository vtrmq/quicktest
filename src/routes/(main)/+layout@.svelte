<script lang="ts">
  import type { LayoutData } from './$types';
  import { DASHBOARDS } from "$lib/utils";
  import { Header, Main, Footer, BoxNav, Link } from '$lib/components';
  //import { onMount } from 'svelte';
	let { data, children }: { data: LayoutData; children: any } = $props();
  //let isVisible: boolean = $state(false);
  let root = $state(data.user?.profile);

  //console.log(data.home)
  async function validatedLogin() {
    try {
      const response = await fetch('/api/validate-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (!result.isLogged) {
        root = undefined;
      }
    } catch (error) {
      console.log(error)
    }
  }
  /*onMount(()=>{
    if (data.home) {
      isVisible = true;
    }
  })*/


</script>

<svelte:head>
  <style>
  body { background-color: #fff; }
  </style>
  <title>QuickTest</title>
</svelte:head>

<Header>
  &nbsp;
  <BoxNav>
    {#if root === undefined}
      <Link href="/login">Iniciar</Link>
    {:else if root !== undefined}
      <Link href={DASHBOARDS[root]} fn={validatedLogin}>Entrar</Link>
    {/if}
    <!--a href="/register">Regístrate</a-->
  </BoxNav>
</Header>

<Main>
  {@render children()}
</Main>

<Footer />
