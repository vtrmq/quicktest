<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { marked } from 'marked';
import { page } from '$app/state';
import { fade } from 'svelte/transition';
import { generate } from './generate.svelte';
import { TextArea, Button, Input, CheckBox, Toast } from "$lib/components";
import search from '$lib/assets/svg/search.svg?raw';
import circleX from '$lib/assets/svg/circle-x.svg?raw';
import { HistorialStorage, injectCopyButtons } from "$lib/utils";

/*
type Generic = {
  snippets: [];
  title: string;
  url: string;
};
*/
let scrollContainer = $state<HTMLDivElement>();
let btnSave = $state<Button>();
let btnSearch = $state<Button>();
let toast = $state<Toast | null>(null);

let vista = $state('text');
let posScroll: number = 0;
let prompt = $state('');
//let generic: Generic[] = $state([]);
//let dataIA = $state('');
let brave = $state('');
let gemini = $state('');
let groq = $state('');
let mistral = $state('');

let isBrave = $state(false);
let isGemini = $state(false);
let isGroq = $state(false);
let isMistral = $state(false);

type ApiKey = {
  apikey: string;
  name: string;
  sw?: boolean;
};
let apiKey: ApiKey = {apikey: '', name: ''} as ApiKey;
let _apiKeys: ApiKey[] = $state<ApiKey[]>() as ApiKey[];
let responseAll: string[] = $state([]);

onMount (() => {
  responseAll = HistorialStorage.get();
});

$effect(() => {
  // Cerrar al cambiar de ruta
  const pg = page.url.pathname;
  //console.log(generate.apiKeys())
  if (generate.apiKeys()) {

    _apiKeys = generate.apiKeys();
    gemini = _apiKeys[0]?.apikey ?? '';
    isGemini = Boolean(_apiKeys[0]?.sw ?? false);
    brave = _apiKeys[1]?.apikey ?? '';
    isBrave = Boolean(_apiKeys[1]?.sw ?? false);
    groq = _apiKeys[2]?.apikey ?? '';
    isGroq = Boolean(_apiKeys[2]?.sw ?? false);
    mistral = _apiKeys[3]?.apikey ?? '';
    isMistral = Boolean(_apiKeys[3]?.sw ?? false);

    for (let i = 0; i < _apiKeys.length; i++) {
      if (_apiKeys[i].sw) {
        apiKey = { apikey: _apiKeys[i].apikey, name: _apiKeys[i].name };
        break;
      }
    }
  }

  if (pg !== "/teacher/topic/content") {
    generate.close();
  }
  //console.log(generate.show.visible)
  if (generate.show.visible) {
    setTimeout(()=>{
      injectCopyButtons();
    }, 1000);
  }
});

async function handleSearch() {

  if (prompt.trim().length === 0) return;
  let dataIA = '';
  const userApiKey = apiKey.apikey;
  const nameApiKey = apiKey.name;
  //console.log(userApiKey, nameApiKey)
  //console.log(prompt) 

  try {
    btnSearch?.load(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userApiKey, nameApiKey })
    });
    if (!response.ok) {
      throw new Error('Error en la petición');
    }
    //console.log(await response.text())
    const _data = await response.json();
    //console.log(nameApiKey)
    //console.log(_data)
    if (nameApiKey === "brave") {
      dataIA = _data.choices?.[0]?.message?.content ?? "Sin respuesta";
      //generic = data.grounding.generic;
    } else if (nameApiKey === "gemini") {
      dataIA = _data.data.length !== 0 ? _data.data : "Sin respuesta";
    } else if (nameApiKey === "groq") {
      dataIA = _data.data.length !== 0 ? _data.data : "Sin respuesta";
    } else if (nameApiKey === "mistral") {
      dataIA = _data.data?.outputs[0]?.content ?? "Sin respuesta";
    }
    responseAll.push(dataIA);
    HistorialStorage.save(dataIA);
    btnSearch?.load(false);
    scrollToBottom();
  } catch (e) {
    console.log(e)
  }

}

async function scrollToBottom() { // : Promise<boolean>
  // Esperamos a que Svelte actualice el DOM con el nuevo texto
  //await tick(); 

  if (scrollContainer) {
    scrollContainer.scroll({
      //top: scrollContainer.scrollHeight,
      top: 0,
      behavior: 'smooth' // 'smooth' para animado, 'instant' para salto inmediato
    });
  }
}

// Esta función se ejecutará automáticamente cuando el DIV aparezca
function autoScroll(node: HTMLElement) {
  const scroll = () => {
    node.scroll({
      top: posScroll, // O usa generate.show.posScrool si es un valor fijo
      behavior: 'smooth'
    });
  };

  scroll(); // Ejecuta al montar

  return {
    update() { // Se ejecuta si el contenido interno cambia
      scroll();
    }
  };
}

function handleScroll() {
  posScroll = scrollContainer?.scrollTop as number;
}

