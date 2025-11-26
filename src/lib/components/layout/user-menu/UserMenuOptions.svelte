<script lang="ts">
import { page } from '$app/state';
import type { MenuOption } from '$lib/types';
let { options = [], onclick = ()=>{} }: { options: MenuOption[], onclick: ()=>void } = $props();
let urlCurrent = $state('');
$effect(()=>{
  urlCurrent = page.url.pathname;
})

</script>

<div class="container-options-menu" {onclick} role="button" tabindex="0" onkeyup={()=>{}}>
  {#each options as option }
    <a class="link-option-menu" class:current={urlCurrent === option.href}  href={option.href}>
      {@html option.icon}
      {option.label}
    </a>
  {/each}
</div>

<style>
.container-options-menu {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}
.link-option-menu {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 0.5em;
  color: #fff;
  text-decoration: none;
  font-family: var(--font-normal);
  font-size: 1em;
  padding: 0.8em 1em;
  align-items: center;
  border-radius: 8px;
  transition: var(--transition);
}
.link-option-menu:hover {
  background: #251873;
}
.link-option-menu.current {
  background: #674ff9;
}
:global(.link-option-menu > svg) {
  width: 22px;
  color: #fff;
}
</style>
