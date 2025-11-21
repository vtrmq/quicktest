<script lang="ts">
import type { ActionData } from './$types';
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';

let { form }: { form: ActionData } = $props();
let btnSave = $state<Button>();
let toast = $state<Toast | null>(null);

const handleForm: SubmitFunction = () => {
  btnSave?.load(true);
  return async ({ update, result }) => {
    if (result.type === 'failure') {
      btnSave?.load(false);
      const data = result.data;
      if (data?.origin === 'form') {
        await update();
      } else if (data?.origin === 'server') {
        toast?.view({ type: 'success', message: data.message });
      }
    } else {
      await update();
    }
  };
};
</script>

<Toast bind:this={toast} />

<div class="wr-form-login">
  <DataFrame width="500px">
    <LinkBack href="/admin/pre-registration">Inscripciones</LinkBack>
    <form method="POST" use:enhance={handleForm} novalidate>
      <Title>Nuevo docente</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre" 
          value={form?.field?.name ?? ''} error={form?.msg} input={form?.input ?? ''} 
          name="name" />
        <Input 
          style="border" type="text" requested label="Apellidos" 
          value={form?.field?.surnames ?? ''} error={form?.msg} input={form?.input ?? ''} 
          name="surnames" />
        <Input 
          style="border" type="email" requested label="Correo electrónico" 
          value={form?.field?.email ?? ''} error={form?.msg} input={form?.input ?? ''} 
          name="email" lowercase />
        <Input 
          style="border" type="text" requested label="Celular" 
          value={form?.field?.phone ?? ''} error={form?.msg} input={form?.input ?? ''} 
          name="phone" />
      </div>
      <Button bind:this={btnSave}>Guardar</Button>
    </form>
  </DataFrame>
</div>

<style>
  .wr-form-login {
    display: flex;
    justify-content: center;
    padding: 2em 1em 3em;
  }
  form {
    margin: 0 auto;
    width: 100%;
  }
  .body-form {
    margin-top: 1em;
    margin-bottom: 2em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  @media(min-width: 700px) {
    .wr-form-login {
      padding: 2em 1em 3em;
    }
  }
</style>
