<script lang="ts">
import { marked } from 'marked';
import { FOLDER_AUDIOS, R2_DOMAIN } from '$lib/utils';
import { page } from '$app/state';
import { LinkBack, Video } from "$lib/components";
import { onMount } from "svelte";
import { 
  filtrarParametros, 
  typeActivity, 
  quitarExtension,
  formatDate,
  isDateEnd,
  decimal,
  formatDecimal,
  drawChartCircle,
  scaleNota,
} from "$lib/utils";


let { data } = $props();
let content = JSON.parse(data.topic.content);
const search = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId']);
type Extra = {
  type_activity: string;
  items: any;
};
type InfoTotal = { nota: string; percentage: number; scale: string };
let activities = $state(data.activities);
let extras: Extra[] = $state(data.extras);
const root = `${R2_DOMAIN}/${FOLDER_AUDIOS}`;
let notaTotal = $state(0);
let chart = $state<SVGElement>() as SVGElement;
let valueDisplay = $state<HTMLDivElement>() as HTMLDivElement;
let infoTotal = $state<InfoTotal>();

onMount(() => {
  let countNotas = 0;
  if (activities.length !== 0) {
    for (let i = 0; i < activities.length; i++) {
      const nota = activities[i].nota;
      if (nota !== null) {
        notaTotal = notaTotal + nota;
        countNotas++;
      }
    }
    if (notaTotal !== 0) {
      notaTotal = notaTotal / countNotas;
      infoTotal = scaleNota(data.scales, notaTotal);
      drawChartCircle(infoTotal.percentage, chart, valueDisplay);
    }
  }
});



</script>

