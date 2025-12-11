<script lang="ts">
  import type { ActionData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { DataFrame, Title, Input, Button } from '$lib/components';
  let { form }: { form: ActionData } = $props();
  let btnLogin = $state<Button>();
  /*
  $effect(() => {
    if (form) {
      console.log(form)
    }
  });
  */
  const handleForm: SubmitFunction = () => {
    btnLogin?.load(true);
    return async ({ update, result }) => {
      if (result.type === 'failure') {
        btnLogin?.load(false);
      }
      await update();
    };
  };

</script>

<!-- vtrmq09@gmail.com admin123, vtrmq@hotmail.com 123456 -->

<div class="wr-form-login">
  <DataFrame width="400px">
    <form method="POST" use:enhance={handleForm} novalidate>
      <Title>Iniciar sesión</Title>
      <div class="body-form">
        <Input 
          style="linear" type="text" requested label="Correo electrónico" 
          value={form?.data?.email ?? ''} error={form?.error} input={form?.input ?? ''} 
          name="email" />
        <Input 
          style="linear" type="password" requested label="Contraseña" 
          value={form?.data?.password ?? ''} error={form?.error} input={form?.input ?? ''} 
          name="password" />
      </div>
      <Button bind:this={btnLogin}>Login</Button>
    </form>
  </DataFrame>
</div>

<style>
  .wr-form-login {
    display: flex;
    justify-content: center;
    padding: 1em;
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
</style>
