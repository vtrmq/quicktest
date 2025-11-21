<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { PageData } from './$types';
  import { FOLDER_USER_PHOTOS, R2_DOMAIN } from '$lib/utils';
  import { Title, Input, Button, Toast, AddImage } from '$lib/components';
  import { userStore } from '$lib/store';
  import type { UserActionResponse, UserActionEmail, UserActionCode, UserActionPassw } from '$lib/types';
	import send from '$lib/assets/svg/send.svg?raw';
	import asterisk from '$lib/assets/svg/asterisk.svg?raw';
	import ban from '$lib/assets/svg/ban.svg?raw';
	import save from '$lib/assets/svg/save.svg?raw';

  let { data }: { data: PageData } = $props();
  let toast = $state<Toast>();

  let btnLogin = $state<Button>();
  let photo = $derived(userStore.data.photo);
  let formTab = $state('info');
  let isTabMail = $state('sendMail');
  let isTabPassw = $state('sendMail');

  let resultServerInfo: UserActionResponse = $state({
    error: '',
    input: '',
    success: false,
    user:{ 
      name: data.user?.name ?? '', 
      surnames: data.user?.surnames ?? '', 
      phone: data.user?.phone ?? '' 
    }
  });

  let resultServerEmail: UserActionEmail = $state({
    error: '',
    input: '',
    success: false,
    resp:{ 
      password: '', 
      new_mail: '', 
    }
  });

  let resultServerCode: UserActionCode = $state({
    success: false,
    code: '',
    error: '',
    input: '',
    email: '',
  });

  let resultServerPassw: UserActionPassw = $state({
    error: '',
    input: '',
    success: false,
    resp:{ 
      password: '', 
      new_password: '', 
    }
  });

  function tabForm(tab: string) {
    formTab = tab;
    isTabMail = 'sendMail';
    isTabPassw = 'sendMail';

    // RESET INPUST
    // ============

    resultServerInfo = {
      error: '',
      input: '',
      success: false,
      user:{ 
        name: data.user?.name ?? '', 
        surnames: data.user?.surnames ?? '', 
        phone: data.user?.phone ?? '' 
      }
    };

    resultServerEmail = {
      error: '',
      input: '',
      success: false,
      resp:{ 
        password: '', 
        new_mail: '', 
      }
    };

    resultServerCode = {
      success: false,
      code: '',
      error: '',
      input: '',
      email: '',
    };

    resultServerPassw = {
      error: '',
      input: '',
      success: false,
      resp:{ 
        password: '', 
        new_password: '', 
      }
    };


  }
  
  const handleFormUser: SubmitFunction = () => {
    btnLogin?.load(true);
     
    return async ({ result }) => {
      btnLogin?.load(false);
      //resultServer = (result as unknown as { data?: ActionData }).data;
      //resultServerInfo = (result as any).data;
      if (result.type === 'success') {
        resultServerInfo = result.data as UserActionResponse;
        userStore.info(resultServerInfo.user);
        toast?.view({
          type: 'success',
          message: 'Datos actualizados',
        });
      } else if (result.type === 'failure') {
        resultServerInfo = result.data as UserActionResponse;
      }
    };
  };

  const handleFormEmail: SubmitFunction = () => {
    btnLogin?.load(true);
     
    return async ({ update, result }) => {
      btnLogin?.load(false);
      if (result.type === 'success') {
        //resultServerEmail = result.data as UserActionEmail;
        toast?.view({
          type: 'success',
          message: 'Email enviado',
        });
        await update();
      } else if (result.type === 'failure' && result.data?.input !== '') {
        resultServerEmail = result.data as UserActionEmail;
      } else if (result.type === 'failure' && result.data?.input === '') {
        resultServerEmail = result.data as UserActionEmail;
        toast?.view({
          type: 'success',
          message: result.data.error,
        });
      }
    };
  };


  const handleFormCodeEmail: SubmitFunction = () => {
    btnLogin?.load(true);
    resultServerCode = { success: false, code: '', error: '', input: '', email: '' };
    return async ({ result }) => {
      btnLogin?.load(false);
      if (result.type === 'success') {
        resultServerCode = result.data as UserActionCode;
        userStore.email(resultServerCode.email);
        toast?.view({
          type: 'success',
          message: 'Correo electrónico actualizado',
        });
      } else if (result.type === 'failure') {
        resultServerCode = result.data as UserActionCode;
      }
    };
  };

  const handleFormPassword: SubmitFunction = () => {
    btnLogin?.load(true);
     
    return async ({ update, result }) => {
      btnLogin?.load(false);
      if (result.type === 'success') {
        toast?.view({
          type: 'success',
          message: 'Email enviado',
        });
        await update();
      } else if (result.type === 'failure' && result.data?.input !== '') {
        resultServerPassw = result.data as UserActionPassw;
      } else if (result.type === 'failure' && result.data?.input === '') {
        resultServerPassw = result.data as UserActionPassw;
        toast?.view({
          type: 'success',
          message: result.data.error,
        });
      }
    };
  };

  const handleFormCodePassword: SubmitFunction = () => {
    btnLogin?.load(true);
    resultServerCode = { success: false, code: '', error: '', input: '', email: '' };
    return async ({ result }) => {
      btnLogin?.load(false);
      if (result.type === 'success') {
        resultServerCode = result.data as UserActionCode;
        toast?.view({
          type: 'success',
          message: 'Contraseña actualizada',
        });
      } else if (result.type === 'failure') {
        resultServerCode = result.data as UserActionCode;
      }
    };
  };

  function handleViewInputCodeEmail(opt: string) {
    isTabMail = opt;
    resultServerEmail = { error: '', input: '', success: false, resp:{ password: '', new_mail: '', } };
    resultServerCode = { success: false, code: '', error: '', input: '', email: '' };
  }

  function handleViewInputCodePassw(opt: string) {
    isTabPassw = opt;
    resultServerPassw = { error: '', input: '', success: false, resp:{ password: '', new_password: '' } };
    resultServerCode = { success: false, code: '', error: '', input: '', email: '' };
  }

  function handleEventPhoto(e: string) {
    photo = e;
  }