<div class="content">
  <div class="content-body">

    <div class="header-content">
      <LinkBack href="/student/subject/topic?{search}">Temas</LinkBack>
    </div>
    <div class="container-paragraph">
      {#each content as section}
        {#if section.type === 'title'}
          <h1>{@html marked(section.text)}</h1>
        {:else if section.type === 'subtitle'}
          <h2>{@html marked(section.text)}</h2>
        {:else if section.type === 'paragraph'}
          <p class="paragraph">{@html marked(section.text)}</p>
        {:else if section.type === 'image'}
          <div class="container-image">
            <div class="wr-img" style="width: {section.size}%">
              <img class="image" src={section.text} alt=""/>
            </div>
          </div>
        {:else if section.type === 'video'}
          <div class="container-iframe">
            <Video data={section} />
          </div>
        {:else if section.type === 'vignette'}
          <div class="wr-items">
            <ul class="ul-items">

              {#each section.text as list, index}
                <li class="li-item">
                  <div class="n-item">{index < 9 ? '0' : ''}{index + 1}</div>
                  <div class="text-list">{@html marked(list.item)}</div>
                </li>
              {/each}

            </ul>
          </div>
        {/if}
      {/each}
    </div>

  {#if activities.length !== 0}
    <div class="container-activities">
      <h1 class="act">Actividades del tema</h1>
      <div class="wr-activities">
        {#each activities as row, i}

          <div class="row-teacher">
            <div
              class="box-point"
              class:border-top-left={i === 0}
              class:border-bottom-left={i + 1 === activities.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div
                  class="box-bb"
                  class:border-left={i !== 0 &&
                    i + 1 <= activities.length}>
                  &nbsp;
                </div>
                <div
                  class="box-b"
                  class:border-left={i + 1 < activities.length}>
                  &nbsp;
                </div>
              </div>
            </div>
            <div class="box-course">
              <div class="info-subject">
                <div>
                  <div class="subject">{row.activity}</div>
                  <div class="wr-content-activity">
                    <p class="info">
                      {typeActivity(row.type_general)}
                    </p>

                    {#if !row.answer_id}
                      {#if row.time}
                        <p class="info">Tiempo: <span>{row.time} min</span></p>
                      {/if}
                      <p class="info">
                        <span>Fecha final: {formatDate( row.date_end,)}</span>
                      </p>
                    {:else if row.answer_id}
                      <div class="info red">
                        {row.nota}
                        {row.performance}
                      </div>
                    {/if}
                  </div>
                  <div class="wr-links">
                    {#if !row.answer_id && isDateEnd(row.date_end)}
                      <a
                        class="link unlerline"
                        href="/student/subject/topic/activity/info?teacherId={row.teacher_id}&courseId={data.courseId}&subjectId={data.subjectId}&topicId={row.topic_id}&activityId={row.activity_id}&origin=content"
                      >Ver detalles</a>
                    {:else if !row.answer_id && !isDateEnd(row.date_end)}
                      <p class="none-activity">
                        Actividad cerrada
                      </p>
                    {:else if row.answer_id}
                      <a
                        class="link unlerline"
                        href="/student/subject/topic/activity/result?teacherId={row.teacher_id}&courseId={data.courseId}&subjectId={data.subjectId}&topicId={row.topic_id}&activityId={row.activity_id}&origin=content"
                      >Ver resultado</a>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/each}
      </div>
    </div>

    <div
      class="container-circle"
      class:visible={activities.length !== 0 && notaTotal !== 0}>
      <div style="position: relative; display: flex;">
        <svg class="chart-circle" bind:this={chart}></svg>
        <div class="value-display" bind:this={valueDisplay}></div>
      </div>
      {#if infoTotal}
        <h1 class="performance-chart">
          Desempeño: {decimal(
            formatDecimal(parseFloat(infoTotal.nota)),
          )}
          {infoTotal?.scale}
        </h1>
      {/if}
    </div>

  {/if}


  {#each extras as activity}
    {#if activity.type_activity === "audios" && activity.items.length !== 0}
      <div class="container-activities">
        <h1 class="act">Audios</h1>
        <div class="container-audios">
          {#each activity.items as audio}
            <div class="wr-audios">
              <div class="wr-audio-text">
                <audio class="audio" src="{root}/{audio.shadow_audio}" controls></audio>
                <div class="name-audio">{quitarExtension(audio.name)}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/each}

  </div>
</div>

<style>

.wr-items {
  display: flex;
  width: 100%;
  padding: 1em 0 2em;
}
.ul-items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.text-list {
  font-family: var(--font-normal);
  font-size: 1.1em;
  line-height: 30px;
}
.li-item {
  display: flex;
  align-items: start;
  gap: 1em;
}
.n-item {
  font-family: var(--font-normal);
  font-size: 1.1em;
  font-weight: 800;
  color: #cb7900;
  display: flex;
  background: transparent;
  line-height: 30px;
  padding-top: 0.6em;
}
.paragraph {
  font-family: var(--font-normal);
  font-size: 1.1em;
  line-height: 30px;
}
.wr-links {
  margin-top: 0.3em;
}
.wr-content-activity {
  display: flex;
  gap: 0.2em;
  flex-direction: column;
  font-size: 0.9em;
  margin-top: 0.4em;
  color: #636363;
}
.info {
  font-family: var(--font-normal);
  font-size: 1.1em;
}
.link {
  font-size: 1em;
  color: #0d85e5;
}
.none-activity {
  font-size: 1em;
  color: brown;
}
@media (min-width: 700px) {
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
.info-subject {
  font-size: 1em;
  padding: 0.5em 1em 0.5em 0.5em;
  font-family: var(--font-normal);
  display: grid;
  gap: 1em;
}
.subject {
  font-weight: 700;
  font-size: 1.2em;
}
@media (min-width: 800px) {
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
.box-course {
  padding: 1em 0;
  position: relative;
}
.row-teacher {
  display: grid;
  align-items: center;
  gap: 1em;
  grid-template-columns: 60px 1fr;
}

.circle-green {
  background: #a5fbcf;
  width: 18px;
  height: 18px;
  border-radius: 60px;
  box-shadow:
    rgb(17 17 26 / 38%) 0px 4px 15px,
    rgb(17 17 26 / 34%) 0px 0px 6px;
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



:global {
  .link-subject > svg {
    width: 24px;
    color: #4CAF50;
    stroke-width: 2px;
  }
}
.wr-activities {
  margin: 1em 0 2em;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #f0ffff8a;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
}
:global {
  .btn-trash > svg {
    width: 22px;
    color: #f35656;
  }
}
.container-audios {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.wr-audio-text {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.4em;
  align-items: center;
}
.name-audio {
  padding: 0.5em;
  width: 100%;
  font-size: 1em;
  text-align: center;
  border-radius: 5px;
  font-family: var(--font-normal);
}
.wr-audios {
  display: flex;
  gap: 1em;
  border-radius: 8px;
  background: #ffffff;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
  padding: 1.8em 1em 1em;
  position: relative;
}
.act {
  font-family: var(--font-bold);
  font-size: 1.4em;
  margin-bottom: 1em;
  color: brown;
  padding-left: 0.6em;
}
.content {
  padding: 1em 0 0;
  margin: 0 auto 4em;
}
.container-activities {
  padding: 1em 0 0;
}
@media (min-width: 700px) {
  .content {
    padding: 1em 0 2em;
    margin: 0 auto 6em;
    max-width: 600px;
  }
}
</style>
