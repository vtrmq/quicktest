<script lang="ts">
import { marked } from 'marked';
import arrowUp from '$lib/assets/svg/arrow-up.svg?raw';
import arrowDown from '$lib/assets/svg/arrow-down.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import { EditBtn, Toast } from '$lib/components';
let { data, handleEvent = ()=>{}, id, onEvent = ()=>{} } = $props();
let textarea = $state<HTMLTextAreaElement>();
let heightMin = 60;
let heightMax = 150;
let localText = $derived(data.text);
let isEdit = $derived(data.isEdit);
let toast = $state<Toast | null>(null);
let placeholder = data.type === 'title' ? 'Escribe el título' : data.type === 'subtitle' ? 'Escribe el subtítulo' : data.type === 'paragraph' ? 'Escribe el texto' : '';

function viewTextArea() {
  onEvent(id);
}

function handleTextAreaInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  localText = target.value;
  resizeTextarea();
}

// Agrega esta función después de handleTextAreaInput
function resizeTextarea() {
  if (!textarea) return;

  // Resetear estilos temporales
  textarea.style.maxHeight = 'none';
  textarea.style.overflowY = 'hidden';
  textarea.style.height = 'auto';

  // Obtener altura real
  const scrollHeight = textarea.scrollHeight;

  // Aplicar límites
  if (scrollHeight < heightMin) {
    textarea.style.height = `${heightMin}px`;
  } else if (scrollHeight > heightMax) {
    textarea.style.height = `${heightMax}px`;
    textarea.style.overflowY = 'auto';
  } else {
    textarea.style.height = `${scrollHeight}px`;
  }
}

// Agrega este $effect al final del script, justo antes de la función handle
$effect(() => {
  if (isEdit && textarea) {
    // Esperar al siguiente ciclo de renderizado
    setTimeout(() => {
      resizeTextarea();
      textarea!.focus();
      // Cursor al final
      textarea!.setSelectionRange(textarea!.value.length, textarea!.value.length);
    }, 0);
  }
});

function handle(action: string) {
  if (action === 'ok' && localText.trim().length === 0) {
    toast?.view({ type: 'success', message: 'No hay texto para adicionar' });
    return;
  }
  //if (action !== 'up' && action !== 'down') { viewTextArea(); }
  const info = {text: localText, type: data.type, size: data.size, isEdit};
  handleEvent({data: info, action, id});
}

</script>

<Toast bind:this={toast} />

<div 
  class:container-title={data.type === 'title'}
  class:container-subtitle={data.type === 'subtitle'}
  class:container-paragraph={data.type === 'paragraph'}>
  {#if !isEdit}
    {#if data.type === 'title'}
      <h1 class="content-h1" onclick={viewTextArea} onkeydown={() => {}} role="">{@html marked(localText)}</h1>
    {:else if data.type === 'subtitle'}
      <h2 class="content-h2" onclick={viewTextArea} onkeydown={() => {}} role="">{@html marked(localText)}</h2>
    {:else if data.type === 'paragraph'}
      <p class="paragraph" onclick={viewTextArea} onkeydown={() => {}} role="">{@html marked(localText)}</p>
    {/if}
  {:else}
    <div>
      <div>
        <textarea 
          spellcheck="false"
          oninput={(e)=>handleTextAreaInput(e)} 
          bind:this={textarea} 
          class="textarea" 
          class:title={data.type === 'title'}
          class:subtitle={data.type === 'subtitle'}
          class:paragraph={data.type === 'paragraph'}
          name="title"
          placeholder={placeholder}
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
.paragraph {
  font-family: var(--font-normal);
  font-size: 1.1em;
  line-height: 30px;
}
.container-title {
  padding: 1em 0 1em;
}
.container-subtitle {
  padding: 2em 0 1em;
}
.container-paragraph {
  padding: 0.8em 0;
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
.content-h1 {
  font-family: var(--font-bold);
  font-size: 2.4em;
}
.content-h2 {
  font-family: var(--font-bold);
  font-size: 1.6em;
  font-weight: 100;
}
.textarea {
  width: 100%;
  resize: none;
  background: transparent;
}
.title {
  font-family: var(--font-bold);
  font-size: 2.4em;
  font-weight: 600;
}
.subtitle {
  font-family: var(--font-bold);
  font-size: 1.6em;
  font-weight: 100;
}
</style>
