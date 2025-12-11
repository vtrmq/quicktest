<script lang="ts">
  import type { LayoutData } from './$types';
  import { DASHBOARDS, NAME_APP } from "$lib/utils";
  import { Header, Main, Footer, BoxNav, Link } from '$lib/components';
	let { data, children }: { data: LayoutData; children: any } = $props();
  let root = $state(data.user?.profile);

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

</script>

<svelte:head>
  <style>
  body { background-color: #fff; }
  </style>
  <title>Inicio - {NAME_APP}</title>
</svelte:head>

<Header>
  &nbsp;
  <BoxNav>
    {#if root === undefined}
      <Link href="/login">Iniciar</Link>
    {:else if root !== undefined}
      <Link href={DASHBOARDS[root]} fn={validatedLogin}>Entrar</Link>
    {/if}
    <Link href="/register-student">Regístrate</Link>
  </BoxNav>
</Header>

<Main>
  {@render children()}
</Main>

<Footer />
