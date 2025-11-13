<script lang="ts">
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import type { UserRegister } from '$lib/types';
  import { Title, LinkBack } from '$lib/components';
  let { data, form }: {data: PageData, form: ActionData} = $props();
  let user: UserRegister | null = data.user;

  $effect(() => {
    if (form) {
      console.log(form)
    }
  });

  const handleForm: SubmitFunction = () => {
    return async ({ update }) => {
      await update();
    };
  };

</script>

{#if data.success && user?.profile === 'T'}
  <h1>Register teacher</h1>

  <form method="POST" use:enhance={handleForm}>
    <div class="body-form">
      <input type="text" name="name" value={form?.data?.name ?? user.name}>
      <input type="text" name="surnames" value={form?.data?.surnames ?? user.surnames}>
      <input type="text" name="email" value={form?.data?.email ?? user.email}>
      <input type="text" name="phone" value={form?.data?.phone ?? user.phone} placeholder="Phone">
      <input type="text" name="password" value={form?.data?.password ?? ''} placeholder="Password">
      <input type="hidden" name="profile" value={user.profile}>
      <input type="hidden" name="user_id" value={user.user_id}>
      <input type="hidden" name="code" value={user.code}>
      <button>Registrarme</button>
    </div>
  </form>

{:else if data.success && user?.profile === 'S'}
  <h1>Register student</h1>
  <p>Name: {user.name} {user.surnames}</p>
{:else if !data.success}
  <div class="wr">
    <LinkBack href="/">Home</LinkBack>
    <Title>Información</Title>
    <p class="msg-error">{data.error}</p>
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
form {
  max-width: 300px;
  margin: 0 auto;
  width: 100%;
}
.body-form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
form input, form button {
  padding: 0.5em 1em;
}
</style>
