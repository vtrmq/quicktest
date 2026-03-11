<script lang="ts">
import { goto } from '$app/navigation';
import { deserialize } from '$app/forms';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import plus from '$lib/assets/svg/plus.svg?raw';
import fileText from '$lib/assets/svg/file-text.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw'
import { Title, NoneData, LinkBtn, OptionSelect, Toast, Dialog, LinkBack } from '$lib/components';
import { typeActivity } from '$lib/utils';

let { data } = $props();
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let posActivity: number = 0;

//console.log(data)

type Topic = {
  topic_id: number;
  topic: string;
}

type Activities = {
  activity_id: number;
  activity: string;
  type_general: string;
  time: number;
  file: string;
  shadow_file: string;
  items: [];
  created_at: string;
  has_inbox: number;
};

let activities: Activities[] = $state(data.result?.activities);
let topic: Topic = $state(data.result?.topic);

function handleActionShowWin(index: number) {
  const activity = activities[index].activity;
  posActivity = index;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar: ${activity}?`,
  });
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {
    const topicId = topic.topic_id.toString();
    const activityId = activities[posActivity].activity_id.toString();
    const formData = new FormData();
    formData.append('activity_id', activityId);
    formData.append('topic_id', topicId);

    const response = await fetch('?/visible', {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    const result = deserialize(responseText);
    if (result.type === 'success' || result.type === 'failure') {
      if (result.type === 'success') {
        activities = activities.filter((_, i) => i !== posActivity);
      }
      toast?.view({
        type: result.type,
        message: result.data?.message,
        time: 3000
      });
    }
  }
}

async function handleSend(index: number) {
  const activityId = activities[index].activity_id.toString();
  goto(`/teacher/topic/activity/send?topicId=${topic.topic_id}&activityId=${activityId}`);
}

</script>

<Toast bind:this={toast} />
<Dialog bind:this={dialog} action={handleActionDelete} />

<div class="container-teachers-registrations">

  <div class="wr-info-page">
    <LinkBack href="/teacher/topic">Temas</LinkBack>
    <Title>Actividades</Title>
    <p class="topic">{topic.topic}</p>
    <p class="desc">Crea actividades para el tema. Puedes crear tantas actividades como necesites.</p>
    <LinkBtn href="/teacher/topic/activity/new?topicId={topic.topic_id}" --max-width-link-btn="230px">{@html plus} Crear actividad</LinkBtn>
  </div>

  {#if activities.length !== 0}
    <div class="wrapper">
      <div class="container-rows">      
        {#each activities as row, i}
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
                <div class="info-topic"><p class="activity">{row.activity}</p></div>
                <div class="info-pay">
                  <div class="wr-activity-time">
                    <p>{typeActivity(row.type_general)}</p>
                    <p>
                      {#if row.type_general === 'V'}
                        Tiempo: {row.time} min
                      {/if}
                    </p>
                  </div>

                  {#if row.items !== null || row.file !== null}
                    {#if row.has_inbox === 0}
                      <button class="none-send unlerline" onclick={()=>handleSend(i)}>Enviar actividad</button>
                    {:else}
                      <button class="send unlerline" onclick={()=>handleSend(i)}>Asignaturas</button>
                    {/if}
                  {:else}
                    <div class="red mt">La actividad no tiene ejercicios</div>
                  {/if}

                </div>
                <div class="box-select">
                  <OptionSelect>
                    <a href="/teacher/topic/activity/exercises?topicId={topic.topic_id}&activityId={row.activity_id}&origin=activity">{@html fileText} <span>Ejercicios</span></a>
                    <a href="/teacher/topic/activity/edit?topicId={topic.topic_id}&activityId={row.activity_id}">{@html pencil} <span>Editar</span></a>
                    <button onclick={()=>handleActionShowWin(i)}>{@html trash} <span>Eliminar</span></button>
                  </OptionSelect>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>

    </div>
  {/if}

</div>

{#if activities.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay actividades en el tema</NoneData>
  </div>
{/if}

<style>
.mt {
  margin-top: 5px;
}
.send {
  color: #017368;
  width: max-content;
  background: transparent;
  font-family: var(--font-normal);
  font-size: 1em;
  cursor: pointer;
  margin-top: 5px;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
.none-send {
  color: brown;
  width: max-content;
  background: transparent;
  font-family: var(--font-normal);
  font-size: 1em;
  cursor: pointer;
  margin-top: 5px;
}
.activity {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-weight: 700;
}
.topic {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-weight: 700;
  color: brown;
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
:global {
  .svg-subject > svg {
    width: 14px;
    color: #fff;
    stroke-width: 3px;
  }
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
  height: 40%;
}
.box-b {
  height: 60%;
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
}
@media(min-width: 600px) {
  .wr-activity-time {
    display: flex;
    gap: 1em;
  }
}
@media(min-width: 800px) {
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
