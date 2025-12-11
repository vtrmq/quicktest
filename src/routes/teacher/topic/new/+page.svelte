<script lang="ts">
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';
import { validateString } from '$lib/utils';

let btnSave = $state<Button>();
let toast = $state<Toast | null>(null);
let topic = $state('');
let error = $state('');
let input = $state('');

type Error = {
  value: string;
  input: string;
  message: string;
}

const handleForm: SubmitFunction = ({ formData, cancel }) => {

  try {
    error = '';
    input = '';

    const topic = formData.get('topic') as string;
    const topicResult = validateString(topic);
    if (!topicResult.success) {
      throw {value: topic, message: 'El nombre del tema es requerido', input: 'topic'};
    }
    btnSave?.load(true);

    return async ({ result, update }) => {
      if (result.type === 'failure') {
        btnSave?.load(false);
        if (result.data?.origin === 'server') {
          toast?.view({
            type: result.type,
            message: result.data?.message,
            time: 3000
          });
        } else if (result.data?.origin === 'form') {
          error = result.data?.message;
          input = 'topic';
        }
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

</script>

<Toast bind:this={toast} />

<div class="wr-form-reg">
  <DataFrame width="500px">
    <LinkBack href="/teacher/topic">Temas</LinkBack>
    <form class="wr-form" method="POST" use:enhance={handleForm} novalidate>
      <Title>Crear tema</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre del tema" 
          value={topic} error={error} input={input} 
          name="topic" />
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