function handleCheckBox(e: boolean, api: string) {
  switch(api) {
    case "brave": isBrave = e; break;
    case "gemini": isGemini = e; break;
    case "groq": isGroq = e; break;
    case "mistral": isMistral = e; break;
  }
  if (api === "brave" && brave.length === 0) {
    isBrave = false;
  } else if (api === "gemini" && gemini.length === 0) {
    isGemini = false;
  } else if (api === "groq" && groq.length === 0) {
    isGroq = false;
  } else if (api === "mistral" && mistral.length === 0) {
    isMistral = false;
  }
}

async function handleSaveAPIKey() {
  const apisKey = [
    {apikey: gemini, sw: isGemini, name: "gemini"},
    {apikey: brave, sw: isBrave, name: "brave"},
    {apikey: groq, sw: isGroq, name: "groq"},
    {apikey: mistral, sw: isMistral, name: "mistral"},
  ];
  let totalSw = 0;
  for (let i = 0; i < apisKey.length; i++) {
    if (apisKey[i].sw) {
      totalSw = totalSw + 1;
    }
  }
  if (totalSw === 0) {
    toast?.view({
      type: "success",
      message: "No hay API Key seleccionada",
      time: 3000
    });
    return;
  } else if (totalSw > 1) {
    toast?.view({
      message: "Tienes más de una API Key seleccionada",
      time: 3000
    });
    return;
  }
  apiKey = {apikey: '', name: ''};
  for (let i = 0; i < apisKey.length; i++) {
    if (apisKey[i].sw) {
      apiKey = { apikey: apisKey[i].apikey, name: apisKey[i].name };
      break;
    }
  }
  //console.log(apisKey)
  //console.log(apiKey)

  btnSave?.load(true);
  const formData = new FormData();
  formData.append('apis', JSON.stringify(apisKey));
  const res = await fetch('/api/generate/save', {
    method: 'POST',
    body: formData
  });
  const response = await res.json();
  if (response.success === 'failed') {
    goto('/');
    return;
  }
  toast?.view({
    message: response.message,
    time: 3000
  });
  btnSave?.load(false);
}

function handleKeyUp(api: string) {
  if (api === "brave" && brave.length === 0) {
    isBrave = false;
  } else if (api === "gemini" && gemini.length === 0) {
    isGemini = false;
  } else if (api === "groq" && groq.length === 0) {
    isGroq = false;
  } else if (api === "mistral" && mistral.length === 0) {
    isMistral = false;
  }
}

function handleViewText() {
  vista = "text";
  setTimeout(()=>{
    injectCopyButtons();
  }, 1000);
}

</script>

<!--svelte:window onkeydown={generate.close} /-->
<Toast bind:this={toast} />

