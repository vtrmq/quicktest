<script lang="ts">
import { goto } from '$app/navigation';
import { onDestroy } from 'svelte';
import { fade } from 'svelte/transition';
import refreshCCW from '$lib/assets/svg/refresh-ccw.svg?raw';
import chevronLeft from '$lib/assets/svg/chevron-left.svg?raw'
import chevronRight from '$lib/assets/svg/chevron-right.svg?raw'
import upload from '$lib/assets/svg/upload.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import { Title, Button, BtnX, Dialog } from '$lib/components';
import { FOLDER_IMAGES, R2_DOMAIN } from '$lib/utils';

type Images = {
  image_id: number;
  name: string;
  shadow_image: string;
  user_id: number
};

let dialog = $state<Dialog | null>(null);
let { onSelectImage = ()=>{} } = $props();
let array_ext: string[] = ["jpg", "jpeg", "png", "webp", "avif"];
let btnSave = $state<Button>();
let isDisplay = $state(false);
let images: Images[] = $state([]);
let files: FileList | null;
let load = $state(false);
let type = $state(0);
let message = $state('');
let fileInput = $state<HTMLInputElement | null>(null);
let pages = $state(0);
let totalPages = $state(0);
let posImage = 0;

const isFirst = $derived(pages <= 1);
const isLast = $derived(pages >= totalPages);

const root = `${R2_DOMAIN}/${FOLDER_IMAGES}`;

async function loadImages(page = 1) {
  const res = await fetch(`/api/album?page=${page}`);
  const response = await res.json();
  if (response.success === 'failed') {
    goto('/');
    return;
  }
  if (response.success === false) {
    message = response.message;
    type = 1;
    load = false;
  } else if (response.success === true) {
    pages = response.pagination.page;
    totalPages = response.pagination.totalPages;
    images = response.images;
    type = 2;
    load = true;
  }
}

export function handleShowAlbum(load = true) {
  isDisplay = !isDisplay;
  files = null;
  const bodyStyle = window.getComputedStyle(document.body);
  const overflowY = bodyStyle.overflowY;

  if (overflowY === 'hidden') {
    document.body.style.overflowY = 'visible';
  } else {
    document.body.style.overflowY = 'hidden';
  }

  if (load) {
    load = false;
    type = 0;
    loadImages(1);
  }
}

function handleKeyShowAlbum(e:KeyboardEvent) {
  if (isDisplay && e.key === 'Escape') {
    handleShowAlbum(false);
  }
}

async function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  files = target.files;
  if (files && files.length > 0) {
    let fileExtension = files[0].name.substring(files[0].name.lastIndexOf(".") + 1).toLowerCase();
    if (array_ext.indexOf(fileExtension) === -1) {
      return;
    }

    const new_image = `${crypto.randomUUID()}.${files[0].type.split('/')[1]}`;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('fileName', new_image);
    btnSave?.load(true);
    const response = await fetch('/api/album', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (result.success === 'failed') {
      goto('/');
      return;
    }
    btnSave?.load(false);
    images = result.images;
  }
}

function handleSelectImage(index: number) {
  handleShowAlbum(false);
  onSelectImage(images[index].shadow_image);
}

function handlePage(p: string) {
  pages = p === '-' ? pages - 1 : pages + 1;
  loadImages(pages);
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {
    const imageId = images[posImage].image_id.toString();
    const shadowImage = images[posImage].shadow_image;
    const response = await fetch('/api/album', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageId, shadowImage })
    });
    const result = await response.json();
    if (result.success === 'failed') {
      goto('/');
      return;
    }
    loadImages(pages);
  }
}

function handleSelectImageDelete(index: number) {
  posImage = index;
  dialog?.show({
    type: 'delete',
    message: '¿Quieres eliminar la imagen',
  });
}

onDestroy(()=>{
  document.body.style.overflowY = 'visible';
});

</script>

<Dialog bind:this={dialog} action={handleActionDelete} />
<svelte:window onkeydown={handleKeyShowAlbum} />

