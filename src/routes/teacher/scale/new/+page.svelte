<script lang="ts">
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';
import { validateString } from '$lib/utils';

let btnSave = $state<Button>();
let toast = $state<Toast>();

let inputForm = $state({
  message: '',
  input: '',
  origin: '',
});

type Error = {
  message: string,
  input: string,
  origin: 'form' | 'server',
}

const handleForm: SubmitFunction = ({ formData, cancel }) => {

  try {
    const scale = formData.get('scale') as string;
    const scaleResult = validateString(scale);
    if (!scaleResult.success) {
      throw {value: scale, message: 'El nombre de la escala es requerido', input: 'scale', origin: 'form'};
    }

    const min_value = formData.get('min_value') as string;
    const minValueResult = validateString(min_value);
    if (!minValueResult.success) {
      throw {value: min_value, message: 'La nota mínima es requerida', input: 'min_value', origin: 'form'};
    }

    const max_value = formData.get('max_value') as string;
    const maxValueResult = validateString(max_value);
    if (!maxValueResult.success) {
      throw {value: max_value, message: 'La nota máxima es requerida', input: 'max_value', origin: 'form'};
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
    if (error.origin === 'form') {
      inputForm = error;
    }
  }
};

</script>

<Toast bind:this={toast} />

<div class="wr-form-reg">
  <DataFrame width="500px">
    <LinkBack href="/teacher/scale">Escala valorativa</LinkBack>
    <form class="wr-form" method="POST" use:enhance={handleForm} novalidate>
      <Title>Nueva escala valorativa</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre de la escala" 
          error={inputForm.message} input={inputForm.input} 
          name="scale" />
      </div>
      <Title>Rango de valores</Title>
      <div class="body-form">
        <div class="row-subject">
          <Input 
            style="border" type="number" requested label="Nota mínima" 
            error={inputForm.message} input={inputForm.input} 
            name="min_value" />
          <Input 
            style="border" type="number" requested label="Nota máxima" 
            error={inputForm.message} input={inputForm.input} 
            name="max_value" />
        </div>
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
