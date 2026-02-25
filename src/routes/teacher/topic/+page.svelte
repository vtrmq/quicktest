<script lang="ts">
import { deserialize } from '$app/forms';
import listTodo from '$lib/assets/svg/list-todo.svg?raw';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import plus from '$lib/assets/svg/plus.svg?raw';
import fileText from '$lib/assets/svg/file-text.svg?raw';
import minus from '$lib/assets/svg/minus.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw'
import blocks from '$lib/assets/svg/blocks.svg?raw'
import sendHorizontal from '$lib/assets/svg/send-horizontal.svg?raw';
import { Title, NoneData, LinkBtn, OptionSelect, Toast, Dialog, Pagination } from '$lib/components';

let { data } = $props();
//console.log($state.snapshot(data))
let subjId: string = $state('');
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let posTopic: number = 0;

type Subjects = {
  subject_id: number;
  subject: string;
  course_id: number;
  course: string;
}

type Topic = {
  topic_id: number;
  teacher_id: number;
  topic: string;
  subjects: Subjects[];
  created_at: string;
};

type PaginationResult = {
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
}

let pagination: PaginationResult | undefined = $state({limit: 0, page: 0, totalCount: 0, totalPages: 0});
let topics: Topic[] = $state(data.topics as Topic[]);

$effect(() => {
  pagination = data.pagination;
  topics = data.topics as Topic[];
});

function handleViewSubject(i: number, cant: number) {
  if (cant === 0) return;
  if (subjId === '' || subjId !== `subj-${i}`) {
    subjId = `subj-${i}`;
  } else {
    subjId = '';
  }
}

function handleActionShowWin(index: number) {
  const topic = topics[index].topic;
  posTopic = index;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar el tema: ${topic}?`,
  });
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {
    const topicId = topics[posTopic].topic_id.toString();
    const formData = new FormData();
    formData.append('topic_id', topicId);

    const response = await fetch('?/visible', {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    const result = deserialize(responseText);

    if (result.type === 'success' || result.type === 'failure') {
      if (result.type === 'success') {
        topics = topics.filter((_, i) => i !== posTopic);
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

<Toast bind:this={toast} />
<Dialog bind:this={dialog} action={handleActionDelete} />

<div class="container-teachers-registrations">

  <div class="wr-title">
    <Title>Temas</Title>
    <p class="desc">Crea los temas de clase para cada una de tus asignaturas.</p>
    <LinkBtn href="/teacher/topic/new" --max-width-link-btn="230px">{@html plus} Crear tema</LinkBtn>
  </div>

  {#if topics.length !== 0}
    <div class="wrapper">
      <div class="container-rows">      
        {#each topics as row, i}
          <div>
            <div class="row-teacher">
              <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === topics.length}>
                <div class="point">
                  <div class="circle-green">&nbsp;</div>
                </div>
                <div class="box-a">
                  <div class="box-bb">&nbsp;</div>
                  <div class="box-b">&nbsp;</div>
                </div>
                <div class="box-a">
                  <div class="box-bb" class:border-left={i !== 0 && i + 1 <= topics.length}>&nbsp;</div>
                  <div class="box-b" class:border-left={i + 1 < topics.length}>&nbsp;</div>
                </div>
              </div>
              <div class="box-course">
                <div class="info-topic"><p class="topic">{row.topic}</p></div>
                <div class="info-pay">
                  <div>
                    <div>
                      <button onclick={()=>handleViewSubject(i, row.subjects.length)} class="btn-view-subjects">
                        <span class="svg-subject">
                          {#if `subj-${i}` === subjId}
                            {@html minus}
                          {:else}
                            {@html plus}
                          {/if}
                        </span> 
                        {row.subjects.length === 0 ? 'Tema no asignado' : `Cursos y asignaturas`}</button>
                    </div>
                    <div class="box-subjects" class:view-subjects={`subj-${i}` === subjId}>
                      {#each row.subjects as subject}
                        <div class="in-course-subject">
                          <a href="/teacher/topic/activities?topicId={row.topic_id}&courseId={subject.course_id}&subjectId={subject.subject_id}&origin=topic" class="link-result"><span>{subject.course}</span> <span>{subject.subject}</span></a>
                          <a class="box-link-subject" href="/teacher/topic/activities?topicId={row.topic_id}&courseId={subject.course_id}&subjectId={subject.subject_id}&origin=topic">{@html sendHorizontal}</a>
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
                <div class="box-select">
                  <OptionSelect>
                    <a href="/teacher/topic/content?topicId={row.topic_id}">{@html fileText} <span>Contenido</span></a>
                    <a href="/teacher/topic/activity?topicId={row.topic_id}">{@html listTodo} <span>Actividades</span></a>
                    <a href="/teacher/topic/assign?topicId={row.topic_id}">{@html blocks} <span>Asignar tema</span></a>
                    <a href="/teacher/topic/edit?topicId={row.topic_id}">{@html pencil} <span>Editar</span></a>
                    <button onclick={()=>handleActionShowWin(i)}>{@html trash} <span>Eliminar</span></button>
                  </OptionSelect>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>

      {#if pagination && pagination.totalPages > 1}
        <Pagination page={pagination.page} totalPages={pagination.totalPages} />
      {/if}

    </div>
  {/if}

</div>

{#if topics.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay datos para mostrar</NoneData>
  </div>
{/if}

<style>
.box-link-subject {
  display: flex;
  justify-content: center;
  align-items: center;
}
:global {
  .box-link-subject > svg {
    width: 20px;
    color: orange;
    stroke-width: 3px;
  }
}
.link-result {
  color: brown;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
.in-course-subject {
  display: flex;
  gap: 1em;
  justify-content: space-between;
}
.container-rows {
  background: #f0ffff8a;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
  border-radius: 6px;
}
.box-select {
  display: inline-flex;
  position: absolute;
  top: 10px;
  right: 10px;
}
.svg-subject {
  display: flex;
  padding: 3px 4px;
  background: #df90f7;
  border-radius: 3px;
  box-shadow: #ad54c7 0px 3px 0px 0px;
}
:global {
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
  padding: 1em 1em 0.5em 0.3em;
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
.info-topic {
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
  height: 23%;
}
.box-b {
  height: 100%;
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
.topic {
  font-size: 1.3em;
  font-weight: 800;
  font-family: var(--font-normal);
  margin: 4px 0;
  color: #3f3f3f;
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
.wr-title {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  margin-top: 1em;
  margin-bottom: 1.5em;
}
.wrapper {
  margin: 1.5em 0;
  display: flex;
  flex-direction: column;
}
@media(min-width: 800px) {
  .box-subjects {
    font-size: 1em;
    padding: 1em 1em 0.5em 0.5em;
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
  .wr-title {
    position: sticky;
    top: 90px;
    height: fit-content;
    margin-top: 10px;
    margin-bottom: 0;
  }
}
</style>
