<script lang="ts">
import { page } from '$app/state';

import { 
  Title, 
  NoneData, 
  LinkBack,
} from '$lib/components';
import { 
  scaleNota,
  extractParams,
  drawChartCircle,
} from '$lib/utils';
import { onMount } from 'svelte';

type Course = { course_id: number; course: string };
type Subject = { subject_id: number, subject: string };
type Student = { name: string, surnames: string };
type Answer = {
  activity: string;
  date_time: string;
  nota: number;
  performance: string;
  topic: string;
}

let { data } = $props();

let course: Course = data.course;
let subject: Subject = data.subject;
let answers: Answer[] = data.answers;
let student: Student = data.student;
let scale = data.scale
let chart = $state<SVGElement>() as SVGElement;
let valueDisplay = $state<HTMLDivElement>() as HTMLDivElement;

let root = $state('');
let url = extractParams(page.url.href, ["courseId", "dateStart", "dateEnd", "subjectId"]);

root = `/teacher/student?courseId=${url.courseId}&dateStart=${url.dateStart}&dateEnd=${url.dateEnd}&subjectId=${url.subjectId}`;

let notaTotal = $state(0);
let countNotas = 0;
type InfoTotal = { nota: string; percentage: number; scale: string };
let infoTotal = $state<InfoTotal>();

onMount(()=>{
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].nota !== 0) {
      notaTotal += answers[i].nota;
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
    <Title>Resultados</Title>
    <p class="course">{course.course}</p>
    <div>
      <p class="subject">{subject.subject}</p>
      <p class="teacher">{student.name} {student.surnames}</p>
    </div>
    <br />
    <div
      class="container-circle"
      class:visible={answers.length !== 0 && notaTotal !== 0}
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

  {#if answers.length !== 0}
    <div class="mg-top">
      <div class="wrapper">

        {#each answers as row, i}
          <div>
            <div class="row-teacher">
              <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === answers.length}>
                <div class="point">
                  <div class="circle-green">&nbsp;</div>
                </div>
                <div class="box-a">
                  <div class="box-bb">&nbsp;</div>
                  <div class="box-b">&nbsp;</div>
                </div>
                <div class="box-a">
                  <div class="box-bb" class:border-left={i !== 0 && i + 1 <= answers.length}>&nbsp;</div>
                  <div class="box-b" class:border-left={i + 1 < answers.length}>&nbsp;</div>
                </div>
              </div>
              <div class="box-course">
                <div>
                  <div class="info-course">
                    <p class="activity">{row.topic}</p>
                  </div>
                  <div class="info-p">
                    <p class="activity">{row.activity}</p>
                    <p>Nota:&nbsp;{row.nota}&nbsp;{row.performance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}

      </div>

    </div>
  {/if}

</div>

{#if answers.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay actividades para mostrar</NoneData>
  </div>
{/if}

<style>
.mg-top {
  margin-top: 8px;
}
.teacher {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-style: italic;
}
:global {
  .box-link-subject > svg {
    width: 20px;
    color: orange;
    stroke-width: 3px;
  }
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
  margin: 1.5em 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #f0ffff8a;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
}
@media(min-width: 800px) {
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
    font-size: 0.9em;
  }
  .subject {
    font-size: 1.1em;
  }
  .wr-title {
    position: sticky;
    top: 105px;
    height: fit-content;
    margin-top: 25px;
  }
}
</style>
