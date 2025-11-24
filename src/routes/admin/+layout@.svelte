<script lang="ts">
	import logout from '$lib/assets/svg/log-out.svg?raw';
	import newTeacher from '$lib/assets/svg/user-pen.svg?raw';
	import teachers from '$lib/assets/svg/users.svg?raw';
	import perfil from '$lib/assets/svg/settings.svg?raw';
	import mail from '$lib/assets/svg/mail-question-mark.svg?raw';
  import { Header, Main, UserMenu } from '$lib/components';
  import { onMount } from 'svelte';
  import type { LayoutData  } from './$types';
  import type { MenuOption, DataProfile } from '$lib/types';
  import { userStore } from '$lib/store';
  import { NAME_APP } from "$lib/utils";

	let { data, children }: { data: LayoutData; children: any } = $props();
  let isVisible: boolean = $state(false);

  let user: DataProfile = $state({
    name: data.user?.name,
    surnames: data.user?.surnames,
    email: data.user?.email,
    //photo: data.user?.photo?.length === 0 ? '' : `${R2_DOMAIN}/${FOLDER_USER_PHOTOS}/${data.user?.photo}`,
    photo: data.user?.photo,
    profile: data.user?.profile
  });
  userStore.data = user;

  let info: DataProfile = $derived(userStore.data ?? {});
  onMount(()=>{
    if (Object.entries(data).length !== 0) {
      isVisible = true;
    }
  })

  // Opciones para Admin
  const adminOptions: MenuOption[] = [
    { label: 'Inscripciones', icon: mail, href: '/admin/pre-registration' },
    { label: 'Nuevo docente', icon: newTeacher, href: '/admin/new-teacher' },
    { label: 'Administrar docentes', icon: teachers, href: '/admin/teachers' },
    { label: 'Mi Perfil', icon: perfil, href: '/admin/profile' },
    { label: 'Cerrar Sesión', icon: logout, href: '/logout' }
  ];

</script>

<svelte:head>
  <style>
  body { background-color: #fafafa; }
  </style>
  <title>Admin - {NAME_APP}</title>
</svelte:head>

{#if isVisible}
  <Header bg fixed>
    <a class="link-logo" href="/"><img src="/images/logo-quicktest.svg" alt=""/></a>
    <UserMenu info={info} options={adminOptions} />
  </Header>
  <Main fixed>
    <div class="section">
      {@render children()}
    </div>
  </Main>
{/if}

