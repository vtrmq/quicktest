<script lang="ts">

import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import type { PageData, ActionData } from './$types';
import type { UserRegister } from '$lib/types';
import { Title, LinkBack, Input, Button } from '$lib/components';
let { data, form }: {data: PageData, form: ActionData} = $props();
let user: UserRegister = data.user as UserRegister;
let btnSave = $state<Button>();

//console.log(data)
//$effect(() => { if (form) { console.log(form) } });

const handleForm: SubmitFunction = () => {
  btnSave?.load(true);
  return async ({ result, update }) => {
    //console.log(result)
    if (result.type === 'failure') {
      btnSave?.load(false);
    }
    await update();
  };
};

</script>

{#if data.success && user?.profile === 'T'}

  <Title>Registro de docente</Title>

  <form method="POST" use:enhance={handleForm} novalidate>
    <div class="body-form">

      <Input 
        style="border" type="text" requested label="Nombre" 
        value={form?.field?.name ?? user.name} error={form?.msg} input={form?.input ?? ''} 
        name="name" />

      <Input 
        style="border" type="text" requested label="Apellidos" 
        value={form?.field?.surnames ?? user.surnames} error={form?.msg} input={form?.input ?? ''} 
        name="surnames" />

      <Input 
        style="border" type="email" requested label="Correo electrónico" 
        value={user.email} disabled />

      <Input 
        style="border" type="text" requested label="Celular" 
        value={form?.field?.phone ?? user.phone} error={form?.msg} input={form?.input ?? ''} 
        name="phone" />

      <Input 
        style="border" type="password" requested label="Contraseña" 
        value={form?.field?.password ?? ''} error={form?.msg} input={form?.input ?? ''} 
        name="password" />

      <Input 
        style="border" type="text" requested label="Nombre de la institución educativa" 
        value={form?.field?.school ?? ''} error={form?.msg} input={form?.input ?? ''} 
        name="school" capitalize />
      
      <input type="hidden" name="email" value={user.email}>
      <input type="hidden" name="profile" value={user.profile}>
      <input type="hidden" name="user_id" value={user.user_id}>
      <input type="hidden" name="code" value={user.code}>

    </div>
    <Button bind:this={btnSave}>Registrarme</Button>
  </form>

{:else if data.success && user?.profile === 'S'}
  <h1>Register student</h1>
  <p>Name: {user.name} {user.surnames}</p>
{:else if !data.success}
  <div class="wr">
    <LinkBack href="/">Home</LinkBack>
    <Title>Información</Title>
    <p class="msg-error">{data.message}</p>
  </div>
{/if}

<style>
.wr {
  display: grid;
  grid-template-rows: 26px 40px;
  gap: 1em;
}
.msg-error {
  font-family: var(--font-normal);
  font-size: var(--font-size);
}
.body-form {
  margin-top: 1em;
  margin-bottom: 2em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
