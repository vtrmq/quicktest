<script lang="ts">
import { fade } from 'svelte/transition';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import { Title, Button, BtnX, Toast } from '$lib/components';
import save from '$lib/assets/svg/save.svg?raw';
import upload from '$lib/assets/svg/upload.svg?raw';
import { userStore } from '$lib/store';
import { FOLDER_USER_PHOTOS, R2_DOMAIN } from '$lib/utils';

let { photo, onchange = () => {} } = $props();
let isDisplay = $state(false);
let btnSave = $state<Button>();
//let file = $state<FileList>();
let files: FileList | null;
let array_ext: string[] = ["jpg", "jpeg", "png", "webp", "avif"];
let fileInput = $state<HTMLInputElement | null>(null);
let copyPhoto = photo;
let isSave: boolean = $state(false); // Si no se salvó la imagen se coloca la anterior
let toast = $state<Toast | null>(null);

function handleShowAddPhoto() {
  if (!isSave) { photo = copyPhoto; }
  isDisplay = !isDisplay;
  files = null;
}

function handleKeyShowAddPhoto(e:KeyboardEvent) {
  if (isDisplay && e.key === 'Escape') {
    handleShowAddPhoto();
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
    const reader = new FileReader();
    reader.onload = function(e) {
      photo = e.target?.result;
    }
    reader.readAsDataURL(files[0]);
  }
}

async function handleSavePhoto() {
  if (files && files.length > 0) {
    const new_photo = `${crypto.randomUUID()}.${files[0].type.split('/')[1]}`;

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('fileName', new_photo);
    btnSave?.load(true);
    const response = await fetch('/api/upload-photo', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    btnSave?.load(false);

    if (result.success) {
      isSave = true;
      photo = `${R2_DOMAIN}/${FOLDER_USER_PHOTOS}/${result.photo}`;
      userStore.photo(result.photo);
      onchange(result.photo);
      handleShowAddPhoto();
    } else {
      toast?.view({
        type: 'success',
        message: result.error,
      });
    }

  } else {
    toast?.view({
      type: 'success',
      message: 'Selecciona una foto para el perfil',
    });
  }
}

</script>

<svelte:window onkeydown={handleKeyShowAddPhoto} />

<Toast bind:this={toast} />

<button class="btn-edit-image" onclick={handleShowAddPhoto}>
  {@html pencil}
</button>

{#if isDisplay}
  <input class="hidden" bind:this={fileInput} type="file" accept="image/*" onchange={handleChange} />
  <div transition:fade={{ duration: 200 }} class="wr-add-image" onclick={handleShowAddPhoto} onkeyup={()=>{}} role="button" tabindex="0">
    <div class="win-add-image" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0">
      <BtnX onclick={handleShowAddPhoto} />
      <Title --color-title="#fff">Foto del perfil</Title>
      <div class="wr-photo">
        <div class="container-photo-user">
          <img class="photo-user" src={photo} alt="" />
        </div>
        <div class="container-btns-image">
          <Button icon={upload} bg="gray" onclick={() => fileInput?.click()}>Buscar</Button>
          <Button icon={save} onclick={handleSavePhoto} bind:this={btnSave} bg="green">Guardar</Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
.hidden {
  display: none;
}
:global(.btn-edit-image > svg) {
  width: 20px;
  color: #fff;
}
.container-photo-user {
  width: 220px;
  height: 210px;
  margin: 0 auto;
  display: flex;
  border-radius: 150px;
  overflow: hidden;
}
.container-btns-image {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  gap: 1em;
}
.container-photo-user > .photo-user {
  width: 100%;
  height: 100%;
  object-fit: cover;
  align-self: baseline;
}
.wr-photo {
  background: #806def;
  border-radius: 8px;
  margin: 1em 0 0;
  padding: 2em 0 1em;
}
.win-add-image {
  background: var(--bg-win-action);
  padding: 2em 1em;
  border-radius: 8px;
  box-shadow: var(--box-shadow-action);
  width: 100%;
  max-width: 460px;
  max-height: 500px;
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
.btn-edit-image {
  background: #65c15d;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 8px;
  right: 6px;
  border-radius: 50px;
  cursor: pointer;
}
@media(min-width: 700px) {
  .win-add-image {
    padding: 2em;
  }
}
</style>
