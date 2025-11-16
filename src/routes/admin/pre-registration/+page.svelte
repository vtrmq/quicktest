<script lang="ts">
  import plus from '$lib/assets/svg/plus.svg?raw';
  import { Title, LinkBtn, NoneData } from '$lib/components';
  import type { PreRegistration } from '$lib/types'
  let { data } = $props();
  console.log(data)
  let preRegistrations:PreRegistration[] = data.preRegistrations ?? [];
</script>

<div class="container-teachers-registrations">

  <div>
    <div class="wr-title">
      <Title>Pre-registro</Title>
      <p>Docentes inscritos y por registrarse</p>
    </div>
    <LinkBtn href="/admin/new-teacher" --max-width="230px">{@html plus} Nuevo docente</LinkBtn>
  </div>

  {#if preRegistrations.length !== 0}
    <div class="wrapper">
      {#each preRegistrations as preRegistration: preRegistrations, i}
        <div>{i+1}. {preRegistration.name} {preRegistration.surnames}</div>
      {/each}
    </div>
  {/if}

</div>

{#if preRegistrations.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay docente pre registrado</NoneData>
  </div>
{/if}

<style>
.container-teachers-registrations {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1em;
}
.wr-none-data {
  padding: 3em 0;
}
.wr-title {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  margin-top: 1em;
  margin-bottom: 1.5em;
}
.wrapper {
  margin: 2em 0;
}
@media(min-width: 700px) {
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
}
</style>
