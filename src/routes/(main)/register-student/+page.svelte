<script lang="ts">

import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import type { PageData, ActionData } from './$types';
import { Title, Input, Button } from '$lib/components';
let { form }: {data: PageData, form: ActionData} = $props();
let btnSave = $state<Button>();
let isSend = $state(false);
let email = $state('');

const handleForm: SubmitFunction = () => {
  btnSave?.load(true);
  return async ({ result, update }) => {
    btnSave?.load(false);
    if (result.type === 'failure') {
      await update();
    } else if (result.type === 'success') {
      email = result.data?.email;
      isSend = true;
    }
  };
};

</script>

{#if !isSend}
  <Title>Registro de estudiante</Title>
  <form method="POST" use:enhance={handleForm} novalidate>
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
        value={form?.field?.email ?? ''} error={form?.msg} input={form?.input ?? ''} name="email" />

      <Input 
        style="border" type="text" requested label="Celular" 
        value={form?.field?.phone ?? ''} error={form?.msg} input={form?.input ?? ''} 
        name="phone" />

      <Input 
        style="border" type="password" requested label="Contraseña" 
        value={form?.field?.password ?? ''} error={form?.msg} input={form?.input ?? ''} 
        name="password" />

      <Input 
        style="border" type="text" requested label="Código del curso" 
        value={form?.field?.code ?? ''} error={form?.msg} input={form?.input ?? ''} 
        name="code" />

    </div>
    <Button bind:this={btnSave}>Registrarme</Button>
  </form>
{:else}
  <Title>Datos enviados</Title>
  <div class="box-send">
    <p class="msg">Tus datos fueron enviados con éxito. Entra en el correo electrónico {email.length !== 0 ? `(${email})` : ''} y activa tu cuenta.</p>
    <p class="msg">No olvides revisar la sección de los correos no deseados</p>
  </div>
{/if}


<style>
:global {
  .code-r {
    color: red;
    text-decoration: underline;
    text-underline-offset: 6px;
    text-decoration-thickness: 1px;
  }
}
.msg {
  font-family: var(--font-normal);
  line-height: 25px;
}
.box-send {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.body-form {
  margin-top: 1em;
  margin-bottom: 2em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
