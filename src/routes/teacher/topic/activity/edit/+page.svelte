<script lang="ts">
import { page } from '$app/state';
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast, Select } from '$lib/components';
import { validateString, filtrarParametros } from '$lib/utils';
const search = filtrarParametros(page.url.href, ['topicId']);

let { data } = $props();
let btnSave = $state<Button>();
let toast = $state<Toast | null>(null);
let time = $state(20);
let error = $state('');
let input = $state('');

const topic = data.result?.topic;

type Activity = {
  activity_id: number;
  activity: string;
  type_general: string;
  time: number;
};

type Error = {
  value: string;
  input: string;
  message: string;
}

let activity: Activity = data.result?.activity;
let type_general = $state(activity.type_general);

const handleForm: SubmitFunction = ({ formData, cancel }) => {

  try {
    error = '';
    input = '';

    const activity = formData.get('activity') as string;
    const topicResult = validateString(activity);
    if (!topicResult.success) {
      throw {value: activity, message: 'El nombre de la actividad requerido', input: 'activity'};
    }
    const type = formData.get('type_general') as string;
    if (!type) {
      throw {value: type_general, message: 'Selecciona el tipo de actividad', input: 'type_general'};
    }
    if (type_general === 'V') {
      const time = Number(formData.get('time'));
      if (time === 0) {
        throw {value: time, message: 'Escribe el tiempo de la actividad', input: 'time'};
      }
    }

    btnSave?.load(true);

    return async ({ result, update }) => {
      if (result.type === 'failure') {
        btnSave?.load(false);
        toast?.view({
          type: result.type,
          message: result.data?.message,
          time: 3000
        });
      } else {
        await update();
      }
    };

  } catch (err) {
    btnSave?.load(false);
    const _error = err as Error;
    error = _error.message;
    input = _error.input;
    cancel();
  }

};

function handleChangeType(e: Event) {
  const target = e.target as HTMLSelectElement;
  type_general = target.value;
}

</script>

<Toast bind:this={toast} />

<div class="wr-form-reg">
  <DataFrame width="500px">
    <LinkBack href="/teacher/topic/activity?{search}">Temas</LinkBack>
    <form class="wr-form" method="POST" use:enhance={handleForm} novalidate>
      <Title>Crear actividad</Title>
      <div class="body-form">
        <p class="topic">{topic.topic}</p>
        <Input 
          style="border" type="text" requested label="Nombre de la actividad" 
          error={error} input={input} name="activity" value={activity.activity} />
        <Select label="Tipo de actividad" name="type_general" error={error} input={input} onchange={handleChangeType} value={activity.type_general}>
          <option value=""></option>
          <option value="R">Actividad de repaso</option>
          <option value="V">Actividad valorativa</option>
        </Select>
        {#if type_general.length !== 0 && type_general === 'V'}
          <Input 
            style="border" type="number" requested label="Tiempo de la actividad" 
            value={time} error={error} input={input} 
            name="time" />
        {/if}
        <input type="hidden" value={topic.topic_id} name="topicId" />
        <input type="hidden" value={activity.activity_id} name="activityId" />
      </div>
      <div class="wr-btns">
        <Button bind:this={btnSave}>Actualizar</Button>
      </div>
    </form>
  </DataFrame>
</div>

<style>
.topic {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
  font-weight: 700;
  color: brown;
  margin-bottom: 1em;
}
:global {
  .btn-remove:hover {
    background: #ffe5e5;
  }
  .btn-remove > svg {
    width: 20px;
    color: red;
  }
}
.wr-btns {
  display: flex;
  gap: 1em;
}
.wr-form-reg {
  display: flex;
  justify-content: center;
  background: #fff;
}
.wr-form {
  margin: 0 auto;
  width: 100%;
}
.body-form {
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
@media(min-width: 700px) {
  .wr-form-reg {
    padding: 2em 1em 3em;
    background: transparent;
    box-shadow: none;
  }
}
</style>
