<script lang="ts">
import { deserialize } from '$app/forms';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import { Title, NoneData, OptionSelect, Toast, Select, Input, LinkBack } from '$lib/components'; // , Dialog
import { extractParams } from "$lib/utils";

let { data } = $props();
let toast = $state<Toast>();
let course = $state(data.course);
let students = $state(data.students);
let subjects = $state(data.subjects);
let date_start = $state(data.dateStart);
let date_end = $state(data.dateEnd);
let subject = $state(data.subjectId);

async function handleActionEnabled(index: number) {
  const studentId = students[index].id;
  const formData = new FormData();
  const blocked = students[index].blocked === 'S' ? 'N' : 'S'; 
  formData.append('studentId', studentId);
  formData.append('blocked', blocked);
  const response = await fetch('?/blocked', {
    method: 'POST',
    body: formData
  });
  const responseText = await response.text();
  const result = deserialize(responseText);
  if (result.type === "redirect") {
    goto("/");
  } else if (result.type === "success") {
    students[index].blocked = blocked; 
    toast?.view({
      type: '',
      message: `Estudiante ${blocked === 'S' ? 'habilitado' : 'inhabilitado'}`,
      time: 3000
    });
  } else if (result.type === "failure") {
    toast?.view({
      type: '',
      message: result.data?.message,
      time: 3000
    });
  }
}

function handleViewStatistic(index: number) {
  if (date_start?.length === 0) {
    toast?.view({
      type: '',
      message: "Selecciona la fecha incial",
      time: 3000
    });
    return;
  } else if (date_end?.length === 0) {
    toast?.view({
      type: '',
      message: "Selecciona la fecha final",
      time: 3000
    });
    return;
  } else if (subject === 0) {
    toast?.view({
      type: '',
      message: "Selecciona una asignatura",
      time: 3000
    });
    return;
  }
  const studentId = students[index].id;
  const course = extractParams(page.url.href, ["courseId"]);
  goto(`/teacher/student/statistic?courseId=${course.courseId}&studentId=${studentId}&dateStart=${date_start}&dateEnd=${date_end}&subjectId=${subject}`);
}

</script>

<!--Dialog bind:this={dialog} action={handleActionDelete} /-->
<Toast bind:this={toast} />

<div class="container-teachers-registrations">

  <div class="wr-title">
    <LinkBack href="/teacher/course">Mis cursos</LinkBack>
    <Title>Estudiantes</Title>
    <p class="course">
      {course.course}
    </p>

    {#if students.length !== 0}
      <p class="desc">Busca la estadística del estudiante seleccionando una asignatura.</p>
      <div>
        <div class="wr-inputs-date">
          <Input type="date" label="Fecha incio" bind:value={date_start} />
          <Input type="date" label="Fecha final" bind:value={date_end} />
        </div>
        <div class="wr-links">
          <Select --bg-select="#ffffff" label="Asignaturas" bind:value={subject}>
            <option value={0}>Seleccionar asignatura</option>
            {#each subjects as subject}
              <option value={subject.subject_id}>{subject.subject}</option>
            {/each}
          </Select>
        </div>
      </div>
    {:else}
      <p class="desc">Busca la estadística del estudiante.</p>
    {/if}
  </div>

  {#if students.length !== 0}
    <div class="wrapper">
      
      {#each students as row, i}
        <div>
          <div class="row-teacher">
            <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === students.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb" class:border-left={i !== 0 && i + 1 <= students.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < students.length}>&nbsp;</div>
              </div>
            </div>
            <div class="box-course">
              <div class="info-course"><p class="name-student" class:red={row.blocked === 'S'}>{row.name} {row.surnames}</p></div>
              <button class="btn-statistics" onclick={()=>handleViewStatistic(i)}>Estadísticas</button>
              <div class="box-select">
                <OptionSelect>
                  <button onclick={()=>handleActionEnabled(i)}>
                    {#if row.blocked === 'N'}
                      {@html pencil} <span>Bloquear</span>
                    {:else if row.blocked === 'S'}
                      {@html pencil} <span>Desbloquear</span>
                    {/if}
                  </button>
                </OptionSelect>
              </div>
            </div>
          </div>
        </div>
      {/each}

    </div>
  {/if}

</div>

{#if students.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay estudiantes en el curso</NoneData>
  </div>
{/if}

<style>
.name-student.red {
  color: red;
}
.wr-inputs-date {
  display: flex;
  gap: 1em;
}
.course {
  font-family: var(--font-normal);
  font-weight: 800;
  font-size: 1.1em;
}
:global {
  .button-search > svg {
    width: 23px;
    color: lightslategrey;
    stroke-width: 3px;
  }
}
.wr-links {
  display: flex;
  align-items: center;
  gap: 1em;
}
.box-select {
  display: inline-flex;
  position: absolute;
  top: 10px;
  right: 10px;
}
:global {
  .svg-subject > svg {
    width: 14px;
    color: #fff;
    stroke-width: 3px;
  }
}
.btn-statistics {
  padding: 0.4em 0.8em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  font-family: var(--font-normal);
  background: #cae2cf;
  box-shadow: #97bb9e 0px 4px 0px 0px;
}
.box-course {
  padding: 1em 0;
  position: relative;
}
.info-course {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  margin-bottom: 0.3em;
}
.circle-green {
  background: #a5fbcf;
  width: 18px;
  height: 18px;
  border-radius: 60px;
  box-shadow: rgb(17 17 26 / 38%) 0px 4px 15px, rgb(17 17 26 / 34%) 0px 0px 6px;
}
.border-left {
  border-left: 1px solid #4ca1a1;
}
.point {
  font-size: 1em;
  font-family: var(--font-bold);
  width: 40px;
  height: 40px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #7bd5d5 0%, #35a3a3 100%);
  color: #fff;
  box-shadow: 0 6px 12px rgb(103 185 185);
  position: absolute;
  outline: none;
  border: none;
}
.box-a {
  height: 100%;
  width: 50%;
}
.box-bb {
  height: 50%;
}
.box-b {
  height: 50%;
}
.box-point {
  display: flex;
  background: #a0e7e7;
  width: 60px;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
}
.border-top-left {
  border-top-left-radius: 8px;
}
.border-bottom-left {
  border-bottom-left-radius: 8px;
}
.row-teacher {
  display: grid;
  align-items: center;
  gap: 1em;
  grid-template-columns: 60px 1fr;
}
.desc {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
}
.name-student {
  font-size: 1.3em;
  font-weight: 800;
  font-family: var(--font-normal);
  margin: 4px 0;
  color: #353535;
  padding-right: 2em;
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
  border-radius: 8px;
  background: #f0ffff8a;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
}
@media(min-width: 800px) {
  .btn-statistics {
    font-size: 0.8em;
    transition: var(--transition);
  }
  .btn-statistics:hover {
    background: #b6dbbe;
  }
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
  .desc {
    font-size: 1em;
  }
  .wr-title {
    position: sticky;
    top: 105px;
    height: fit-content;
    margin-top: 25px;
  }
}
</style>
