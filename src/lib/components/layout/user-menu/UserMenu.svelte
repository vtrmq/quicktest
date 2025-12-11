<script lang="ts">
import { fade } from 'svelte/transition';
import { UserMenuButton, UserMenuContainer, UserMenuOptions, UserMenuInfo } from './index';
import type { DataProfile, MenuOption } from '$lib/types';

type Props = {
  info: DataProfile
  options: MenuOption[]
}
let { info = {photo: '', name: '', surnames: '', email: '', profile: ''}, options = [] }: Props = $props();
let isOpen = $state(false);

function toggleMenu() {
  isOpen = !isOpen;
}

function handleKeydown(e:KeyboardEvent) {
  if (isOpen && e.key === 'Escape') {
    toggleMenu();
  }
}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
<div 
  class="user-menu" 
  onclick={toggleMenu} role="button" tabindex="0" onkeyup={()=>{}} transition:fade={{ duration: 200 }}></div>
{/if}
<UserMenuButton photo={info.photo} onclick={toggleMenu} />
<UserMenuContainer {isOpen}>
  <UserMenuInfo {info} />
  <UserMenuOptions {options} onclick={toggleMenu} />
</UserMenuContainer>

<style>
.user-menu {
  position: relative;
  display: block;
  background: var(--bg-screen);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
