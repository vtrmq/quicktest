<script lang="ts">
import ellipsisVertical from '$lib/assets/svg/ellipsis-vertical.svg?raw'
let { children } = $props();
let isOpen = $state(false);
let openUpwards = $state(false);
let triggerEl: HTMLButtonElement | null = null;
let optionsEl: HTMLDivElement | null = null;

function toggleMenu(): void {
  isOpen = !isOpen;

  if (isOpen && triggerEl && optionsEl) {
    const rect = triggerEl.getBoundingClientRect();
    const optsH = optionsEl.scrollHeight;
    const winH = window.innerHeight;
    const abajo = winH - (rect.bottom + 5);
    const arriba = rect.top;
    openUpwards = abajo < optsH && arriba > optsH;
  }
}

function handleKey(e: KeyboardEvent): void {
  if (e.key === "Escape") isOpen = false;
}

function handleClickOutside(e: MouseEvent): void {
  if (!isOpen) return;
  const t = e.target as HTMLElement;
  if (!triggerEl?.contains(t) && !optionsEl?.contains(t)) {
    isOpen = false;
  }
}

function closeMenu() {
  isOpen = false;
}
</script>

<svelte:window onkeydown={handleKey} onmousedown={handleClickOutside} />

{#if isOpen}
	<div class="backdrop" onkeyup={()=>{}} role="button" tabindex="0"></div>
{/if}

<div class="select-container">
	<button bind:this={triggerEl} class="trigger" onclick={toggleMenu}>
    {@html ellipsisVertical}
	</button>
  <div
    bind:this={optionsEl}
    class="menu-opt-select {isOpen ? 'open' : ''} {openUpwards ? 'up' : 'down'}">
    <div class="wr-options" onclick={closeMenu} onkeyup={()=>{}} role="button" tabindex="0">
      {@render children()}
    </div>
  </div>
</div>

<style>
.wr-options {
  padding: 1em;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0%);
  z-index: 10;
}

.select-container {
  position: relative;
  display: inline-block;
}

.trigger {
  background: #e1f1f9;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 60px;
  z-index: 20;
  position: relative;
}
.trigger:hover {
  background: #cae6f3;
}
:global(.trigger > svg) {
  width: 20px;
  color: #1287c191;
}

:global {
  .wr-options > button, .wr-options > a {
    padding: 0.8em 1em;
    cursor: pointer;
    font-size: 1em;
    background: transparent;
    color: #fff;
    text-decoration: none;
    font-family: var(--font-bold);
    display: flex;
    gap: 1em;
    transition: var(--transition);
    border-radius: 8px;
  }
  .wr-options > button:hover, .wr-options > a:hover {
    background: #2b1c88;
  }
  .wr-options > button > svg, .wr-options > a > svg {
    width: 20px;
    color: #ffffff;
  }
}

.menu-opt-select {
  position: absolute;
  right: 0;

  opacity: 0;
  pointer-events: none;
  transform: scale(0.85);
  transform-origin: top right;

  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;

  border-radius: 8px;
  background-color: rgb(58, 40, 167);
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: max-content;
}

.menu-opt-select.down {
  top: calc(100% + 4px);
  transform-origin: top right;
}

.menu-opt-select.up {
  bottom: calc(100% + 4px);
  transform-origin: bottom right;
}

.menu-opt-select.open {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}
.menu-opt-select.up.open {
  transform: scale(1);
}
</style>
