<script lang="ts">
import { EditText, LinkBack, Toolbar, ImageContent, VideoContent, Vignette, Toast } from "$lib/components";
import { deserialize } from '$app/forms';
let { data } = $props();
let content = $state(JSON.parse(data.topic.content) ?? []);
let posLine = $state(-1);
let indexContent = $state(-1);
let noneSpace = $state(true);
let visibleToolbar = $state(false);
let toast = $state<Toast | null>(null);
let isLoad = $state(false);
let topicId = data.topic.topic_id;

type DataInput = {
  id: number;
  data: {text: string; type: string; isEdit: boolean};
  action: 'delete' | 'ok' | 'up' | 'down'
}

if (content.length === 0) {
  content.push( {type: 'title', text: data.topic.topic, size: 0, isEdit: false} )
  /*
  content.push(
    {type: 'title', text: data.topic.topic, size: 0, isEdit: false}, 
    {type: 'image', text: 'https://blog.openreplay.com/images/a-practical-introduction-to-svelte/images/hero.png', size: 80, isEdit: false}, 
    {type: 'paragraph', text: 'Los sustantivos son las palabras que nombran personas, objetos e ideas. This approach significantly improves startup times compared to traditional plugin managers.', size: 0, isEdit: false},
    {type: 'paragraph', text: 'Using lazy.nvim provides a modern, fast, and highly customizable plugin manager for Neovim that handles plugin loading lazily, meaning plugins are only loaded when needed based on events, commands, file types, or key mappings', size: 0, isEdit: false},
    {type: 'vignette', 
      text: [
        {item: 'Para quitar el icono o viñeta de un elemento <li>, usa la propiedad CSS list-style: none'}, 
        {item: 'Acceder a variables de entorno (como claves de API).'},
        {item: 'Conectarte a una base de datos (por ejemplo, con Prisma).'},
        {item: 'Hacer peticiones a APIs externas sin exponer claves al cliente.'},
      ], 
      size: 0, isEdit: false}, 
    {type: 'subtitle', text: 'El tema flexoki.nvim', size: 0, isEdit: false}, 
    {type: 'image', text: 'https://logowik.com/content/uploads/images/xxx-logo-vector-1721342098.webp', size: 60, isEdit: false}, 
    {type: 'paragraph', text: 'Los sustantivos son las palabras que nombran personas, objetos e ideas. This approach significantly improves startup times compared to traditional plugin managers.', size: 0, isEdit: false},
    {type: 'video', text: 'https://www.youtube.com/watch?v=LvL5v4OR4KQ', size: 0, isEdit: false}, 
    {type: 'paragraph', text: 'In Kansō, there are two kinds of colors: PaletteColors and ThemeColors; PaletteColors are defined directly as RGB Hex strings, and have arbitrary names that recall their actual color. Conversely, ThemeColors are named and grouped semantically on the basis of their actual function.', size: 0, isEdit: false},
    {type: 'paragraph', text: 'In short, a palette defines all the available colors, while a theme maps the PaletteColors to specific ThemeColors and the same palette color may be assigned to multiple theme colors.', size: 0, isEdit: false},
    {type: 'video', text: 'https://www.youtube.com/watch?v=p0eyWoajuP8', size: 0, isEdit: false}, 
  );
  */
}
//console.log($state.snapshot(content))

function handleAction(info: DataInput) {
  if (info.action === 'ok') {

    content[info.id] = info.data;
    content[info.id].isEdit = false;

  } else if (info.action === 'delete') {

    let pos = info.id;
    if (content.length === 1) return;
    content.splice(pos, 1);

  } else if (info.action === 'up' || info.action === 'down') {

    let pos = -1;
    if (info.action === 'up') {
      pos = info.id - 1;
    } else if (info.action === 'down') {
      pos = info.id + 1;
    }

    if (pos === -1 || pos === content.length) return

    content[info.id] = info.data;
    const text_a = content[info.id].text;
    const type_a = content[info.id].type;
    const size_a = content[info.id].size;

    const text_b = content[pos].text;
    const type_b = content[pos].type;
    const size_b = content[pos].size;

    content[pos] = {text: text_a, type: type_a, size: size_a, isEdit: true};
    content[info.id] = {text: text_b, type: type_b, size: size_b, isEdit: false};

  }
}

