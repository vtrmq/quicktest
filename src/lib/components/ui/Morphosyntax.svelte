<script lang="ts">
import { activityLocalstore } from "$lib/store/activity_student";
import { colorSynt, bgColorSynt, wordObjects, shuffleArray } from '$lib/utils';
import { Select } from "$lib/components";
let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true } = $props();

type ArrWord = {
  type: string;
  width: number;
  word: string;
}
type ArrWordBox = {
  label: {"morphosyntax": string, "description": string};
  response: {"morphosyntax": string, "value": boolean};
  width: string; 
  sw: boolean; 
  min: number; 
  max: number; 
  size: number; 
  border: boolean;
  resaltar: boolean;
  type: string;
}
type LabelText = {
  word: string;
  type: string;
}
type SelectMorphosyntax = {
  morphosyntax: string;
  description: string;
}

let arrWords: ArrWord[] = $state([]);
let arrWordsBox: ArrWordBox[][] = $state([]);
let numRow = -1;
let numColumn = -1;
let labelText: LabelText[] = $state([]);
let showWinInput = $state(false);
let arrSelectMorphosyntax: SelectMorphosyntax[] = $state([]);

arrWords = infoData.exercise.arrWords;
arrWordsBox = infoData.exercise.syntax.arrWordsBox;

function selectSynt(e: any, row: number, column: number) {
  e.stopPropagation();

  if (isActionStudent === false) return;

  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }

  if (viewResult === 1) return;
  numRow = row;
  numColumn = column;
  arrWordsBox[numRow][numColumn];
  let min = arrWordsBox[numRow][numColumn].min;
  let max = arrWordsBox[numRow][numColumn].max;

  let _labelText = '';
  for (let i = min; i <= max; i++) {
    _labelText += `${arrWords[i].word} `;
  }
  labelText = wordObjects(_labelText);
  showWinInput = true;
}


let select_morphosyntax = '';
function changeMorphosyntax(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  select_morphosyntax = value;
}


function loadSintax() {
  //text = infoData.exercise.content;

  let _arrWords = [];
  for (let i = 0; i < arrWordsBox.length; i++) {
    const arr = arrWordsBox[i]
    for (let j = 0; j < arr.length; j++) {
      const label = arr[j].label;
      if (label.morphosyntax !== undefined && label.morphosyntax.length !== 0) {

        const objetoInexistente = _arrWords.find((objeto) => objeto.morphosyntax.toLowerCase() === label.morphosyntax.toLowerCase());
        if (objetoInexistente === undefined) {
          _arrWords.push(label);
        }

      }
    }
  }

  arrSelectMorphosyntax = shuffleArray(_arrWords);

}

function handleCancel() {
  showWinInput = false;
}

function storeWordsBox() {
  let copyArrWordsBox = JSON.parse(JSON.stringify(arrWordsBox));
  activityLocalstore.morphosyntax(indexExercise, JSON.stringify(copyArrWordsBox), scales);
}

function handleAcceptBox() {
  let _morphosyntax = select_morphosyntax;
  if (_morphosyntax.length === 0) {
    //const info = { message: 'Selecciona una opción' };
    //console.log(info)
    return;
  }
  let morphosyntax = arrWordsBox[numRow][numColumn].label.morphosyntax;
  if (morphosyntax.toLowerCase() === _morphosyntax.toLowerCase()) {
    arrWordsBox[numRow][numColumn].response.morphosyntax = morphosyntax;
    arrWordsBox[numRow][numColumn].response.value = true;
  } else {
    // Buscar en otra fila
    let min = arrWordsBox[numRow][numColumn].min;
    let max = arrWordsBox[numRow][numColumn].max;
    let isFound = false;
    for (let i = 0; i < arrWordsBox.length; i++) {
      if (i !== numRow) {
        let morphosyntax = arrWordsBox[i][numColumn].label.morphosyntax;
        let _min = arrWordsBox[i][numColumn].min;
        let _max = arrWordsBox[i][numColumn].max;
        if ((min === _min && max === _max) && (morphosyntax.toLowerCase() === _morphosyntax.toLowerCase())) {
          arrWordsBox[i][numColumn].response.morphosyntax = morphosyntax;
          arrWordsBox[i][numColumn].response.value = true;
          isFound = true;
          break;
        }
      }
    }
    if (isFound === false) {
      arrWordsBox[numRow][numColumn].response.morphosyntax = _morphosyntax;
      arrWordsBox[numRow][numColumn].response.value = false;
    }
  }
  showWinInput = false;
  select_morphosyntax = '';
  storeWordsBox();
}