</script>

<Toast bind:this={toast} />

<div class="container-profile">
  <div class="header-top"></div>
  <div class="container-body">

    <div class="section">
      <div class="part">
        <div class="box-photo">
          <img src={photo === null || photo?.length === 0 ? '/images/user.png' : `${R2_DOMAIN}/${FOLDER_USER_PHOTOS}/${photo}`} alt="" class="user-photo" />
          <AddImage photo={photo === null || photo?.length === 0 ? '/images/user.png' : `${R2_DOMAIN}/${FOLDER_USER_PHOTOS}/${photo}`} onchange={handleEventPhoto} /> <!--  onchange={handleEventPhoto} -->
        </div>
      </div>
    </div>

    <div class="wr-section">
      <div class="section">
        <div class="wr-menu">
          <button class="btn-option" class:rs={formTab === 'info'} onclick={()=>tabForm('info')}>Mis datos</button>
          <button class="btn-option" class:rs={formTab === 'mail'} onclick={()=>tabForm('mail')}>Email</button>
          <button class="btn-option" class:rs={formTab === 'passw'} onclick={()=>tabForm('passw')}>Contraseña</button>
        </div>

        {#if formTab === 'info'}

          <form method="POST" action="?/user" use:enhance={handleFormUser} novalidate>
            <Title>Actualizar datos</Title>
            <div class="body-form">
              <Input 
                style="border" type="text" requested label="Nombre" 
                bind:value={resultServerInfo.user.name} 
                error={resultServerInfo.error} input={resultServerInfo.input} 
                name="name" />
              <Input 
                style="border" type="text" requested label="Apellidos" 
                value={resultServerInfo.user.surnames} 
                error={resultServerInfo.error} input={resultServerInfo.input} 
                name="surnames" />
              <Input 
                style="border" type="text" requested label="Celular" 
                value={resultServerInfo.user.phone} 
                error={resultServerInfo.error} input={resultServerInfo.input} 
                name="phone" />
            </div>
            <Button icon={save} bind:this={btnLogin}>Guardar</Button>
          </form>

        {:else if formTab === 'mail'}

          <Title>Actualizar Email</Title>

          {#if isTabMail === 'sendMail'}
          <form method="POST" action="?/email" use:enhance={handleFormEmail} novalidate>
            <div class="body-form">
              <Input 
                style="border" type="password" requested label="Contraseña" 
                value={resultServerEmail.resp.password} 
                error={resultServerEmail.error} input={resultServerEmail.input} 
                name="password" />
              <Input 
                style="border" type="text" requested label="Nuevo correo electrónico" 
                value={resultServerEmail.resp.new_mail} 
                error={resultServerEmail.error} input={resultServerEmail.input} 
                name="new_mail" />
            </div>
            <div class="wr-code">
              <Button icon={asterisk} type="button" onclick={()=>handleViewInputCodeEmail('sendCode')}>Código</Button>
              <Button icon={send} bind:this={btnLogin} bg="cadetblue">Enviar email</Button>
            </div>
          </form>

          {:else if isTabMail === 'sendCode'}

            <form method="POST" action="?/code_mail" use:enhance={handleFormCodeEmail} novalidate>
              <div class="body-form">
                <Input 
                  style="border" type="text" requested label="Código" 
                  error={resultServerCode.error} input={resultServerCode.input ?? ''} 
                  name="code" />
              </div>
              <div class="wr-code">
                <Button icon={ban} type="button" onclick={()=>handleViewInputCodeEmail('sendMail')} bind:this={btnLogin} bg="cadetblue">Cancelar</Button>
                <Button icon={save} bind:this={btnLogin}>Actualizar</Button>
              </div>
            </form>
          {/if}


        {:else if formTab === 'passw'}

          <Title>Actualizar contraseña</Title>

          {#if isTabPassw === 'sendMail'}
          <form method="POST" action="?/password" use:enhance={handleFormPassword} novalidate>
            <div class="body-form">
              <Input 
                style="border" type="password" requested label="Contraseña" 
                value={resultServerPassw.resp.password} 
                error={resultServerPassw.error} input={resultServerPassw.input} 
                name="password" />
              <Input 
                style="border" type="password" requested label="Nueva contraseña" 
                value={resultServerPassw.resp.new_password} 
                error={resultServerPassw.error} input={resultServerPassw.input} 
                name="new_password" />
            </div>
            <div class="wr-code">
              <Button icon={asterisk} type="button" onclick={()=>handleViewInputCodePassw('sendCode')}>Código</Button>
              <Button icon={send} bind:this={btnLogin} bg="cadetblue">Enviar email</Button>
            </div>
          </form>

          {:else if isTabPassw === 'sendCode'}

            <form method="POST" action="?/code_passw" use:enhance={handleFormCodePassword} novalidate>
              <div class="body-form">
                <Input 
                  style="border" type="text" requested label="Código" 
                  error={resultServerCode.error} input={resultServerCode.input ?? ''} 
                  name="code" />
              </div>
              <div class="wr-code">
                <Button icon={ban} type="button" onclick={()=>handleViewInputCodePassw('sendMail')} bind:this={btnLogin} bg="cadetblue">Cancelar</Button>
                <Button icon={save} bind:this={btnLogin}>Actualizar</Button>
              </div>
            </form>
          {/if}

        {/if}

      </div>

    </div>


  </div>
</div>


<style>
.wr-code {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  gap: 0.5em;
}
.wr-menu {
  display: flex;
  justify-content: center;
  gap: 0.3em;
  margin-bottom: 1.5em;
}
.btn-option {
  padding: 0.3em 1em;
  border-radius: 50px;
  cursor: pointer;
  font-family: var(--font-normal);
  font-size: 1.3em;
  color: #6049eb;
  background: #f0edfd;
  font-weight: 600;
  transition: var(--transition);
}
.btn-option.rs {
  color: #FFFFFF;
  background-color: #7770FF;
}
.container-profile {
  display: flex;
  justify-content: center;
}
.wr-section {
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 100%;
}
.body-form {
  margin-top: 1em;
  margin-bottom: 1.4em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.part {
  display: flex;
  justify-content: center;
}
.box-photo {
  width: 172px;
  height: 170px;
  display: flex;
  position: relative;
}
.box-photo > .user-photo {
  width: 100%;
  height: 170px;
  border-radius: 160px;
  object-fit: cover;
  align-self: baseline;
}
.section {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 2em 1em;
  box-shadow: rgb(100 100 111 / 22%) 0px 7px 29px 0px;
  /*filter: drop-shadow(0px 4px 16px rgba(155, 155, 155, 0.1));*/
}
.container-body {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1.5em 1em;
  flex-direction: column;
  gap: 2em;
}
.header-top {
  background: #6049ea;
  width: 100%;
  height: 200px;
  position: absolute;
}
@media(min-width: 700px) {
  .wr-code {
    gap: 1em;
  }
}
@media(min-width: 800px) {
  .container-body {
    max-width: 1000px;
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: flex-start;
  }
  .section {
    padding: 2em 4em;
  }
}
</style>
