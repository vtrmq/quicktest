<script lang="ts">
import { onMount } from "svelte";
import { page } from '$app/state';
import sendHorizontal from '$lib/assets/svg/send-horizontal.svg?raw';
import { 
  Title, 
  NoneData, 
  LinkBack,
} from '$lib/components';

import { 
  filtrarParametros, 
  typeActivity,
  drawChartCircle,
  scaleNota,
  extractParams,
} from '$lib/utils';

type Teacher = { name: string, surnames: string };
type Course = { course_id: number; course: string };
type Topic = { topic_id: number, topic: string; };
type Subject = { subject_id: number, subject: string };
type Activities = {
  activity_id: number;
  teacher_id: number;
  topic_id: number;
  activity: string;
  type_general: string;
  time: string | null;
  file: string | null;
  shadow_file: string | null;
  comment: string | null;
  items: string | null;
  nota: number;
}
type InfoTotal = { nota: string; percentage: number; scale: string };

let { data } = $props();
let course: Course = data.result?.course;
let subject: Subject = data.result?.subject;
let topic: Topic = data.result?.topic;
let teacher: Teacher = data.result?.teacher;
let activities: Activities[] = data.result?.activities;
let scale = data.result?.scale
let infoTotal = $state<InfoTotal>();
let chart = $state<SVGElement>() as SVGElement;
let valueDisplay = $state<HTMLDivElement>() as HTMLDivElement;

let root = $state('');
//let origin = extractParams(page.url.href, ["origin"]);
let url = extractParams(page.url.href, ["topicId", "courseId", "subjectId", "origin"]);
//console.log(url)
//console.log(data)

if (url.origin === "topic") {
  root = "/teacher/topic";
} else if (url.origin === "assign") {
  let _root = filtrarParametros(page.url.href, ["topicId"]);
  root = `/teacher/topic/assign?${_root}`;
}

let notaTotal = $state(0);
let countNotas = 0;
onMount(() => {
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].nota !== 0) {
      notaTotal += activities[i].nota;
      countNotas++;
    }
  }
  if (notaTotal !== 0) {
    notaTotal = notaTotal / countNotas;
    infoTotal = scaleNota(scale, notaTotal);
    drawChartCircle(infoTotal.percentage, chart, valueDisplay);
  }
});

</script>

<div class="container-teachers-registrations">

  <div class="wr-title">
    <LinkBack href={root}>Temas/Asignaturas</LinkBack>
    <Title>Actividades del tema</Title>
    <p class="course">{course.course}</p>
    <div>
      <p class="subject">{subject.subject}</p>
      <p class="teacher">{teacher.name} {teacher.surnames}</p>
    </div>
  </div>

  {#if activities.length !== 0}
    <div class="mg-top">
      <p class="topic">{topic.topic}</p>
      <div class="wrapper">

        {#each activities as row, i}
          {@const nota = scaleNota(scale, row.nota)}
          <div>
            <div class="row-teacher">
              <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === activities.length}>
                <div class="point">
                  <div class="circle-green">&nbsp;</div>
                </div>
                <div class="box-a">
                  <div class="box-bb">&nbsp;</div>
                  <div class="box-b">&nbsp;</div>
                </div>
                <div class="box-a">
                  <div class="box-bb" class:border-left={i !== 0 && i + 1 <= activities.length}>&nbsp;</div>
                  <div class="box-b" class:border-left={i + 1 < activities.length}>&nbsp;</div>
                </div>
              </div>
              <div class="box-course">
                <div>
                  <div class="info-course"><p class="activity">{row.activity}</p></div>
                  <div class="info-p">
                    <span>{typeActivity(row.type_general)}</span>
                    <span>Total:&nbsp;{nota.percentage}%&nbsp;{nota.scale}</span>
                  </div>
                </div>
                <a class="box-link-subject" href="/teacher/topic/student?topicId={row.topic_id}&courseId={url.courseId}&subjectId={url.subjectId}&activityId={row.activity_id}&origin={url.origin}">{@html sendHorizontal}</a>
              </div>
            </div>
          </div>
        {/each}

      </div>

        <div
            class="container-circle"
            class:visible={activities.length !== 0 && notaTotal !== 0}
        >
            <div style="position: relative; display: flex;">
                <svg class="chart-circle" bind:this={chart}></svg>
                <div class="value-display" bind:this={valueDisplay}></div>
            </div>
            {#if infoTotal}
                <h1 class="performance-chart">
                    Desempeño: {infoTotal?.scale}
                </h1>
            {/if}
        </div>


    </div>
  {/if}

</div>

<!--
                    Desempeño: {decimal(
                        formatDecimal(parseFloat(infoTotal.nota)),
                    )}
                    {infoTotal?.scale}
-->

{#if activities.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay actividades para mostrar</NoneData>
  </div>
{/if}

<style>
.mg-top {
  margin-top: 18px;
}
.teacher {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-style: italic;
}
.box-link-subject {
  display: flex;
  justify-content: center;
  align-items: start;
}
:global {
  .box-link-subject > svg {
    width: 20px;
    color: orange;
    stroke-width: 3px;
  }
}
.topic {
  font-size: 1.3em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-weight: 700;
  color: brown;
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
.box-course {
  padding: 1em 1em 1em 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1em;
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
.subject {
  font-size: 1.2em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-weight: 700;
}
.course {
  font-size: 1.3em;
  font-weight: 800;
  font-family: var(--font-normal);
  color: #407777;
}
.activity {
  font-size: 1.2em;
  font-weight: 800;
  font-family: var(--font-normal);
}
.info-p {
  font-size: 1.1em;
  font-family: var(--font-normal);
  color: #777777;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
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
  .box-link-subject {
    align-items: center;
  }
  .activity {
    font-size: 1.1em;
  }
  .teacher {
    font-size: 1em;
  }
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
  .info-p {
    gap: 1em;
    font-size: 0.9em;
    flex-direction: row;
  }
  .subject {
    font-size: 1.1em;
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
