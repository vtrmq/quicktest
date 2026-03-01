<script lang="ts">
import plus from '$lib/assets/svg/plus.svg?raw';
import { Title, LinkBtn, NoneData, PointNum, Dialog, Toast, Pagination, OptionSelect } from '$lib/components';
import trash from '$lib/assets/svg/trash.svg?raw'
import pencil from '$lib/assets/svg/pencil.svg?raw';
import shieldCheck from '$lib/assets/svg/shield-check.svg?raw'
import shieldAlert from '$lib/assets/svg/shield-alert.svg?raw'

type PaginationResult = {
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
}
let pagination: PaginationResult = $state({limit: 0, page: 0, totalCount: 0, totalPages: 0});

let { data } = $props();
let dialog = $state<Dialog | null>(null);
let teacherId: number = 0;
let posTeacher: number = -1;
let toast = $state<Toast>();

let teachersDerived = $derived(data.teachers ?? []);
let teachers = $state<any[]>([]);

$effect(() => {
  teachers = teachersDerived;
  pagination = data.pagination as PaginationResult;
});

function handleActionShowWin(i: number) {
  const teacher = teachers.find((_: any, index: number) => i === index);
  teacherId = teacher.teacher.id;
  posTeacher = i;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar a ${teacher.teacher.name} ${teacher.teacher.surnames}?`,
  });
}

async function handleActionWin(e: string) {
  if (e === 'accept') {
    teachers = teachers.filter((_: any, index: number) => index !== posTeacher);
    const response = await fetch('/api/admin/delete-preregister', {
      method: 'POST',
      body: JSON.stringify({teacherId}),
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

async function handleEnableDisabled(index: number) {
  const blocked = teachers[index].teacher.blocked === 'N' ? 'S' : 'N';
  const teacherId = teachers[index].teacher.id.toString();

  const formData = new FormData();
  formData.append('teacher_id', teacherId);
  formData.append('blocked', blocked);

  const response = await fetch('?/blocked', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    teachers[index].teacher.blocked = blocked;
    toast?.view({
      type: 'success',
      message: blocked === 'N' ? 'Docente habilitado' : 'Docente bloqueado',
      time: 3000
    });
  } else {
    const errData = await response.json();
    toast?.view({
      type: 'success',
      message: errData.error.message,
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

  {#if teachers.length !== 0}
    <div class="wrapper">
      {#each teachers as teacher, i}
        <div class="row">
          <div class="row-pre">
            <PointNum>{i + 1}</PointNum>
            <div class="inf">
              <p class="name" class:blocked={teacher.teacher.blocked === 'S'}>{teacher.teacher.name} {teacher.teacher.surnames}</p>
              <div class="email-phone">
                <p>{teacher.teacher.email}</p>
                <p>{teacher.teacher.phone}</p>
              </div>
            </div>
          </div>
          <div class="box-select">
            <OptionSelect>
              <button onclick={()=>handleEnableDisabled(i)}>
                {#if teacher.teacher.blocked === 'N'}
                  {@html shieldCheck} 
                  <span>Bloquear</span>
                {:else}
                  {@html shieldAlert} 
                  <span>Desbloquear</span>
                {/if}
              </button>
              <a href="/admin/list-teachers/edit?teacherId={teacher.teacher.id}">{@html pencil} <span>Editar</span></a>
              <button onclick={()=>handleActionShowWin(i)}>{@html trash} <span>Eliminar docente</span></button>
            </OptionSelect>
          </div>
        </div>
      {/each}
      <div>
        {#if pagination.totalPages > 1}
          <Pagination page={pagination.page} totalPages={pagination.totalPages} />
        {/if}
      </div>
    </div>
  {/if}

</div>

{#if teachers.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay docentes registrados</NoneData>
  </div>
{/if}

<style>
.blocked {
  background: #d30475;
  color: #fff;
}
.inf {
  padding-right: 1.5em;
}
.box-select {
  display: inline-flex;
  position: absolute;
  top: 10px;
  right: 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 1em;
  position: relative;
  border-radius: 8px;
  background: #f0ffff8a;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
  padding: 1em;
}
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
  gap: 1em;
}
.container-teachers-registrations {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1em 0;
}
.wr-none-data {
  padding: 3em 0;
}
.wr-title {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  margin-top: 0.8em;
  margin-bottom: 1.5em;
}
.wrapper {
  margin: 1em 0;
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
