<script lang="ts">
import { deserialize } from '$app/forms';
import plus from '$lib/assets/svg/plus.svg?raw';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw'
import shieldCheck from '$lib/assets/svg/shield-check.svg?raw'
import shieldX from '$lib/assets/svg/shield-x.svg?raw'
import { generateCryptographicKey } from '$lib/utils';
import { Title, NoneData, LinkBtn, OptionSelect, Toast, Dialog } from '$lib/components';

let { data } = $props();
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let posCourse: number = 0;

type Subjects = {
  subject: string;
}

type Courses = {
  code: string;
  course: string;
  course_id: number;
  subjects: Subjects[];
  total_students: number;
  total_subjects: number;
};

let courses: Courses[] = $state(data.courses);

function handleActionShowWin(index: number) {
  const course = courses[index].course;
  posCourse = index;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar el curso: ${course}?`,
  });
}

async function handleCode(index: number) {

  const courseId: string = courses[index].course_id.toString();

  if (courses[index].code.length !== 0) {

    const formData = new FormData();
    formData.append('course_id', courseId);
    formData.append('action', 'clear');
    formData.append('code', '');

    const response = await fetch('?/code', {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    const result = deserialize(responseText);

    if (result.type === 'success' || result.type === 'failure') {
      courses[index].code = result.type === 'success' ? '' : courses[index].code;
      const responseData = result.data; 
      toast?.view({
        type: result.type,
        message: responseData?.message,
        time: 3000
      });
    }

  } else if(courses[index].code.length === 0) {

    const code = generateCryptographicKey();
    const formData = new FormData();
    formData.append('course_id', courseId);
    formData.append('action', 'create');
    formData.append('code', code);

    const response = await fetch('?/code', {
      method: 'POST',
      body: formData
    });
    const responseText = await response.text();
    const result = deserialize(responseText);

    if (result.type === 'success' || result.type === 'failure') {
      courses[index].code = result.type === 'success' ? code : '';
      const responseData = result.data; 
      toast?.view({
        type: result.type,
        message: responseData?.message,
        time: 3000
      });
    }

  }
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {
    const courseId = courses[posCourse].course_id.toString();
    const formData = new FormData();
    formData.append('course_id', courseId);

    const response = await fetch('?/visible', {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    const result = deserialize(responseText);

    if (result.type === 'success' || result.type === 'failure') {
      if (result.type === 'success') {
        courses = courses.filter((_, i) => i !== posCourse);
      }
      const responseData = result.data; 
      toast?.view({
        type: result.type,
        message: responseData?.message,
        time: 3000
      });
    }

  }
}

</script>

<Dialog bind:this={dialog} action={handleActionDelete} />
<Toast bind:this={toast} />

<div class="container-teachers-registrations">

  <div class="wr-info-page">
    <Title>Mis cursos</Title>
    <p class="desc">Crea tus cursos y las asignaturas que impartes en cada uno de tus cursos</p>
    <LinkBtn href="/teacher/course/new" --max-width-link-btn="230px">{@html plus} Crear curso</LinkBtn>
  </div>

  {#if courses.length !== 0}
    <div class="wrapper">
      
      {#each courses as row, i}
        <div>
          <div class="row-teacher">
            <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === courses.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb" class:border-left={i !== 0 && i + 1 <= courses.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < courses.length}>&nbsp;</div>
              </div>
            </div>
            <div class="box-course">
              <div class="info-course">
                <div class="container-course-code">
                  <p class="course">{row.course}</p><span class="code">{row.code}</span>
                </div>
                <div class="box-select">
                  <OptionSelect>
                    <button onclick={()=>handleCode(i)}>
                      {#if row.code.length === 0}
                        {@html shieldCheck} 
                        <span>Generar código</span>
                      {:else}
                        {@html shieldX} 
                        <span>Eliminar código</span>
                      {/if}
                    </button>
                    <a href="/teacher/course/edit?courseId={row.course_id}">{@html pencil} <span>Editar</span></a>
                    <button onclick={()=>handleActionShowWin(i)}>{@html trash} <span>Eliminar curso</span></button>
                  </OptionSelect>
                </div>
              </div>
              <div class="container-links">
                <a class="link-student" href="/teacher/student?courseId={row.course_id}">Estudiantes</a>
              </div>
              <div class="info-pay">
                <div class="box-subjects"> <!--  class:view-subjects={`subj-${i}` === subjId} -->
                  {#each row.subjects as subject, id}
                    <div>{id + 1}. {subject.subject}</div>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}

    </div>
  {/if}

</div>

{#if courses.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay datos para mostrar</NoneData>
  </div>
{/if}

<style>
.link-student {
  font-family: var(--font-normal);
  text-decoration: none;
  color: #004f8d;
  font-size: 1em;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
.container-links {
  display: flex;
  gap: 0.4em;
  width: 100%;
  padding: 5px 0;
  align-items: center;
  margin-bottom: 0.5em;
}
.container-course-code {
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
.box-subjects {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0 1em 0.5em 0;
  color: brown;
  font-weight: 600;
  font-size: 0.95em;
}
.box-course {
  padding: 1em 0;
  position: relative;
}
.code {
  font-family: var(--font-normal);
  font-size: 1.1em;
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
  top: 20px;
}
.box-a {
  height: 100%;
  width: 50%;
}
.box-bb {
  height: 30%;
}
.box-b {
  height: 70%;
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
.course {
  font-size: 1.3em;
  font-weight: 800;
  font-family: var(--font-normal);
  margin: 4px 0;
  color: #407777;
}
.info-pay {
  font-size: 1.1em;
  font-family: var(--font-normal);
  color: #777777;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.container-teachers-registrations {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
.wr-none-data {
  padding: 3em 0;
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
  .link-student {
    font-size: 0.9em;
  }
  .box-subjects {
    font-size: 1em;
    padding: 0 1em 0.5em 0;
  }
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
  .info-pay {
    font-size: 0.9em;
  }
  .desc {
    font-size: 1em;
  }
}
</style>
