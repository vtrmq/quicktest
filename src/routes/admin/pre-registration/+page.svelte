<script lang="ts">
  import plus from '$lib/assets/svg/plus.svg?raw';
  import { Title, LinkBtn, NoneData, PointNum, DataRow, BtnDelete, Dialog, Toast } from '$lib/components';
  import type { PreRegistration } from '$lib/types'
  let { data } = $props();
  let dialog = $state<Dialog | null>(null);
  let preRegistrations:PreRegistration[] = $state(data.preRegistrations ?? []);
  let code: string = '';
  let posTeacher: number = -1;
  let toast = $state<Toast>();

  function handleWinDelete(i: number) {
    const teacher = preRegistrations.find((_, index) => i === index);
    code = teacher?.code as string
    posTeacher = i;
    dialog?.show({
      type: 'delete',
      message: `¿Quieres eliminar a ${teacher?.name} ${teacher?.surnames}?`,
    });
  }

  async function handleActionWin(e: string) {
    if (e === 'accept') {
      preRegistrations = preRegistrations.filter((_, index) => index !== posTeacher);
      const response = await fetch('/api/admin/delete-preregister', {
        method: 'POST',
        body: JSON.stringify({code}),
        headers: {
          'content-type': 'application/json'
        }
      });
      const resp = await response.json();
      toast?.view({
        type: 'success',
        message: resp.message,
      });
    }
  }

</script>

<Dialog bind:this={dialog} action={handleActionWin} />
<Toast bind:this={toast} />

<div class="container-teachers-registrations">

  <div>
    <div class="wr-title">
      <Title>Inscripciones</Title>
      <p class="desc">Docentes inscritos y por registrarse</p>
    </div>
    <LinkBtn href="/admin/new-teacher" --max-width-link-btn="230px">{@html plus} Nuevo docente</LinkBtn>
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
              <div class="email-phone">
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
    <NoneData>No hay docentes inscritos</NoneData>
  </div>
{/if}

<style>
.desc {
  font-size: 1em;
  font-family: var(--font-normal);
  line-height: 23px;
}
.name {
  font-size: 1.2em;
  font-weight: 600;
  font-family: var(--font-normal);
  margin-bottom: 0.2em;
}
.email-phone {
  font-size: 1.05em;
  font-family: var(--font-normal);
  color: #777777;
  text-transform: lowercase;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
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
