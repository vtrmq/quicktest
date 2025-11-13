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
    { label: 'Pre registros', icon: mail, href: '/admin/pre-registration' },
    { label: 'Nuevo docente', icon: newTeacher, href: '/admin/new-teacher' },
    { label: 'Administrar docentes', icon: teachers, href: '/' },
    { label: 'Mi Perfil', icon: perfil, href: '/admin/profile' },
    { label: 'Cerrar Sesión', icon: logout, href: '/logout' }
  ];

</script>

{#if isVisible}
  <Header bg fixed>
    <div><a href="/">QuickTest</a></div>
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