function returnContent() {
  let sw = false;
  for (let i = 0; i < content.length; i++) {
    if (content[i].isEdit) {
      sw = true;
      break;
    }
  }
  return sw;
}

function handleEventEdit(index: number) {
  posLine = -1;
  if (returnContent() === false) {
    for (let i = 0; i < content.length; i++) {
      content[i].isEdit = false;
    }
    content[index].isEdit = true;
  } else {
    toast?.view({ type: 'success', message: 'Hay un editor abierto' });
  }
}

function handleSelectLine(index: number) {
  if (noneSpace || returnContent()) return;
  if (posLine === -1 || posLine !== index) {
    posLine = index;
    indexContent = index;
    visibleToolbar = true;
  } else {
    posLine = -1;
    indexContent = -1;
    visibleToolbar = false;
  }
}

function handleEyeLine() {
  posLine = -1;
  indexContent = -1;
  noneSpace = !noneSpace;
  visibleToolbar = true;
  visibleToolbar = false;
}

function handleBtnToolbar(action: string) {
  posLine = -1;
  visibleToolbar = false;
  if (action === 'title' || action === 'subtitle' || action === 'paragraph') {
    content.splice(indexContent + 1, 0, {type: action, text: '', size: 0, isEdit: true});
  } else if (action === 'image') {
    content.splice(indexContent + 1, 0, {type: action, text: '', size: 60, isEdit: true});
  } else if (action === 'video') {
    content.splice(indexContent + 1, 0, {type: action, text: '', size: 0, isEdit: true});
  } else if (action === 'vignette') {
    content.splice(indexContent + 1, 0, {type: action, text: [{item: ''}], size: 0, isEdit: true});
  }
}

type Result = {
  type: string;
  message?: string;
  data?: {message: string; type: string;}
};

async function handleActionSave() {
  if (returnContent()) {
    toast?.view({ type: 'success', message: 'Hay un editor abierto' });
    return;
  }
  isLoad = true;
  const formData = new FormData();
  formData.append('topicId', topicId);
  formData.append('content', JSON.stringify(content));

  const response = await fetch('?/save', {
    method: 'POST',
    body: formData
  })
  isLoad = false;
  const responseText = await response.text();
  const result: Result = deserialize(responseText);
  if (result.type === 'success' || result.type === 'failure') {
    toast?.view({ type: result.type, message: result.data?.message, time: 3000 });
  }
}

</script>

<Toast bind:this={toast} />

<div class="content">
  <div class="header-content">
    <LinkBack href="/teacher/topic">Temas</LinkBack>
  </div>
  {#each content as section, index}
    {#if section.type === 'title'}
      <EditText data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'subtitle'}
      <EditText data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'paragraph'}
      <EditText data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'image'}
      <ImageContent data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'video'}
      <VideoContent data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'vignette'}
      <Vignette data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {/if}
    <div class="space" class:none-space={noneSpace} onclick={()=>handleSelectLine(index)} onkeyup={()=>{}} role="button" tabindex="0">
      <div class="line" class:visible={index === posLine}></div>
    </div>
  {/each}
</div>

<Toolbar {isLoad} visible={visibleToolbar} {handleEyeLine} {handleActionSave} {noneSpace} {handleBtnToolbar} />

<style>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@keyframes blink {
0% {
  opacity: 0;
}
50% {
  opacity: 1;
}
100% {
  opacity: 0;
}
}
.line {
  background: #71c0ff;
  height: 40%;
  width: 100%;
  display: none;
  animation: blink .7s infinite;
}
.line.visible {
  display: block;
}
.space {
  height: 10px;
  border-top: 1px dashed #2196f3f2;
  border-bottom: 1px dashed #2196f3f2;
  cursor: pointer;
  width: 100%;
  background: transparent;
  color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}
.space.none-space {
  opacity: 0;
}
.content {
  padding: 1em 0 5em;
  margin: 0 auto 4em;
}
@media (min-width: 700px) {
  .content {
    padding: 1em 1em 5em;
    margin: 0 auto 6em;
    max-width: 600px;
  }
}
</style>
