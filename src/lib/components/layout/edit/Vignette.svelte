<script lang="ts">
import arrowUp from '$lib/assets/svg/arrow-up.svg?raw';
import arrowDown from '$lib/assets/svg/arrow-down.svg?raw';
import listOrdered from '$lib/assets/svg/list-ordered.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import circleX from '$lib/assets/svg/circle-x.svg?raw';
import { EditBtn, Toast } from '$lib/components';

let toast = $state<Toast | null>(null);
let { data, handleEvent = ()=>{}, id, onEvent = ()=>{} } = $props();
let localText = $state(data.text);
let isEdit = $derived(data.isEdit);

function viewTextArea() {
  onEvent(id);
}
function handle(action: string) {
  const info = JSON.parse(JSON.stringify({text: localText, type: data.type, size: 0, isEdit}));
  if (action === 'ok') {
    for (let i = 0; i < info.text.length; i++) {
      if (!info.text[i].item.length) {
        toast?.view({ type: 'success', message: `El item ${i+1} está vacio` });
        return;
      }
    }
  }
  //if (action !== 'up' && action !== 'down') { viewTextArea(); }
  handleEvent({data: info, action, id});
}

function handleAddList() {
  localText.push({item: ''});
}

function handleDeleteItem(index: number) {
  if (localText.length === 1) {
    toast?.view({ type: 'success', message: 'Debes tener al menos un item' });
    return;
  }
  localText.splice(index, 1);
}

</script>

<Toast bind:this={toast} />

<div class="container-vignette">
  {#if !isEdit}
    <div class="wr-items">
      <ul class="ul-items" onclick={viewTextArea} onkeydown={() => {}} role="">
        {#each localText as text, index}
          <li class="li-item">
            <button class="n-item">{index < 9 ? '0' : ''}{index + 1}</button>
            <div class="text-list">{text.item}</div>
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <div class="wr-textarea">
      <div class="container-row-area">
        {#each localText as text, index}
          <div class="row-area">
            <button class="n-item">{index < 9 ? '0' : ''}{index + 1}</button>
            <textarea spellcheck="false" class="textarea" bind:value={text.item} name="item" placeholder="Escribe el texto"></textarea>
            <button class="btn-delete-item" onclick={()=>handleDeleteItem(index)}>{@html circleX}</button>
          </div>
        {/each}
      </div>
      <div class="wr-btns">
        <EditBtn onclick={()=>handle('ok')}>Listo</EditBtn>
        <EditBtn onclick={handleAddList}>{@html listOrdered}</EditBtn>
        <EditBtn onclick={()=>handle('delete')}>{@html trash}</EditBtn>
        <EditBtn onclick={()=>handle('up')}>{@html arrowUp}</EditBtn>
        <EditBtn onclick={()=>handle('down')}>{@html arrowDown}</EditBtn>
      </div>
    </div>
  {/if}
</div>

<style>
:global {
  .btn-delete-item > svg {
    color: #fb5a5a;
    width: 24px;
  }
}
.btn-delete-item {
  width: 34px;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  background: transparent;
  transition: var(--transition);
}
.container-row-area {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.ul-items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.text-list {
  font-family: var(--font-normal);
  font-size: 1.1em;
  line-height: 30px;
}
.li-item {
  display: flex;
  align-items: start;
  gap: 1em;
}
.n-item {
  font-family: var(--font-normal);
  font-size: 1.1em;
  font-weight: 800;
  color: #cb7900;
  display: flex;
  background: transparent;
  line-height: 30px;
}
.row-area {
  display: flex;
  gap: 1em;
}
.wr-textarea {
  width: 100%;
}
.wr-items {
  display: flex;
  width: 100%;
}
.container-vignette {
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
  .btn-delete-item:hover {
    background: #f080803d;
  }
}
</style>
