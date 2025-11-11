<!--script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
</script>
<link rel="icon" href={favicon} />-->

<script lang="ts">
  import type { LayoutData } from './$types';
  import { DASHBOARDS } from "$lib/utils";
  import { Header, Main, BtnTheme, Footer, BoxNav, Link } from '$lib/components';
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

{#if data.home}
  <Header>
    &nbsp;
    <BoxNav>
      {#if root === undefined}
        <Link href="/login">Iniciar</Link>
      {:else if root !== undefined}
        <Link href={DASHBOARDS[root]} fn={validatedLogin}>Entrar</Link>
      {/if}
      <!--a href="/register">Regístrate</a-->
      <BtnTheme />
    </BoxNav>
  </Header>

  <Main>
    {@render children()}
  </Main>

  <Footer />
{/if}
