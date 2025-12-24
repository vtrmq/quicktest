<script lang="ts">
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';
import { validateString } from '$lib/utils';

let btnSave = $state<Button>();
let toast = $state<Toast | null>(null);
let code = $state('');
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

    const code = formData.get('code') as string;
    const codeResult = validateString(code);
    if (!codeResult.success) {
      throw {value: code, message: 'El código del curso es requerido', input: 'code'};
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
          input = 'code';
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
    <LinkBack href="/student/subject">Mis asignaturas</LinkBack>
    <form method="POST" use:enhance={handleForm} novalidate>
      <Title>Adicionar código</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Código del curso" 
          value={code} error={error} input={input} 
          name="code" />
      </div>
      <Button bind:this={btnSave}>Guardar</Button>
    </form>
  </DataFrame>
</div>

<style>
  .wr-form-reg {
    display: flex;
    justify-content: center;
    background: #fff;
  }
  form {
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
