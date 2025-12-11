<script lang="ts">
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';
import { validateString } from '$lib/utils';

let btnSave = $state<Button>();
let toast = $state<Toast>();
let { data } = $props();

let scale = data.scale.scale;
let minValue = data.scale.min_value;
let maxValue = data.scale.max_value;
let scaleId = data.scale.scale_id;

let inputForm = $state({
  message: '',
  input: '',
});

type Error = {
  message: string,
  input: string,
}

const handleForm: SubmitFunction = ({ formData, cancel }) => {

  try {
    const scale = formData.get('scale') as string;
    const scaleResult = validateString(scale);
    if (!scaleResult.success) {
      throw {message: 'El nombre de la escala es requerido', input: 'scale'};
    }

    const min_value = formData.get('min_value') as string;
    const minValueResult = validateString(min_value);
    if (!minValueResult.success) {
      throw {message: 'La nota mínima es requerida', input: 'min_value'};
    }

    const max_value = formData.get('max_value') as string;
    const maxValueResult = validateString(max_value);
    if (!maxValueResult.success) {
      throw {message: 'La nota máxima es requerida', input: 'max_value'};
    }

    btnSave?.load(true);
    return async ({ update, result }) => {
      if (result.type === 'failure') {
        btnSave?.load(false);
        toast?.view({
          type: result.type,
          message: result.data?.message,
          time: 3000
        });
      }
      await update();
    };

  } catch (err) {
    cancel();
    const error = err as Error;
    inputForm = error;
  }
};

</script>

<Toast bind:this={toast} />

<div class="wr-form-reg">
  <DataFrame width="500px">
    <LinkBack href="/teacher/scale">Escala valorativa</LinkBack>
    <form class="wr-form" method="POST" use:enhance={handleForm} novalidate>
      <Title>Actualizar escala valorativa</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre de la escala" 
          value={scale} error={inputForm.message} input={inputForm.input} 
          name="scale" />
      </div>
      <Title>Rango de valores</Title>
      <div class="body-form">
        <div class="row-subject">
          <Input 
            style="border" type="number" requested label="Nota mínima" 
            error={inputForm.message} input={inputForm.input} 
            value={minValue} name="min_value" />
          <Input 
            style="border" type="number" requested label="Nota máxima" 
            error={inputForm.message} input={inputForm.input} 
            value={maxValue} name="max_value" />
        </div>
        <input type="hidden" value={scaleId} name="scale_id" />
      </div>
      <div class="wr-btns">
        <Button bind:this={btnSave}>Guardar</Button>
      </div>
    </form>
  </DataFrame>
</div>

<style>
:global {
  .btn-remove:hover {
    background: #ffe5e5;
  }
  .btn-remove > svg {
    width: 20px;
    color: red;
  }
}
.row-subject {
  display: flex;
  align-items: center;
  gap: 1em;
}
.wr-btns {
  display: flex;
  gap: 2em;
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