{#if generate.show.visible}
  <div transition:fade={{ duration: 200 }} class="container-generate">
    <div bind:this={scrollContainer} class="wrapper-generate" use:autoScroll onscroll={handleScroll}>
      <div class="wr-board">
        <!--
        {#each generic as gn}
          <div class="container-generic">
            <p class="title">{gn.title}</p>
            <div class="wrapper-snippet">
              {#each gn.snippets as rs}
                <div>{@html marked(rs)}</div>
              {/each}
            </div>
          </div>
        {/each}
        -->
        <div class="wr-header">
          <button class="btn-tab" onclick={handleViewText} class:resaltar={vista === "text"}>Texto</button>
          <button class="btn-tab" onclick={()=>vista = "links"} class:resaltar={vista === "links"}>Enlaces</button>
          <button class="btn-tab" onclick={()=>vista = "apiKey"} class:resaltar={vista === "apiKey"}>API Key</button>
          <button class="btn-tab" onclick={generate.close}>Cerrar</button>
        </div>

        <div class="wrapper-snippet">
          {#if vista === "text"}
            <div class="container-data">
              {#each responseAll as resp}
                {@html marked(resp)}
                <div class="separador">&nbsp;</div>
              {/each}
            </div>
          {:else if vista === "apiKey"}
            <div class="container-dt">
             <div>
                <div class="wr-inputs">
                  <CheckBox name="b" onchange={(e)=>handleCheckBox(e, "gemini")} checked={isGemini} />
                  <Input label="API Key Gemini" requested={false} bind:value={gemini} keypress={()=>handleKeyUp("gemini")} />
                </div>
                <div class="wr-inputs">
                  <CheckBox name="a" onchange={(e)=>handleCheckBox(e, "brave")} checked={isBrave} />
                  <Input label="API Key Brave" requested={false} bind:value={brave} keypress={()=>handleKeyUp("brave")} />
                </div>
                <div class="wr-inputs">
                  <CheckBox name="c" onchange={(e)=>handleCheckBox(e, "groq")} checked={isGroq} />
                  <Input label="API Key Groq" requested={false} bind:value={groq} keypress={()=>handleKeyUp("groq")} />
                </div>
                <div class="wr-inputs">
                  <CheckBox name="d" onchange={(e)=>handleCheckBox(e, "mistral")} checked={isMistral} />
                  <Input label="API Key Mistral" requested={false} bind:value={mistral} keypress={()=>handleKeyUp("mistral")} />
                </div>
                <div><Button onclick={handleSaveAPIKey} bind:this={btnSave}>Guardar</Button></div>
              </div> 
            </div>
          {:else if vista === "links"}
            <div class="container-dt">
              <div class="wr-link">
                <h3>Chatbots</h3>
                <div>
                  <a href="https://gemini.google.com/app" target="_blank">https://gemini.google.com/app</a>
                  <a href="https://copilot.microsoft.com/" target="_blank">https://copilot.microsoft.com</a>
                  <a href="https://chat.mistral.ai/" target="_blank">https://chat.mistral.ai</a>
                  <a href="https://claude.ai/new" target="_blank">https://claude.ai/new</a>
                </div>
              </div>
              <div class="wr-link">
                <h3>De texto a voz</h3>
                <div><a href="https://luvvoice.com/es" target="_blank">https://luvvoice.com/es</a></div>
              </div>
            </div>
          {/if}
        </div>

      </div>

      {#if vista === "text"}
        <div class="wr-edit-generate">
          <div class="container-textarea">
            <TextArea bind:value={prompt} label="" />
            <div class="wr-btns">
              <Button onclick={handleSearch} type="button" bind:this={btnSearch}>{@html search}</Button>
              <Button bg="red" onclick={generate.close}>{@html circleX}</Button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>

:global {
  .btn-copy-parent {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #eddce8;
    border-radius: 5px;
  }
  .btn-copy-child {
    width: 20px;
    height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #dce6ed;
    border-radius: 5px;
    margin-left: 6px;
  }
  .btn-copy-child > svg, .btn-copy-parent > svg {
    width: 12px;
  }
}

/* ======================================== */

.separador {
  background: #c4e0ed;
  height: 7px;
  margin-top: 1em;
}
.container-data {
  padding: 2em 0;
}
.btn-tab {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  background: #f0f2f3;
  font-family: var(--font-normal);
  transition: var(--transition);
}
.btn-tab:hover {
  background: #d7dee1;
}
.btn-tab.resaltar {
  background: #d7dee1;
}
.wr-inputs {
  display: flex;
  gap: 1em;
  align-items: center;
}
.container-dt {
  padding: 2em 0;
  display: flex;
  flex-direction: column;
  gap: 2em;
}
.wr-link {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
}
/*
.wr-link > h3 {
}
*/
.wr-link > div {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.wr-link > div > a {
  color: #006fc7;
}
.wr-header {
  display: flex;
  gap: 0.6em;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 0.6em;
  justify-content: center;
}
/*
.container-generic {
  font-family: var(--font-normal);
}
.title {
  margin: 1em 0;
  font-weight: 600;
}
*/
.wrapper-snippet {
  font-family: var(--font-normal);
}

:global .wrapper-snippet {
  ul {
    margin-left: 17px;
    padding: 1em 0;
  }
  h1, h2, h3 {
    padding: 1em 0 0.6em;
    line-height: 28px;
  }
  p {
    padding-bottom: 0.6em;
    line-height: 30px;
  }
  li {
    line-height: 30px;
    padding-bottom: 0.6em;
  }
  table {
    margin: 0.5em 0 1em;
  }
  th {
    padding: 8px 0 8px;
    background: #ffe7c4;
  }
  td {
    padding: 0 8px 8px 0;
  }
}
.container-textarea {
  display: grid;
  grid-template-columns: 1fr 50px;
  gap: 1em;
}
.container-generate {
  position: fixed;
  background: #fff;
  top: 0;
  z-index: 11000;
  left: 0;
  width: 100%;
  height: 100%;
}
.wrapper-generate {
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 110px;
  overflow-y: scroll;
  /* Estándar para Firefox */
  scrollbar-width: thin;
}

/* 2. Específico para Chrome, Edge y Safari */
.wrapper-generate::-webkit-scrollbar {
  width: 12px;               /* Ancho de la barra vertical */
  height: 12px;              /* Alto de la barra horizontal */
}

.wrapper-generate::-webkit-scrollbar-track {
  background: #f1f1f1;       /* Color del fondo */
}

.wrapper-generate::-webkit-scrollbar-thumb {
  background: #888;          /* Color de la barra */
  border-radius: 6px;        /* Bordes redondeados */
  border: 3px solid #f1f1f1; /* Espacio alrededor del thumb */
}

.wrapper-generate::-webkit-scrollbar-thumb:hover {
  background: #555;          /* Color al pasar el mouse */
}




.wr-edit-generate {
  position: fixed;
  bottom: -15px;
  width: 100%;
  padding: 1em;
  background: #fff;
  z-index: 1000;
}

.wr-board {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 1em 1em 8em;
}
.wr-btns {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
@media (min-width: 600px) {
  .wr-edit-generate {
    width: 98.6%;
  }
  .container-textarea {
    max-width: 670px;
    margin: 0 auto;
    grid-template-columns: 1fr 49px;
  }
}
</style>
