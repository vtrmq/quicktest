<script lang="ts">
import { page } from '$app/state';
let { data } = $props();
import { NoneData, LinkBack } from '$lib/components';
import { filtrarParametros, typeActivity, formatDate, isDateEnd, compareDates, formatDecimal, decimal, drawChartCircle } from '$lib/utils';
import { onMount } from 'svelte';
import { activityLocalstore } from '$lib/store/activity_student';

//console.log(data)

const root = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId']);

type Activities = {
  activity_id: number;
  teacher_id: number;
  topic_id: number;
  activity: string;
  type_general: string;
  time: number;
  created_at: string;
  date_end: string;
  answer_id: number;
  answered: number;
  nota: number;
  performance: string;

};

type Result = {
  course: {course_id: number; name: string;};
  subject: {subject_id: number; name: string;};
  teacher: {id: number; name: string; surnames: string;};
  topic: {topic_id: number; topic: string;};
  activities: Array<Activities>;
};
type Activity = {
  activity_id: number;
  course_id: number;
  subject_id: number;
  teacher_id: number;
  topic_id: number;
} | null;
type Course = { course_id: number; } | null;
type Subject = { subject_id: number; } | null;

let chart = $state<SVGElement>() as SVGElement;
let valueDisplay = $state<HTMLDivElement>() as HTMLDivElement;
let sumaTotal = $state(7.6);
let performance = $state('Básico');
let percentage = $state(76);
const result: Result = data.result as Result;

let notaTotal = $state(0);
onMount(()=>{
  if (result.activities.length !== 0) {
    const activity_store = activityLocalstore.getActivity();
    const activity: Activity = activity_store?.activity as Activity;
    const course: Course = result.course as Course;
    const subject: Subject = result.subject as Subject;

    if (activity !== null) {
      for (let i = 0; i < result.activities.length; i++) {
        const activity_id = result.activities[i].activity_id;
        const topic_id = result.activities[i].topic_id;
        const date_end = result.activities[i].date_end;
        const course_id = course?.course_id;
        const subject_id = subject?.subject_id;
        if (activity_id === activity.activity_id && course_id === activity.course_id && subject_id === activity.course_id && topic_id === activity.topic_id) {
          if (!compareDates(date_end)) {
            activityLocalstore.clear();
          }
        }
        const nota = result.activities[i].nota;
        if (nota !== null) {
          notaTotal = notaTotal + nota;
        }
      }
      //console.log(notaTotal)
      if (notaTotal !== 0) {
        notaTotal = notaTotal / result.activities.length;
        drawChartCircle(percentage, chart, valueDisplay)
      }
    }
  }
});

</script>

<div class="container-topics">
  <div>
    <LinkBack href="/student/subject/topic?{root}">Temas</LinkBack>
    <h1 class="name-course">{result.course.name}</h1>
    <p class="name-subject">{result.subject.name}</p>
    <p class="name-teacher">{result.teacher.name} {result.teacher.surnames}</p>
    <h2 class="topic">{result.topic.topic}</h2>
  </div>
  {#if result.activities.length !== 0}
    <div class="wrapper">
      {#each result.activities as row, i}

        <div>
          <div class="row-teacher">
            <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === result.activities.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb" class:border-left={i !== 0 && i + 1 <= result.activities.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < result.activities.length}>&nbsp;</div>
              </div>
            </div>
            <div class="box-course">
              <div class="info-subject">
                <div>
                  <div class="subject">{row.activity}</div>
                  <div class="wr-content-activity">
                    <p class="info">{typeActivity(row.type_general)}</p>
                    {#if row.time}
                      <p class="info">
                        Tiempo: <span>{row.time} min</span>
                      </p>
                    {/if}
                    <p class="info">
                      <span>Fecha final: {formatDate(row.date_end)}</span>
                    </p>
                  </div>
                  <div class="wr-links">
                    {#if row.answered === 0 && isDateEnd(row.date_end)}
                      <a class="link" href="/student/subject/topic/activity/info?teacherId={row.teacher_id}&courseId={result.course.course_id}&subjectId={result.subject.subject_id}&topicId={result.topic.topic_id}&activityId={row.activity_id}&origin=activity">Ver detalles</a>
                    {:else if row.answered === 0 && !isDateEnd(row.date_end)}
                      <p class="none-activity">Actividad cerrada</p>
                    {:else if row.answered === 1}
                      <a class="link" href="/student/subject/topic/activity/result?teacherId={row.teacher_id}&courseId={result.course.course_id}&subjectId={result.subject.subject_id}&topicId={result.topic.topic_id}&activityId={row.activity_id}">Ver resultado</a>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/each}
    </div>

    {#if result.activities.length !== 0 && notaTotal !== 0}
      <div class="container-circle">
        <div style="position: relative; display: flex;">
          <svg class="chart-circle" bind:this={chart}></svg>
          <div class="value-display" bind:this={valueDisplay}></div>
        </div>
        <h1 class="performance-chart">Desempeño: {decimal(formatDecimal(sumaTotal))} {performance}</h1>
      </div>
    {/if}

  {/if}
</div>

{#if result.activities.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay actividades para mostrar</NoneData>
  </div>
{/if}

<style>
.none-activity {
  font-size: 1em;
  color: brown;
}
.wr-links {
  margin-top: 0.3em;
}
.info {
  font-family: var(--font-normal);
  font-size: 1.1em;
}
.topic {
  font-family: var(--font-normal);
  font-size: 1.4em;
  font-weight: 800;
  margin-top: 0.3em;
  color: brown;
}
.link {
  text-decoration: none;
  font-size: 1em;
  color: #0d85e5;
}
.wr-content-activity {
  display: flex;
  gap: 0.2em;
  flex-direction: column;
  font-size: 0.9em;
  margin-top: 0.4em;
  color: #636363;
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
  .wr-content-activity {
    font-size: 0.8em;
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
  .none-activity {
    font-size: 0.9em;
  }
  .link {
    font-size: 0.9em;
  }
  .link:hover {
    text-decoration: underline;
  }
}
</style>
