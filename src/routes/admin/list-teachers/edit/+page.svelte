<script lang="ts">
//import type { ActionData } from './$types';
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';
import { validateString, validateEmail } from '$lib/utils';

let { data } = $props();
let btnSave = $state<Button>();
let toast = $state<Toast | null>(null);
let error = $state('');
let input = $state('');

type Teacher = {
  id: number;
  name: string;
  surnames: string;
  email: string;
  phone: string;
};
type Error = {
  value: string;
  input: string;
  message: string;
}
let teacher: Teacher = data.teacher;

const handleForm: SubmitFunction = ({ formData, cancel }) => {
  try {
    error = '';
    input = '';

    const name = formData.get('name') as string;
    const nameResult = validateString(name);
    if (!nameResult.success) {
      throw {value: name, message: 'El nombre del docente es requerido', input: 'name'};
    }
    const surnames = formData.get('surnames') as string;
    const surnamesResult = validateString(name);
    if (!surnamesResult) {
      throw {value: surnames, message: 'Los apellidos del docente es requerido', input: 'surnames'};
    }
    const email = formData.get('email') as string;
    const emailResult = validateEmail(email);
    if (!emailResult) {
      throw {value: email, message: 'El correo electrónico es requerido', input: 'email'};
    }
    const phone = formData.get('phone') as string;
    if (!phone) {
      throw {value: phone, message: 'El celular es requerido', input: 'phone'};
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
    //btnSave?.load(false);
    const _error = err as Error;
    error = _error.message;
    input = _error.input;
    cancel();
  }
}
</script>

<Toast bind:this={toast} />

<div class="wr-form-login">
  <DataFrame width="500px">
    <LinkBack href="/admin/list-teachers">Inscripciones</LinkBack>
    <form method="POST" use:enhance={handleForm} novalidate>
      <Title>Actualizar docente</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre" 
          value={teacher.name ?? ''} error={error} input={input} 
          name="name" />
        <Input 
          style="border" type="text" requested label="Apellidos" 
          value={teacher.surnames ?? ''} error={error} input={input} 
          name="surnames" />
        <Input 
          style="border" type="email" requested label="Correo electrónico" 
          value={teacher.email ?? ''} error={error} input={input} 
          name="email" lowercase />
        <Input 
          style="border" type="text" requested label="Celular" 
          value={teacher.phone ?? ''} error={error} input={input} 
          name="phone" />
        <input name="teacherId" type="hidden" value={teacher.id} />
      </div>
      <Button bind:this={btnSave}>Actualizar</Button>
    </form>
  </DataFrame>
</div>

<style>
  .wr-form-login {
    display: flex;
    justify-content: center;
    background: #fff;
    border-radius: var(--border-radius);
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
    .wr-form-login {
      padding: 2em 1em 3em;
      background: transparent;
      box-shadow: none;
    }
  }
</style>
