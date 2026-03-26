<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/state';
import fileSpreadsheet from '$lib/assets/svg/file-spreadsheet.svg?raw';

import { 
  Title, 
  NoneData, 
  LinkBack,
  Dialog
} from '$lib/components';

import { 
  formatearNota, 
  typeExerc,
  scaleNota,
  extractParams,
  drawChartCircle,
  countsErrorsPoints,
} from '$lib/utils';

type Teacher = { name: string, surnames: string };
type Course = { course_id: number; course: string };
type Topic = { topic_id: number, topic: string; };
type Subject = { subject_id: number, subject: string };
type Student = {
  student_id: number;
  nota: number;
  performance: string;
  name: string;
  surnames: string;
  answer: [];
  pointsErrors: [];
}

let { data } = $props();
let course: Course = data.result?.course;
let subject: Subject = data.result?.subject;
let topic: Topic = data.result?.topic;
let teacher: Teacher = data.result?.teacher;
let students: Student[] = data.result?.students;
let scale = data.result?.scale
let chart = $state<SVGElement>() as SVGElement;
let valueDisplay = $state<HTMLDivElement>() as HTMLDivElement;
let dialog = $state<Dialog | null>(null);

//console.log(data)

let root = $state('');
let url = extractParams(page.url.href, ["courseId", "subjectId", "activityId", "origin", "topicId"]);

for (let i = 0; i < students.length; i++) {
  const resp: any = countsErrorsPoints(students[i].answer)
  students[i].pointsErrors = resp;
}
//console.log($state.snapshot(data))
//console.log($state.snapshot(students))

root = `/teacher/topic/activities?topicId=${url.topicId}&courseId=${url.courseId}&subjectId=${url.subjectId}&origin=${url.origin}`;

let notaTotal = $state(0);
let countNotas = 0;
type InfoTotal = { nota: string; percentage: number; scale: string };
let infoTotal = $state<InfoTotal>();

onMount(()=>{
  for (let i = 0; i < students.length; i++) {
    if (students[i].nota !== 0) {
      notaTotal += students[i].nota;
      countNotas++;
    }
  }
  if (notaTotal !== 0) {
    notaTotal = notaTotal / countNotas;
    infoTotal = scaleNota(scale, notaTotal);
    //console.log(notaTotal)
    //console.log($state.snapshot(infoTotal))
    drawChartCircle(infoTotal.percentage, chart, valueDisplay);
  }
});

function handleViewInfo(pos: number, index: number) {
  const name_student = `${students[pos].name} ${students[pos].surnames}`
  const answer: any = students[pos].answer[index];
  const type = typeExerc(answer.type);
  const total_selected = students[pos].pointsErrors[index];
  const nota = answer.value;
  //console.log($state.snapshot(students[pos]))
  //console.log($state.snapshot(answer))
  //console.log($state.snapshot(nota))

  let info = '';
  switch (answer.type) {
    case "test": {
      info = `Selecciones erroneas: ${total_selected} de ${answer.exercise.points.length} puntos`;
    } break;
    case "test-pdf": {
      info = `Selecciones erroneas: ${total_selected} de ${answer.exercise.points.length} puntos`;
    } break;
    case "match": {
      info = `Selecciones erroneas: ${total_selected} de ${answer.exercise.leftWords.length} puntos`;
    } break;
    case "point-out": {
      info = `Colocaciones erroneas: ${total_selected} de ${answer.exercise.placedOptions.length} opciones`;
    } break;
    case "test-fs": {
      const points = answer.exercise.points;
      let sum_words = 0;
      for (let i = 0; i < points.length; i++) {
        sum_words = sum_words + points[i].words.length;
      }
      info = `Palabras erroneas: ${total_selected} de ${sum_words} palabras`;
    } break;
    case "morphosyntax": {
      const arrWordsBox = answer.exercise.syntax.arrWordsBox;
      let sum_words = 0;
      for (let i = 0; i < arrWordsBox.length; i++) {
        for (let j = 0; j < arrWordsBox[i].length; j++) {
          if (arrWordsBox[i][j].max !== -1 && arrWordsBox[i][j].min !== -1) {
            sum_words = sum_words + 1;
          }
        }
      }
      info = `Selecciones erroneas: ${total_selected} de ${sum_words} palabras o sintagmas`;
    } break;
    case "select": {
      let sum_words = 0;
      const words = answer.exercise.words;
      for (let i = 0; i < words.length; i++) {
        if (words[i].value) {
          sum_words = sum_words + 1;
        }
      }
      info = `Selecciones erroneas: ${total_selected} de ${sum_words} palabras`;
    } break;
    case "character": {
      let sum_words = 0;
      const words = answer.exercise.words;
      for (let i = 0; i < words.length; i++) {
        if (words[i].value) {
          sum_words = sum_words + 1;
        }
      }
      info = `Colocaciones erroneas: ${total_selected} de ${sum_words} palabras`;
    } break;
  }

  dialog?.show({
    type: '',
    message: `
      <h1 class="title-err">${name_student}</h1>
      <div class="wr-info-w">
        <p class="info-total">Tipo: ${type}</p>
        <p class="info-total">${info}</p>
        <p class="info-total">Nota: ${formatearNota(nota)} ${scaleNota(data.result?.scale, nota).scale}</p>
      </div>
    `,
  });

}

