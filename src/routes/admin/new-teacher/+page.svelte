<script lang="ts">
  import type { ActionData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { DataFrame, Title, Input, Button, LinkBack } from '$lib/components';
	//import mail from '$lib/assets/svg/mail.svg?raw';
	//import lock from '$lib/assets/svg/lock-keyhole.svg?raw';
	//import phone from '$lib/assets/svg/phone.svg?raw';
	//import type from '$lib/assets/svg/type.svg?raw';

  let { form }: { form: ActionData } = $props();
  let btnLogin = $state<Button>();

  const handleForm: SubmitFunction = () => {
    btnLogin?.load(true);
    return async ({ update, result }) => {
      btnLogin?.load(false);
      console.log('--> new-teacher/+page.svelte', result)
      await update();
    };
  };

</script>

<!-- vtrmq09@gmail.com admin123 -->

<div class="wr-form-login">
  <DataFrame width="400px">
    <LinkBack href="/admin/pre-registration">Pre registros</LinkBack>
    <form method="POST" use:enhance={handleForm} novalidate>
      <Title>Nuevo docente</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre" 
          value={form?.data?.name ?? ''} error={form?.error} input={form?.input ?? ''} 
          name="name" />
        <Input 
          style="border" type="text" requested label="Apellidos" 
          value={form?.data?.surnames ?? ''} error={form?.error} input={form?.input ?? ''} 
          name="surnames" />
        <Input 
          style="border" type="text" requested label="Correo electrónico" 
          value={form?.data?.email ?? ''} error={form?.error} input={form?.input ?? ''} 
          name="email" />
        <Input 
          style="border" type="text" requested label="Celular" 
          value={form?.data?.phone ?? ''} error={form?.error} input={form?.input ?? ''} 
          name="phone" />
      </div>
      <Button bind:this={btnLogin}>Guardar</Button>
    </form>
  </DataFrame>
</div>

<style>
  .wr-form-login {
    display: flex;
    justify-content: center;
    padding: 2em 0;
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
      padding: 1em;
    }
  }
</style>
