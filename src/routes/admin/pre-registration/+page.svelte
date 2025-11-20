<script lang="ts">
  import plus from '$lib/assets/svg/plus.svg?raw';
  import { Title, LinkBtn, NoneData, PointNum, DataRow, BtnDelete, Dialog } from '$lib/components';
  import type { PreRegistration } from '$lib/types'
  let { data } = $props();
  let dialog = $state<Dialog | null>(null);
  console.log(data)
  let preRegistrations:PreRegistration[] = data.preRegistrations ?? [];

  function handleWinDelete(i: number) {
    console.log(i)
  }

  function handleWin() {
    dialog?.show();
  }

  function handleActionWin(e: string | undefined) {
    console.log(e)
  }

</script>

<Dialog bind:this={dialog} winEvent={handleActionWin} />

<div class="container-teachers-registrations">

  <div>
    <div class="wr-title">
      <Title>Pre-registro</Title>
      <p class="desc">Docentes inscritos y por registrarse</p>
  <button onclick={handleWin}>Win</button>
    </div>
    <LinkBtn href="/admin/new-teacher" --max-width="230px">{@html plus} Nuevo docente</LinkBtn>
  </div>

  {#if preRegistrations.length !== 0}
    <div class="wrapper">
      {#each preRegistrations as preRegistration: preRegistrations, i}
        <DataRow>
          <BtnDelete onclick={()=>handleWinDelete(i)} />
          <div class="row-pre">
            <PointNum>{i + 1}</PointNum>
            <div>
              <p class="name">{preRegistration.name} {preRegistration.surnames}</p>
              <div class="e-phone">
                <p>{preRegistration.email}</p>
                <p>{preRegistration.phone}</p>
              </div>
            </div>
          </div>
        </DataRow>
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
.desc {
  font-size: 1.4em;
  font-family: var(--font-normal);
}
.name {
  font-size: 1.6em;
  font-weight: 600;
  font-family: var(--font-normal);
}
.e-phone {
  font-size: 1.4em;
  font-family: var(--font-normal);
  color: #777777;
}
.row-pre {
  display: flex;
  align-items: center;
  gap: 1.7em;
}
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
  display: flex;
  flex-direction: column;
  gap: 1em;
}
@media(min-width: 700px) {
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
}
</style>