</script>

<Dialog bind:this={dialog} action={()=>{}} />

<div class="container-teachers-registrations">

  <div class="wr-info-page">
    <LinkBack href={root}>Temas/Asignaturas</LinkBack>
    <Title>Resultados</Title>
    <p class="course">{course.course}</p>
    <div>
      <p class="subject">{subject.subject}</p>
      <p class="teacher">{teacher.name} {teacher.surnames}</p>
      <p class="topic">{topic.topic}</p>
      <p class="name-activity">{data.result?.activity.activity}</p>
    </div>
    <br />
    <div
      class="container-circle"
      class:visible={students.length !== 0 && notaTotal !== 0}
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

  {#if students.length !== 0}
    <div>
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
                <div class="info-student">
                  <div class="info">
                    <div class="info-course"><p class="activity">{row.name} {row.surnames}</p></div>
                    <div class="info-p">
                      <span>Nota:&nbsp;{formatearNota(row.nota)}&nbsp;{row.performance}</span>
                    </div>
                  </div>
                  <a class="box-link-subject" href="/teacher/topic/student/result?topicId={url.topicId}&courseId={url.courseId}&subjectId={url.subjectId}&activityId={url.activityId}&studentId={row.student_id}&origin={url.origin}">{@html fileSpreadsheet}</a>
                </div>
                <div class="wp-info-errors">
                  <div class="label-t">Errores por actividades</div>
                  <div class="wrapper-btns-errors">
                    {#each row.pointsErrors as points, index }
                      <button class="btn-errors" onclick={()=>handleViewInfo(i, index)}>
                        <span class="span-index">{index + 1}</span>
                        <span class="span-points">{points}</span>
                      </button> 
                    {/each}
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

{#if students.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay actividades para mostrar</NoneData>
  </div>
{/if}

<style>
.label-t {
  position: absolute;
  top: -18px;
  background: #cdebee;
  padding: 2px 6px;
  border: 1px solid #cdebee;
  border-radius: 6px;
  font-family: var(--font-normal);
  font-size: 0.85em;
}
.wp-info-errors {
  position: relative;
  padding: 7px;
  border: 1px solid #cdebee;
  border-radius: 8px;
  background: #fff;
  margin-top: 1.8em;
}
.info-student {
  display: flex;
  justify-content: space-between;
  gap: 1em;
}
.name-activity {
  font-family: var(--font-normal);
  line-height: 23px;
  margin-top: 0.2em;
}
.info {
  width: 100%;
}
.wrapper-btns-errors {
  display: flex;
  gap: 1em;
}
.btn-errors {
  width: 25px;
  font-family: var(--font-normal);
  display: grid;
  grid-template-rows: 15px 20px;
  cursor: pointer;
  border-radius: 3px;
  overflow: hidden;
}
.span-index {
  background: #f8b869;
}
.span-points {
  background: #0093d5f0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 600;
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
    stroke-width: 2px;
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
  flex-direction: column;
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
}
</style>
