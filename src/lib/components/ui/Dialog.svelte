<script lang="ts">
import { fade } from 'svelte/transition';
import trash from '$lib/assets/svg/trash.svg?raw';
import info from '$lib/assets/svg/info.svg?raw';
import { Button, BtnX, CheckBox } from '$lib/components';

type DataDialog = {
  type: string;
  message: string;
}

let { action }: { action: (e: string) => void } = $props();
let isDisplay = $state(false);
let data: DataDialog = $state({type: '', message: ''});
let isChecked: boolean = $state(false);

export function show(_data: DataDialog) {
  data = _data;
  isChecked = false;
  isDisplay = !isDisplay;
}

function handleKeyShowAddPhoto(e:KeyboardEvent) {
  if (isDisplay && e.key === 'Escape') {
    isDisplay = !isDisplay;
  }
}

function handleAction(opt: string) {
  if (!isChecked && opt !== 'cancel') return;
  isDisplay = !isDisplay;
  action(opt);
}

function handleChangeCheck(e: boolean) {
  isChecked = e;
}

</script>

<svelte:window onkeydown={handleKeyShowAddPhoto} />

{#if isDisplay}
  <div transition:fade={{ duration: 200 }} class="container-dialog" onclick={()=>isDisplay = false} onkeyup={()=>{}} role="button" tabindex="0">
    <div class="win-dialog" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0">
      <BtnX onclick={()=>isDisplay = false} />
      <div>
        <div class="container-info">
          <div class="container-icon">
            {#if data.type === 'delete'}
              {@html trash}
            {:else if data.type === 'info'}
              {@html info}
            {/if}
          </div>
          <p class="message">{@html data.message}</p>
        </div>
        <div class="wr-checkbox">
          Confirmar eliminación <CheckBox name="checkbox" checked={isChecked} onchange={handleChangeCheck}/>
        </div>
        <div class="container-btns">
          <Button bg="none" onclick={()=>handleAction('cancel')}>{data.type === 'delete' ? 'Cancelar' : 'Cerrar'}</Button>
          {#if data.type === 'delete'}
            <Button onclick={()=>handleAction('accept')} bg="red">Eliminar</Button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
:global(.container-icon > svg) {
  width: 60px;
  color: #fff;
}
.wr-checkbox {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 2em;
  font-family: var(--font-normal);
  font-size: 1em;
  color: #fff;
  justify-content: center;
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
  font-size: 1.5em;
  color: #fff;
  text-align: center;
  font-family: var(--font-normal);
  font-weight: bold;
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
}
.win-dialog {
  background: var(--bg-win-action);
  padding: 2em;
  border-radius: 8px;
  box-shadow: var(--box-shadow-action);
  width: 100%;
  max-width: 460px;
  max-height: 500px;
  position: relative;
}
.container-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-screen);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  padding: 1em;
}
</style>
