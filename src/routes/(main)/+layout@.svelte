<script lang="ts">
  import type { LayoutData } from './$types';
  import { DASHBOARDS, NAME_APP } from "$lib/utils";
  import { Header, Main, Footer, BoxNav } from '$lib/components'; // , Link
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

<Header --justify="center">
  <BoxNav>
    {#if root === undefined}
      <a class="link" href="/login">Iniciar sesión</a>
    {:else if root !== undefined}
      <!--Link href={DASHBOARDS[root]} fn={validatedLogin}>Entrar</Link-->
      <a class="link" href={DASHBOARDS[root]} onclick={validatedLogin}>Entrar</a>
    {/if}
    <a class="link" href="/register-student">Regístrate</a>
  </BoxNav>
</Header>

<Main>
  {@render children()}
</Main>

<Footer />

<style>
  .link {
    /*color: var(--color-link);*/
    font-family: var(--font-normal);
    text-transform: uppercase;
    font-size: 1.1em;
    text-decoration: none;
    color: #fff;
    font-weight: 600;
  }
</style>
