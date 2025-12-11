<script lang="ts">
	import logout from '$lib/assets/svg/log-out.svg?raw';
	import account from '$lib/assets/svg/user-pen.svg?raw';
	import setting from '$lib/assets/svg/settings.svg?raw';
	import inbox from '$lib/assets/svg/inbox.svg?raw';
	import activity from '$lib/assets/svg/folder-pen.svg?raw';
	import course from '$lib/assets/svg/folder-tree.svg?raw';
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
    { label: 'Bandeja de entrada', icon: inbox, href: '/teacher/inbox' },
    { label: 'Cursos', icon: course, href: '/teacher/course' },
    { label: 'Temas', icon: activity, href: '/teacher/topic' },
    { label: 'Escala valorativa', icon: setting, href: '/teacher/scale' },
    { label: 'Mi Perfil', icon: account, href: '/teacher/profile' },
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

<style>
.section {
  padding: 1em;
}
</style>
