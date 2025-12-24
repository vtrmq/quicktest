<script lang="ts">
import arrowUp from '$lib/assets/svg/arrow-up.svg?raw';
import arrowDown from '$lib/assets/svg/arrow-down.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import { EditBtn, Toast } from '$lib/components';
import { extractYouTubeId } from "$lib/utils";

let { data, handleEvent = ()=>{}, id, onEvent = ()=>{} } = $props();
let textarea = $state<HTMLTextAreaElement>();
let localText = $derived(data.text);
let isEdit = $derived(data.isEdit);
let toast = $state<Toast | null>(null);

function viewTextArea() {
  onEvent(id);
}

function handleTextAreaInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  localText = target.value;
}

function handle(action: string) {
  if (action === 'ok' && localText.trim().length === 0) {
    toast?.view({ type: 'success', message: 'Coloca el link del video' });
    return;
  }
  const info = {text: localText, type: data.type, size: 0, isEdit};
  handleEvent({data: info, action, id});
}

</script>

<Toast bind:this={toast} />

<div class="container-iframe">
  {#if !isEdit}
    <div class="wr-iframe">

      <iframe
        class="iframe"
        src={extractYouTubeId(localText)}
        title="Video de YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
      <button class="btn-select-video" onclick={viewTextArea}>Editar</button>

    </div>
  {:else}
    <div class="wr-textarea">
      <div>
        <textarea 
          spellcheck="false"
          oninput={(e)=>handleTextAreaInput(e)} 
          bind:this={textarea} 
          class="textarea" 
          name="video"
          placeholder="Coloca el link del video"
        >{localText}</textarea>
      </div>
      <div class="wr-btns">
        <EditBtn onclick={()=>handle('ok')}>Listo</EditBtn>
        <EditBtn onclick={()=>handle('delete')}>{@html trash}</EditBtn>
        <EditBtn onclick={()=>handle('up')}>{@html arrowUp}</EditBtn>
        <EditBtn onclick={()=>handle('down')}>{@html arrowDown}</EditBtn>
      </div>
    </div>
  {/if}
</div>

<style>
.btn-select-video {
  position: absolute;
  right: 11px;
  width: 80px;
  height: 50px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000;
  color: #fff;
  font-size: 1.1em;
  font-family: var(--font-normal);
  font-weight: 800;
}
.wr-textarea {
  width: 100%;
}
.wr-iframe {
  display: flex;
  width: 100%;
  height: 300px;
  position: relative;
  box-shadow: rgb(149 157 165 / 46%) 0px 8px 24px;
  border: 1px solid #fff;
  padding: 10px;
}
.iframe {
  width: 100%;
}
.container-iframe {
  padding: 0.8em 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wr-btns {
  display: flex;
  justify-content: center;
  gap: 1em;
  padding-top: 10px;
  padding-bottom: 10px;
  background: #fff;
  border-radius: 40px;
  box-shadow: rgb(0 0 0 / 15%) 0px 3px 8px;
}
.textarea {
  width: 100%;
  resize: none;
  background: transparent;
  font-family: var(--font-normal);
  font-size: 1.1em;
  line-height: 30px;
}
@media(min-width: 700px) {
  .wr-iframe {
    width: 90%;
  }
}
</style>