{#if isDisplay}
  <input class="hidden" bind:this={fileInput} type="file" accept="image/*" onchange={handleChange} />
  <div transition:fade={{ duration: 200 }} class="wr-add-image" onclick={()=>handleShowAlbum(false)} onkeyup={()=>{}} role="button" tabindex="0">
    <div class="win-add-image" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0">
      {#if load === false && type === 0}
        <div class="load-album">{@html refreshCCW}</div>
      {:else if load === false && type === 1}
        <p class="message">{message}</p>
      {:else if type === 2}
        <BtnX onclick={()=>handleShowAlbum(false)} />
        <div>
          <div class="container-btns-album">
            <Title --color-title="#fff">Álbum de imágenes</Title>
            {#if images.length !== 0}
              <div class="wrapper-btns-album">
                <button class="btn-arrow-album" onclick={()=>handlePage('-')} disabled={isFirst}>{@html chevronLeft}</button>
                <button class="btn-arrow-album" onclick={()=>handlePage('+')} disabled={isLast}>{@html chevronRight}</button>
              </div>
            {/if}
          </div>
          {#if images.length === 0}
            <div class="album-empty">No tienes imagen aquí</div>
          {:else}
            <div class="images-wrapper">
              <div class="container-images">
                {#each images as image, index}
                  <div class="box-image" role="button" tabindex="0" onclick={()=>handleSelectImage(index)} onkeyup={()=>{}}>
                    <div class="wr-box-btns-actions" onclick={(e)=>e.stopPropagation()} role="button" tabindex="0" onkeyup={()=>{}}>
                      <button class="btn-action" onclick={()=>handleSelectImageDelete(index)}>{@html trash}</button>
                    </div>
                    <img class="image" src="{root}/{image.shadow_image}" alt="" />
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          <div class="container-btns-image">
            <Button icon={upload} bg="green" onclick={() => fileInput?.click()} bind:this={btnSave} align="auto">Subir imagen</Button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
.wr-box-btns-actions {
  display: flex;
  flex-direction: column;
  height: max-content;
  position: absolute;
  right: 0px;
  top: 0;
  padding: 5px;
  gap: 1em;
}
.btn-action {
  width: 30px;
  height: 30px;
  background: #fbcec0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid #f5a9a9;
}
.btn-action:hover {
  background: #fbb4b4;
}
.container-btns-album {
  display: flex;
  gap: 1em;
  align-items: center;
  flex-direction: column;
}
.wrapper-btns-album {
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
}
.btn-arrow-album {
  width: 30px;
  height: 30px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: var(--transition);
  background: #4f3bcd;
}
.btn-arrow-album:hover:not(:disabled) {
  background: #8e7ef3;
}
.images-wrapper {
  overflow: hidden;
}
.container-images {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1em;
  margin: 1em 0;
  max-height: 310px;
  overflow: hidden;
  overflow-y: auto;
  padding: 0.5em;
  background: #806def;
  border-radius: 8px;
}
.box-image {
  width: 100%;
  height: 250px;
  display: flex;
  border: 1px solid #312767;
  padding: 0.5em;
  border-radius: 8px;
  background: #5443b5;
  cursor: pointer;
  position: relative;
}
.image {
  width: 100%;
  object-fit: scale-down;
}
.hidden {
  display: none;
}
.album-empty {
  padding: 1em;
  text-align: center;
  color: #fff;
  font-family: var(--font-bold);
  font-size: 1.2em;
  background: #f75c5c;
  border-radius: 6px;
  margin-top: 1em;
  border: 2px solid #f9adad;
}
:global {
  .load-album > svg {
    width: 40px;
    color: #fff;
    animation: girar 1.5s linear infinite;
    margin: 0 auto;
  }
  .btn-arrow-album > svg {
    width: 20px;
    color: #fff;
    stroke-width: 4px;
  }
  .btn-action > svg {
    width: 20px;
    color: #ab372e;
    stroke-width: 3px;
  }
}
.container-btns-image {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em 0 0;
  gap: 1em;
}
.load-album {
  display: flex;
  text-align: center;
}
@keyframes girar {
from {
  transform: rotate(360deg);
}
to {
  transform: rotate(0deg);
}
}
.message {
  font-family: var(--font-normal);
  font-size: 1.1em;
  line-height: 30px;
  color: #fff;
  text-align: center;
}
.win-add-image {
  background: var(--bg-win-action);
  padding: 2em 1em;
  border-radius: 8px;
  box-shadow: var(--box-shadow-action);
  width: 100%;
  max-width: 760px;
  position: relative;
}
.wr-add-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-screen);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 60;
  padding: 1em;
}
@media(min-width: 700px) {

.container-images {
  /* 1. Definir dimensiones y permitir scroll */
  max-height: 400px; /* O el alto que desees */
  overflow-y: auto;

  /* 2. Estándar moderno (Firefox y navegadores actuales) */
  scrollbar-width: thin; 
  scrollbar-color: #f63bce #f1f5f9; /* [Color del tirador] [Color del fondo] */
}

/* 3. Estilo para Chrome, Edge y Safari (Webkit) */
.container-images::-webkit-scrollbar {
  width: 8px;               /* Ancho del scroll vertical */
  height: 8px;              /* Alto del scroll horizontal */
}

.container-images::-webkit-scrollbar-track {
  background: #f1f5f9;      /* Color del fondo de la barra */
  border-radius: 10px;
}

.container-images::-webkit-scrollbar-thumb {
  background-color: #3b82f6; /* Color de la barra que se mueve */
  border-radius: 10px;       /* Bordes redondeados */
  border: 2px solid #f1f5f9; /* Crea un pequeño espacio alrededor del tirador */
}

.container-images::-webkit-scrollbar-thumb:hover {
  background-color: #2563eb; /* Color al pasar el ratón */
}



  .container-images {
    grid-template-columns: 1fr 1fr;
  }
  .win-add-image {
    padding: 2em;
  }
}
</style>
