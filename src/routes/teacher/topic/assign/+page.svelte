<script lang="ts">
import { deserialize } from '$app/forms';
import check from '$lib/assets/svg/check.svg?raw';
import plus from '$lib/assets/svg/plus.svg?raw';
import minus from '$lib/assets/svg/minus.svg?raw';
import { Title, NoneData, Toast, Dialog, LinkBack } from '$lib/components';

let { data } = $props();
let subjId: string = $state('');
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let topicId = data.topicId
let courseId: number = 0;
let subjectId: number = 0;
let indexCourse: number = 0;
let indexSubject: number = 0;

type Result = {
  type: string;
  message?: string;
  data?: {message: string; type: string; topic_subject_id: number}
};

type Subjects = {
  subject_id: number;
  topic_subject_id: number;
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

function handleViewSubject(i: number) {
  if (subjId === '' || subjId !== `subj-${i}`) {
    subjId = `subj-${i}`;
  } else {
    subjId = '';
  }
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {

    const response = await fetch('?/assign', {
      method: 'POST',
      body: JSON.stringify({topicId, courseId, subjectId})
    })

    const responseText = await response.text();
    const result: Result = deserialize(responseText);
    if (result.type === 'success') {
      courses[indexCourse].subjects[indexSubject].topic_subject_id = Number(result.data?.topic_subject_id);
      toast?.view({
        type: result.type,
        message: result.data?.message,
        time: 2400
      });
    }
    
  }
}


async function handleSelectSubject(_indexCourse: number, _indexSubject: number) {
  indexCourse = _indexCourse;
  indexSubject = _indexSubject;
  courseId = courses[indexCourse].course_id;
  subjectId = courses[indexCourse].subjects[indexSubject].subject_id;
  const topicSubjectId = courses[indexCourse].subjects[indexSubject].topic_subject_id;

  if (topicSubjectId === null) {
    const response = await fetch('?/assign', {
      method: 'POST',
      body: JSON.stringify({topicId, courseId, subjectId})
    })

    const responseText = await response.text();
    const result: Result = deserialize(responseText);
    if (result.type === 'success') {
      courses[indexCourse].subjects[indexSubject].topic_subject_id = Number(result.data?.topic_subject_id);
      toast?.view({
        type: result.type,
        message: result.data?.message,
        time: 2400
      });
    }
  } else {
    dialog?.show({
      type: 'delete',
      message: `¿Quieres eliminar el tema de la asignatura seleccionada?`,
    });
  }
}

</script>

<Dialog bind:this={dialog} action={handleActionDelete} />
<Toast bind:this={toast} />

<div class="container-teachers-registrations">

  <div class="wr-title">
    <LinkBack href="/teacher/topic">Temas</LinkBack>
    <Title>Asignar tema</Title>
    <p class="topic">{data.topic}</p>
    <p class="desc">Selecciona las asignaturas a las que quieres asignar el tema.</p>
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
              <div class="info-course"><p class="course">{row.course}</p></div>
              <div class="info-p">
                <div>
                  <div>
                    <button onclick={()=>handleViewSubject(i)} class="btn-view-subjects">
                      <span class="svg-subject">
                        {#if `subj-${i}` === subjId}
                          {@html minus}
                        {:else}
                          {@html plus}
                        {/if}
                      </span> 
                      Asignaturas: {row.total_subjects}</button>
                  </div>
                  <div class="box-subjects" class:view-subjects={`subj-${i}` === subjId}>
                    {#each row.subjects as subject, id}
                      <div class="row-subject">
                        <button class="btn-subject" onclick={()=>handleSelectSubject(i, id)}>
                          <div class="btn-check">
                            {#if subject.topic_subject_id}
                              {@html check}
                            {:else}
                              &nbsp;
                            {/if}
                          </div>  
                          {subject.subject}
                        </button>
                      </div>
                    {/each}
                  </div>
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
.btn-subject {
  display: flex;
  align-items: center;
  gap: 1em;
  cursor: pointer;
  background: transparent;
  color: brown;
  font-weight: 600;
  font-size: 0.95em;
  font-family: var(--font-normal);
}
.topic {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-weight: 700;
  color: brown;
}
.row-subject {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.btn-check {
  width: 20px;
  height: 20px;
  border: 1px solid #a3a3a3;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.svg-subject {
  display: flex;
  padding: 3px 4px;
  background: #df90f7;
  border-radius: 3px;
  box-shadow: #ad54c7 0px 3px 0px 0px;
}
:global {
  .btn-check > svg {
    width: 14px;
    color: #333;
  }
  .svg-subject > svg {
    width: 14px;
    color: #fff;
    stroke-width: 3px;
  }
}
.btn-view-subjects {
  font-size: 1em;
  cursor: pointer;
  background: transparent;
  font-family: var(--font-normal);
  display: flex;
  gap: 0.5em;
  align-items: center;
  transition: var(--transition);
  color: #6b6b6b;
}
.box-subjects {
  display: none;
  flex-direction: column;
  gap: 1em;
  padding: 1em 1em 0.5em 0.1em;
  color: brown;
  font-weight: 600;
  font-size: 0.95em;
}
.box-subjects.view-subjects {
  display: flex;
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
  flex-direction: column;
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
  width: 70px;
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
  grid-template-columns: 70px 1fr;
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
.info-p {
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
  .btn-subject {
    font-size: 1em;
  }
  .box-subjects {
    font-size: 1em;
    padding: 1em 1em 0.5em 1px;
  }
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
  .info-p {
    font-size: 0.9em;
  }
  .desc {
    font-size: 1em;
  }
  .wr-title {
    position: sticky;
    top: 90px;
    height: fit-content;
    margin-top: 10px;
    margin-bottom: 0;
  }
}
</style>
