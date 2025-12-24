<script lang="ts">
import { FOLDER_IMAGES, R2_DOMAIN } from '$lib/utils';
import arrowUp from '$lib/assets/svg/arrow-up.svg?raw';
import arrowDown from '$lib/assets/svg/arrow-down.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import image from '$lib/assets/svg/image.svg?raw';
import { EditBtn, Toast, Album } from '$lib/components';
import { isUrlImagen } from '$lib/utils';

const root = `${R2_DOMAIN}/${FOLDER_IMAGES}`;
let { data, handleEvent = ()=>{}, id, onEvent = ()=>{} } = $props();
let textarea = $state<HTMLTextAreaElement>();
let localText = $derived(data.text);
let isEdit = $derived(data.isEdit);
let size: number = $state(data.size);
let toast = $state<Toast | null>(null);
let album = $state<Album | null>(null);

function viewTextArea() {
  onEvent(id);
}

function handleTextAreaInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  localText = target.value;
}

async function handle(action: string) {
  if (action === 'ok' && localText.trim().length === 0) {
    toast?.view({ type: 'success', message: 'Falta el link de la imagen' });
    return;
  }
  if (isUrlImagen(localText) === false) {
    toast?.view({ type: 'success', message: 'El link no apunta a una imagen' });
    return;
  }

  const info = {text: localText, type: data.type, size, isEdit};
  handleEvent({data: info, action, id});
}

function handleChangeSize(e: Event) {
  const target = e.target as HTMLSelectElement;
  size = parseInt(target.value);
}

function handleUpload() {
  album?.handleShowAlbum();
}

async function handleImageSelect(image: string) {
  localText = `${root}/${image}`;
}

</script>

<Toast bind:this={toast} />
<Album bind:this={album} onSelectImage={handleImageSelect} />

<div class="container-image">
  {#if !isEdit}
    <div class="wr-img" style="width: {size}%">
      <img class="image" src={localText} onclick={viewTextArea} onkeydown={() => {}} role="" alt="">
    </div>
  {:else}
    <div class="wr-textarea">
      <div>
        <textarea 
          spellcheck="false"
          oninput={(e)=>handleTextAreaInput(e)} 
          bind:this={textarea} 
          class="textarea" 
          name="image"
          placeholder="Coloca el link de la imagen"
        >{localText}</textarea>
      </div>
      <div class="wr-btns">
        <EditBtn onclick={()=>handle('ok')}>Listo</EditBtn>
        <EditBtn onclick={handleUpload}>{@html image}</EditBtn>
        <select name="select" bind:value={size} class="select" onchange={handleChangeSize}>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
          <option value={60}>60</option>
          <option value={70}>70</option>
          <option value={80}>80</option>
          <option value={90}>90</option>
          <option value={100}>100</option>
        </select>
        <EditBtn onclick={()=>handle('delete')}>{@html trash}</EditBtn>
        <EditBtn onclick={()=>handle('up')}>{@html arrowUp}</EditBtn>
        <EditBtn onclick={()=>handle('down')}>{@html arrowDown}</EditBtn>
      </div>
    </div>
  {/if}
</div>

<style>
.select {
  font-family: var(--font-normal);
  border-radius: 40px;
  background: #fff;
  cursor: pointer;
  padding: 6px 10px;
  border: 1px solid #d7d7e3;
  width: 50px;
  text-align: center;
  font-weight: 600;
}
option {
  text-align: center;
}
.select {
  -webkit-appearance: none; /* Chrome, Safari, Opera */
  -moz-appearance: none;    /* Firefox */
  appearance: none;         /* Estándar */
}
.wr-textarea {
  width: 100%;
}
.wr-img {
  display: flex;
  box-shadow: rgb(149 157 165 / 46%) 0px 8px 24px;
  border: 1px solid #fff;
}
.image {
  width: 100%;
  padding: 10px;
  cursor: pointer;
}
.container-image {
  padding: 0.8em 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wr-btns {
  display: flex;
  justify-content: center;
  gap: 0.5em;
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
@media (max-width: 600px) {
  .wr-img {
    width: 100% !important; /* Fuerza 100% en móviles */
  }
}
@media(min-width: 700px) {
  .wr-btns {
    gap: 1em;
  }
  .select {
    font-size: 0.8em;
  }
}
</style>
