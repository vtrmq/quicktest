<script lang="ts">
import { NoneData } from '$lib/components';
import { typeActivity, formatDate, isDateEnd, compareDates } from '$lib/utils';
import { onMount } from 'svelte';
import { activityLocalstore } from '$lib/store/activity_student';

let { data } = $props();
console.log(data)

type Result = {
    activity_id: number;
    teacher_id: number;
    topic_id: number;
    activity: string;
    type_general: string;
    time: number;
    items: null;
    date_end: string;
    course_id: number;
    subject_id: number;
    course: string;
    subject: string;
    answer_id: number;
    nota: number;
    performance: string;
};
type Activity = {
  activity_id: number;
  course_id: number;
  subject_id: number;
  teacher_id: number;
  topic_id: number;
} | null;
const result: Result[] = data.activities as Result[];
onMount(()=>{
  if (result.length !== 0) {
    const activity_store = activityLocalstore.getActivity();
    const activity: Activity = activity_store?.activity as Activity;

    if (activity !== null) {
      for (let i = 0; i < result.length; i++) {
        const activity_id = result[i].activity_id;
        const course_id = result[i].course_id;
        const subject_id = result[i].subject_id;
        const topic_id = result[i].topic_id;
        const date_end = result[i].date_end;
        if (activity_id === activity.activity_id && course_id === activity.course_id && subject_id === activity.course_id && topic_id === activity.topic_id) {
          if (!compareDates(date_end)) {
            activityLocalstore.clear();
          }
        }
      }
    }
  }
});
</script>

<div class="container-topics">
  {#if result.length !== 0}
    <div class="wrapper">
      {#each result as row, i}

        <div>
          <div class="row-teacher">
            <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === result.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb" class:border-left={i !== 0 && i + 1 <= result.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < result.length}>&nbsp;</div>
              </div>
            </div>
            <div class="box-course">
              <div class="info-subject">
                <div>
                  <div class="subject">{row.activity}</div>
                  <div class="wr-content-activity">
                    <p class="info">{typeActivity(row.type_general)}</p>

                    {#if !row.answer_id}
                      {#if row.time}
                        <p class="info">
                          Tiempo: <span>{row.time} min</span>
                        </p>
                      {/if}
                      <p class="info">
                        <span>Fecha final: {formatDate(row.date_end)}</span>
                      </p>
                    {:else if row.answer_id}
                      <div class="info">{row.nota} {row.performance}</div>
                    {/if}

                  </div>
                  <div class="wr-links">
                    {#if !row.answer_id && isDateEnd(row.date_end)}
                      <a class="link" href="/student/subject/topic/activity/info?teacherId={row.teacher_id}&courseId={row.course_id}&subjectId={row.subject_id}&topicId={row.topic_id}&activityId={row.activity_id}&origin=inbox">Ver detalles</a>
                    {:else if !row.answer_id && !isDateEnd(row.date_end)}
                      <p class="none-activity">Actividad cerrada</p>
                    {:else if row.answer_id}
                      <a class="link" href="/student/subject/topic/activity/result">Ver resultado</a>
                    {/if}
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

{#if result.length === 0}
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
  margin: 1em 0 2em;
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
/*
.topic {
  font-family: var(--font-normal);
  font-size: 1.4em;
  font-weight: 800;
  margin-top: 0.3em;
  color: brown;
}
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
*/
.wr-none-data {
  padding: 3em 0;
}
.container-topics {
  padding: 0 0 3em;
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
