<script lang="ts">
import { marked } from 'marked';
import arrowUp from '$lib/assets/svg/arrow-up.svg?raw';
import arrowDown from '$lib/assets/svg/arrow-down.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import clipboard from '$lib/assets/svg/clipboard.svg?raw';
import { EditBtn, Toast } from '$lib/components';
import { pasteFromClipboard } from '$lib/utils';

let { data, handleEvent = ()=>{}, id, onEvent = ()=>{} } = $props();
let textarea = $state<HTMLTextAreaElement>();
let heightMin = 200;
let heightMax = 270;
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

async function handleCopy() {
  const content = await pasteFromClipboard();
  //console.log(content)
  // 1. Obtenemos los puntos de selección
  if (textarea) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;

    // 2. Obtenemos el valor actual del textarea
    const currentValue = textarea.value;

    // 3. Construimos el nuevo valor:
    // [Texto antes del cursor] + [Texto pegado] + [Texto después del cursor]
    const newValue = 
      currentValue.substring(0, start) + 
        content + 
        currentValue.substring(end);

    // 4. Actualizamos el valor del elemento
    textarea.value = newValue;
    // 5. Opcional: Reposicionamos el cursor justo después del texto pegado
    const newCursorPosition = start + content.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    localText = textarea.value;

    // 6. Devolvemos el foco al elemento
    textarea.focus();
  }
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
      <div class="container-areatext">
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
        <EditBtn onclick={handleCopy}>{@html clipboard}</EditBtn>
      </div>
    </div>
  {/if}
</div>

<style>
.container-areatext {
  border: 1px solid #ccc;
  padding: 0.2em 0 0.2em 1em;
  border-radius: 10px;
  margin-bottom: 0.5em;
  overflow: hidden;
  background: #fff;
}
:global .container-paragraph {
  h3, h4 {
    padding-bottom: 0.6em;
    font-family: var(--font-normal);
  }
  p {
    margin: 0.6em 0;
    font-family: var(--font-normal);
  }
  p > p {
    margin: 0.6em 0 1em;
    font-family: var(--font-normal);
  }
  p > ul {
    margin: 0 0 2em 1em;
    font-family: var(--font-normal);
  }
  ul {
    margin: 0;
    font-family: var(--font-normal);
  }
}
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
  padding-bottom: 0.8em;
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
