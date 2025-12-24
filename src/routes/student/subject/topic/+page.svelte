<script lang="ts">
let { data } = $props();
import { NoneData, Pagination, LinkBack } from '$lib/components';

const teacherId = data.teacherId;
const courseId = data.courseId;
const subjectId = data.subjectId;

type Topic = {
  topic_id: number; topic: string; content: string; has_inbox: number;
};

type Result = {
  course: {course_id: number; name: string;};
  subject: {subject_id: number; name: string;};
  teacher: {name: string; surnames: string;};
  topics: Array<Topic>;
};

type PaginationResult = {
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
}

const result: Result = data.result as Result;
let pagination: PaginationResult | undefined = $state({limit: 0, page: 0, totalCount: 0, totalPages: 0});
let topics: Topic[] = $state(data.result.topics as Topic[]);

$effect(() => {
  pagination = data.pagination;
  topics = data.result.topics;
});

</script>

<div class="container-topics">
  <div>
    <LinkBack href="/student/subject">Asignaturas</LinkBack>
    <h1 class="name-course">{result.course.name}</h1>
    <p class="name-subject">{result.subject.name}</p>
    <p class="name-teacher">{result.teacher.name} {result.teacher.surnames}</p>
  </div>
  {#if topics.length !== 0}
    <div class="wrapper">
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
              <div class="info-subject">
                <div>
                  <div class="subject">{row.topic}</div>
                  <div class="wr-content-activity">
                    {#if row.content !== null}
                      <a class="link" href="/student/subject/topic/content?teacherId={teacherId}&courseId={courseId}&subjectId={subjectId}&topicId={row.topic_id}">Contenido</a>
                    {/if}
                    {#if row.has_inbox !== 0}
                      <a class="link" href="/student/subject/topic/activity?teacherId={teacherId}&courseId={courseId}&subjectId={subjectId}&topicId={row.topic_id}">Actividades</a>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/each}
    </div>
    {#if pagination && pagination.totalPages > 1}
      <div class="wr-pagination">
        <Pagination page={pagination.page} totalPages={pagination.totalPages} />
      </div>
    {/if}
  {/if}
</div>

{#if topics.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay temas para mostrar</NoneData>
  </div>
{/if}

<style>
.wr-pagination {
  background: #fff;
  border-radius: 6px;
}
.link {
  text-decoration: none;
  font-size: 1em;
  color: #0d85e5;
}
.wr-content-activity {
  margin-top: 7px;
  display: flex;
  gap: 1em;
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
.subject {
  font-weight: 700;
  font-size: 1.2em;
}
:global {
  .svg-subject > svg {
    width: 14px;
    color: #fff;
    stroke-width: 3px;
  }
  .box-link-subject > svg {
    width: 20px;
    color: orange;
    stroke-width: 3px;
  }
}
.box-course {
  padding: 1em 0;
  position: relative;
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
.wr-none-data {
  padding: 3em 0;
}
.info-subject {
  font-size: 1em;
  padding: 0.5em 1em 0.5em 0.5em;
  font-family: var(--font-normal);
  display: grid;
  gap: 1em;
}
@media(min-width: 800px) {
  .subject {
    font-size: 1em;
  }
  .info-subject {
    font-size: 1.1em;
  }
}


/* =========================================== */
.name-teacher {
  font-family: var(--font-normal);
  font-size: 1em;
  color: #757575;
  font-style: italic;
}
.name-subject {
  font-family: var(--font-normal);
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 0.3em;
}
.name-course {
  font-size: 1.3em;
  font-family: var(--font-bold);
}
.wr-none-data {
  padding: 3em 0;
}
.container-topics {
  padding: 1em 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
@media(min-width: 700px) {
  .link {
    font-size: 0.8em;
  }
  .link:hover {
    text-decoration: underline;
  }
}
</style>