loadSintax();

</script>

{#if showWinInput}
  <div class="bg-morphosyntax">
    <div class="win-syn">
      <div class="label-text">
        {#each labelText as word}
          <span class="word-t" class:sign-t={word.type === "sign"}>{word.word}</span>
        {/each}
      </div>
      <div class="wr-input">
        <Select name="select" onchange={changeMorphosyntax}>
          <option value="">Seleccionar</option>
          {#each arrSelectMorphosyntax as morphosyntax}
            <option value="{morphosyntax.morphosyntax}">{morphosyntax.morphosyntax} {morphosyntax.description.length !== 0 ? `(${morphosyntax.description})` : ''}</option>
          {/each}
        </Select>
      </div>
      <div class="wr-btns">
        <button class="btn-cancel-morphosyntax-morpho" onclick={handleCancel}>Cancelar</button>
        <button class="btn-accept-morphosyntax-morpho" onclick={handleAcceptBox}>Aceptar</button>
      </div>
    </div>
  </div>
{/if}

<div class="board-morpho-bx">
  <!-- --------------------------- -->
  <div class="wrapper-board-morpho-bx">
    <div class="container-board-morpho">

      <div class="rr-morpho">
        {#each arrWords as w, index}
          {#if w.type === "word"}
            <span class="word-morpho" id="w-{index}">{w.word}</span>
          {:else}
            <span class="sign-morpho" id="w-{index}"><span class="w-sign-morpho">{w.word}</span></span>
          {/if}
        {/each}
      </div>

      <div class="container-rows-morpho">
        {#each arrWordsBox as _, index}
          <div class="r-morpho pr-morpho">
            {#each arrWords as w, bx}
              {@const rs = arrWordsBox[index][bx]}
              <div 
                class="pa-morpho"
                class:border-morpho={w.type === "word" ? rs.border : false} 
                class:resaltar-bx-morpho={rs.resaltar} 
                style="width: {w.type === "word" ? w.width : w.width - 1}px;" >
                <div 
                  class="bloque-morpho" 
                  class:line-morpho={rs.sw}  
                  style="
                    width: {rs.width}; 
                    border-top: 2px solid {colorSynt(index)}; 
                    background: {rs.label.morphosyntax.length !== 0 ? bgColorSynt(index) : ''}; 
                    background: {rs.response.morphosyntax.toLowerCase() !== rs.label.morphosyntax.toLowerCase() && viewResult === 1 ? '#e35353' : ''}; 
                    color: {rs.response.morphosyntax.toLowerCase() !== rs.label.morphosyntax.toLowerCase() && viewResult === 1 ? '#fff' : ''}; 
                    border-top: {rs.response.morphosyntax.toLowerCase() !== rs.label.morphosyntax.toLowerCase() && viewResult === 1 ? '2px solid #bf0000' : ''};
                    font-size: {rs.size}px;" 
                  onclick={(e)=>selectSynt(e, index, bx)} role="button" tabindex="0" onkeyup={()=>{}}>
                  {rs.response.morphosyntax}
                </div>
              </div>
            {/each}
          </div>
        {/each}
      </div>

    </div>
  </div>
</div>

<style>
.board-morpho-bx {
  position: relative;
  display: flex;
  /*margin: auto;*/
  max-height: calc(100% - 10px);
  overflow-y: auto;
}
.wrapper-board-morpho-bx {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: grid;
  z-index: 0;
  padding: 2em 1em 1em;
  border-radius: var(--border-radius);
  background: #fff;
  border: 2px solid var(--bg-header-synt);
}
.wr-btns {
  display: flex;
  gap: 1em;
}
.word-t {
  font-family: var(--font-normal);
  font-weight: 600;
  font-size: 1.4em;
}
.sign-t {
  position: relative;
  left: -6px;
  width: 3px;
}
.wr-input {
  width: 100%;
}
.bg-morphosyntax {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #00000070;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1em;
  padding-top: 8em;
  top: 0;
  left: 0;
}
.win-syn {
  background: #fff;
  padding: 2em 1em;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  width: 100%;
  max-width: 360px;
  box-shadow: rgb(0 0 0) 1px 3px 30px -10px;
}
.label-text {
  text-align: center;
  color: var(--color-synt);
  display: flex;
  gap: 0.3em;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
