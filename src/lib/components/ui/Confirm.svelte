<script lang="ts">
import { Button, BtnX } from '$lib/components';
import { fade } from 'svelte/transition';
import save from '$lib/assets/svg/save.svg?raw';
let isDisplay = $state(false);
let message = $state('');
let { handleSave } = $props();
let btnSave = $state<Button>();

export function show(_message: string) {
  message = _message;
  isDisplay = !isDisplay;
}

function handleBtnSave() {
  btnSave?.load(true);
  handleSave();
}
</script>

{#if isDisplay}
  <div transition:fade={{ duration: 200 }} class="container-confirm" onclick={()=>isDisplay = false} onkeyup={()=>{}} role="button" tabindex="0">
    <div class="win-confirm" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0">
      <BtnX onclick={()=>isDisplay = false} />
      <div>
        <div class="container-info">
          <div class="container-icon">
            {@html save}
          </div>
        </div>
        <div class="message">{@html message}</div>
        <div class="container-btns">
          <Button bg="none" onclick={handleBtnSave} bind:this={btnSave}>Guardar</Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
:global {
  .wr-info-w {
    margin-bottom: 3em;
    display: flex;
    flex-direction: column;
  }
  .info-total {
    color: #fff;
    font-family: var(--font-normal);
    padding: 16px 0;
    border-bottom: 1px solid #9281fb;
  }
  .title-err {
    color: #fff;
    font-family: var(--font-normal);
    font-size: 1.2em;
    margin-bottom: 1em;
    line-height: 27px;
  }
  .body-data-err {
    color: #fff;
    font-family: var(--font-normal);
    display: flex;
    gap: 1em;
    margin-bottom: 2em;
  }
  .ul-err {
    margin-left: 1.2em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
}
:global(.container-icon > svg) {
  width: 60px;
  color: #fff;
}
.container-icon {
  background: #4f3bbf;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.message {
  font-size: 1.2em;
  color: #fff;
  text-align: center;
  font-family: var(--font-normal);
  line-height: 38px;
}
.container-info {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 2em;
  align-items: center;
  gap: 2em;
}
.container-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  margin-top: 1em;
}
.win-confirm {
  background: var(--bg-win-action);
  padding: 2em;
  border-radius: 8px;
  box-shadow: var(--box-shadow-action);
  width: 100%;
  max-width: 460px;
  max-height: 500px;
  position: relative;
}
.container-confirm {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-screen);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20000 !important;
  padding: 1em;
}
</style>
