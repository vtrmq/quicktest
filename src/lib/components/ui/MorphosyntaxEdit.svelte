<script lang="ts">
import { activityLocalstore } from '$lib/store/activity';
import { colorSynt, bgColorSynt, removeFinalPunctuationMark, wordObjects } from '$lib/utils';
import { Toast, Select, Input } from '$lib/components';

let { activity, indexExercise = -1, intro = true } = $props();

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
};
type ArrWord = {
  type: string;
  width: number;
  word: string;
}

let toast = $state<Toast>();
let arrWords: ArrWord[] = $state([]);
let arrWordsBox: ArrWordBox[][] = $state([]);
let arrWordsBoxAux: ArrWordBox[][] = [];
let arrSelectMorphosyntax: Label[] = $state([]);
let check_option = $state(0);
let showBtnsSize = $state(false);
let showWinInput = $state(false);
let editBox = $state(true);
let erase = $state(true);
let indexRow = -1;
let pos = -1;
let edit = $state(true);
let bgBox = $state('');
let rBox = $state('normal');
let labelText: LabelText[] = $state([]);
let textBox = $state('');
let textBoxDesc = $state('');
let showWin = $state(false);
let rows: any = [];
let text = $state('');

type Label = {
  description: string;
  morphosyntax: string;
}

function widthWords() {
  let arrWordsAux = JSON.parse(JSON.stringify(arrWords));
  let tam = arrWordsAux.length;
  for (let i = 0; i < tam; i++) {
    let box = document.getElementById('w-'+i);
    if (box !== null) {
      let w = box.getBoundingClientRect();
      let rs = parseFloat(w.width.toFixed(2));
      if (rs < 6) {
        arrWordsAux[i].width = rs + 1;
      } else {
        arrWordsAux[i].width = rs;
      }
    }
  }
  arrWords = arrWordsAux;
  activityLocalstore.arrWords(indexExercise, arrWords);
}

function textToWordObjects() {
  indexRow = -1;
  arrWords = [];
  rows.push({min: 0, max: 0, mask: false});

  const regex = /([\p{L}\p{N}]+|[^\p{L}\p{N}\s])/gu;
  const matches = text.match(regex) || [];

  // Mapeamos cada coincidencia a un objeto
  arrWords = matches.map((word: string) => ({
    word: word,
    width: 0,
    type: /[\p{L}\p{N}]+/u.test(word) ? "word" : "sign"
  }));
  edit = false;
}

function handleClearLet() {
  indexRow = -1;
  edit = false;
  editBox = true;
  erase = true;
  bgBox = '';
  rBox = 'normal';
  pos = -1;
  showBtnsSize = false;
  labelText = [];
  textBox = '';
  textBoxDesc = '';
  showWinInput = false;
}

function handleEditBox() {
  let _arrWords: Label[] = [];
  for (let i = 0; i < arrWordsBox.length; i++) {
    const arr = arrWordsBox[i]
    for (let j = 0; j < arr.length; j++) {
      const label = arr[j].label;
      if (label.morphosyntax.length !== 0 && label.morphosyntax.length !== 0) {
        const objetoInexistente = _arrWords.find((objeto) => objeto.morphosyntax.toLowerCase() === label.morphosyntax.toLowerCase());
        if (objetoInexistente === undefined) {
          _arrWords.push(label);
        }
      }
    }
  }

  arrSelectMorphosyntax = _arrWords;
  check_option = 0;
  showBtnsSize = false;
  showWinInput = true;
}

function handleClear() {
  let min = arrWordsBox[indexRow][pos].min;
  let max = arrWordsBox[indexRow][pos].max;

  for (let i = min; i <= max; i++) {
    arrWordsBox[indexRow][i].resaltar = false;
    arrWordsBox[indexRow][i].border = true;
    arrWordsBox[indexRow][i].min = -1;
    arrWordsBox[indexRow][i].max = -1;
    arrWordsBox[indexRow][i].label = {"morphosyntax": "", "description": ""};
    arrWordsBox[indexRow][i].width = '';
    arrWordsBox[indexRow][i].size = 15;
    arrWordsBox[indexRow][i].sw = false
  }
  storeWordsBox();

  handleClearLet();
  arrWordsBoxAux = arrWordsBox;

}

function handleDeleteRow() {
  let last = arrWordsBox.length - 1;
  if (last != -1) {
    let sw = false;
    for (let i = 0; i < arrWordsBox[last].length; i++) {
      if (arrWordsBox[last][i].sw) {
        sw = true;
        break;
      }
    }
    if (sw) {
      showWin = !showWin;
    } else {
      deleteRow();
    }
  }
}
function handleMinusFont() {
  let size = arrWordsBox[indexRow][pos].size;
  size = size - 1;
  if (size === 10) return;
  arrWordsBox[indexRow][pos].size = size;
  activityLocalstore.fontSize(indexExercise, indexRow, pos, size);
}

function handlePlusFont() {
  let size = arrWordsBox[indexRow][pos].size;
  size = size + 1;
  if (size === 19) return;
  arrWordsBox[indexRow][pos].size = size;
  activityLocalstore.fontSize(indexExercise, indexRow, pos, size);
}

function deleteResaltar(index: number) {
  for (let x = 0; x < arrWords.length; x++) {
    arrWordsBoxAux[index][x].resaltar = false;
  }
  arrWordsBox = arrWordsBoxAux;
}

function selectBox(index: number, bx: number) {
  // Evita seleccionar cajas de otras filas
  if (arrWordsBox[index][bx].type === "sign") {
    return;
  }

  let isBorder = arrWordsBox[index][bx].border;
  if (isBorder === false) return;

  if (indexRow !== -1) {
    if (index !== indexRow) return;
  }

  if (bgBox.length !== 0) return;

  let ps = [];
  ps = [rows[index].min, rows[index].max];

  if (rows[index].mask === false) {
    ps = [bx, bx];
    rows[index].mask = true;
  } else {
    let sw = false;
    for (let i = 0; i < ps.length; i++) {
      if (bx === ps[i]) {
        sw = true;
      }
    }
    if (sw === false) {
      let min = Math.min(...ps);
      let max = Math.max(...ps);
      if (bx > min) {
        ps = [min, bx];
      } else if (bx < min) {
        ps = [bx, max];
      }
    } else {
      let aux = [];
      for (let i = 0; i < ps.length; i++) {
        if (bx !== ps[i]) {
          aux.push(ps[i]); 
        }
      }
      ps = aux;
    }
  }

  let min = ps[0] === undefined ? ps[1] : ps[0];
  let max = ps[1] === undefined ? ps[0] : ps[1];

  deleteResaltar(index);

  if (min === undefined && max === undefined) {
    rows[index] = {min: 0, max: 0, mask: false};
  } else {
    rows[index].min = min;
    rows[index].max = max;
  }

  if (ps.length > 1) {
    min = rows[index].min;
    max = rows[index].max;
    for (let i = min; i <= max; i++) {
      arrWordsBoxAux[index][i].resaltar = true;
    }
    arrWordsBox = arrWordsBoxAux;
  } else if (min !== undefined) {
    min = rows[index].min;
    arrWordsBoxAux[index][min].resaltar = true;
    arrWordsBox = arrWordsBoxAux;
  }

  if (rows[index].mask) {
    indexRow = index;
    editBox = false;
    let _labelText = '';
    for (let i = rows[indexRow].min; i <= rows[indexRow].max; i++) {
      _labelText += `${arrWords[i].word} `;
    }
    _labelText = removeFinalPunctuationMark(_labelText);
    labelText = wordObjects(_labelText);
  } else {
    indexRow = -1;
    editBox = true;
  }
  erase = true;
  textBox = '';
  textBoxDesc = '';
}

function selectSynt(e: any, index: number, bx: number) {
  e.stopPropagation();
  // No seleccionar bloques ya marcados. Ej: Det, SN, SPrep

  let sw = false;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].mask) {
      sw = true;
      break;
    }
  }
  if (sw) return;
  // ------------------------------------------------

  let bg = `bg-${index}-${bx}`;

  if (bgBox === '' || bgBox !== bg) {
    bgBox = '';
    indexRow = index;
    pos = bx;

    textBox = arrWordsBox[indexRow][pos].label.morphosyntax;
    textBoxDesc = arrWordsBox[indexRow][pos].label.description;

    rBox = 'update';
    editBox = false;
    erase = false;
    bgBox = `bg-${indexRow}-${pos}`;
    labelText = [];
    let _labelText = '';
    for (let i = arrWordsBox[indexRow][pos].min; i <= arrWordsBox[indexRow][pos].max; i++) {
      _labelText += `${arrWords[i].word} `;
    }
    _labelText = _labelText.charAt(0).toUpperCase() + _labelText.slice(1);
    labelText = wordObjects(_labelText);
    showBtnsSize = true;

  } else if (bgBox === bg) {
    indexRow = -1;
    pos = -1;
    bgBox = '';
    textBox = '';
    labelText = [];
    rBox = 'normal';
    editBox = true;
    erase = true;
    showBtnsSize = false;
  }
}

function storeWordsBox() {
  let copyArrWordsBox = JSON.parse(JSON.stringify(arrWordsBox));
  activityLocalstore.arrWordsBox(indexExercise, copyArrWordsBox);
}

function handleAddRow() {
  let row = arrWordsBox.length - 1;
  if (arrWordsBox.length !== 0) {
    let sw = false;
    for (let i = 0; i < arrWordsBox[row].length; i++) {
      if (arrWordsBox[row][i].sw) {
        sw = true;
        break;
      }
    }
    if (!sw) return;
  }

  /*
  if (row !== -1) {
    for (let i = 0; i < arrWordsBox.length; i++) {
      isBoxRemove(i);
    }
  }
  */

  rows.push({min: 0, max: 0, mask: false});
  let arr: ArrWordBox[] = []
  for (let i = 0; i < arrWords.length; i++) {
    arr.push({
      label: {"morphosyntax": "", "description": ""}, 
      response: {"morphosyntax": "", "value": false}, 
      width: '', 
      sw: false, 
      min: -1, 
      max: -1, 
      size: 15, 
      border: true, 
      resaltar: false, 
      type: arrWords[i].type
    });
  }

  arrWordsBoxAux.push(arr);
  arrWordsBox = arrWordsBoxAux;

  storeWordsBox();

  indexRow = -1;
  pos = -1;
  rBox = 'normal';
  editBox = true;
  erase = true;
}


function changeMorphosyntax(event: Event) {
  const e = event.target as HTMLSelectElement;
  textBox = '';
  textBoxDesc = '';
  for (let i = 0; i < arrSelectMorphosyntax.length; i++) {
    if (arrSelectMorphosyntax[i].morphosyntax.toLowerCase() === e.value.toLowerCase()) {
      textBox = arrSelectMorphosyntax[i].morphosyntax;
      textBoxDesc = arrSelectMorphosyntax[i].description;
      break;
    }
  }
}

function handleCancel() {
  let mask = rows[indexRow].mask;
  if (mask === true) {
    let min = rows[indexRow].min;
    let max = rows[indexRow].max;
    for (let i = min; i <= max; i++) {
      arrWordsBox[indexRow][i].resaltar = false;
      arrWordsBox[indexRow][i].border = true;
    }
    rows[indexRow] = {min: 0, max: 0, mask: false};
  }
  indexRow = -1;
  pos = -1;
  showWinInput = false;
  erase = true;
  editBox = true;
  textBox = '';
  textBoxDesc = '';
  bgBox = '';
  labelText = [];
  rBox = 'normal';
}

function handleAcceptBox() {
  if (textBox.length === 0) {
    toast?.view({
      type: 'fail',
      message: 'Escribe la morfología o sintaxis',
      time: 4200
    });
    return;
  }

  textBox = textBox.trim();
  textBoxDesc = textBoxDesc.trim();

  if (rBox === 'normal') {
    showWinInput = false;
    let min = rows[indexRow].min;
    let max = rows[indexRow].max;
    let width = 0;
    let count_words = 0;
    for (let i = min; i <= max; i++) {
      count_words = count_words + 1;
      width = width + arrWords[i].width;
      arrWordsBoxAux[indexRow][i].resaltar = false;
      arrWordsBoxAux[indexRow][i].border = false;
    }

    let words_t = count_words - 1;
    width = (width + (words_t)) + (words_t * 5);
    rows[indexRow] = {min: 0, max: 0, mask: false};
    arrWordsBoxAux[indexRow][min].min = min;
    arrWordsBoxAux[indexRow][min].max = max;
    arrWordsBoxAux[indexRow][min].label = {"morphosyntax": textBox, "description": textBoxDesc};
    width = parseFloat(width.toFixed(2));
    arrWordsBoxAux[indexRow][min].width = `${width}px`;
    arrWordsBoxAux[indexRow][min].sw = true;
    arrWordsBox = arrWordsBoxAux;

  } else if (rBox === 'update') {

    if (check_option === 0) {
      toast?.view({
        type: 'fail',
        message: 'Selecciona una opción para modificar',
        time: 4000
      });
      return;
    }

    showWinInput = false;
    if (check_option === 1) {

      arrWordsBoxAux[indexRow][pos].label = {"morphosyntax": textBox, "description": textBoxDesc};

    } else if (check_option === 2) {

      const morphosyntax = arrWordsBoxAux[indexRow][pos].label.morphosyntax;
      //const description = arrWordsBoxAux[indexRow][pos].label.description;
      for (let x = 0; x < arrWordsBoxAux.length; x++) {
        for (let i = 0; i < arrWordsBoxAux[x].length; i++) {
          if (arrWordsBoxAux[x][i].label.morphosyntax.length !== 0 && (arrWordsBoxAux[x][i].label.morphosyntax.toLowerCase() === morphosyntax.toLowerCase())) {
            arrWordsBoxAux[x][i].label = {"morphosyntax": textBox, "description": textBoxDesc};
          }
        }
      }

    }
    arrWordsBox = arrWordsBoxAux;
  }

  storeWordsBox();

  bgBox = '';
  textBox = '';
  textBoxDesc = '';
  labelText = [];
  editBox = true;
  erase = true;
  rBox = 'normal';
  indexRow = -1;
}

function isBoxBorder(row: number) {
  let arr_pos = [];
  for (let i = 0; i < arrWordsBox[row].length; i++) {
    if (arrWordsBox[row][i].sw) {
      let min = arrWordsBox[row][i].min;
      let max = arrWordsBox[row][i].max;
      for (let x = min; x <= max; x++) {
        arr_pos.push(x);
      }
    }
  }
  for (let i = 0; i < arrWordsBox[row].length; i++) {
    let found = arr_pos.find((element) => element === i);
    if (found === undefined) {
      arrWordsBox[row][i].border = true;
    }
  }
}

function deleteRow() {
  arrWordsBox.pop();
  arrWordsBoxAux = arrWordsBox;

  let last = arrWordsBox.length - 1;
  if (last !== -1) {
    isBoxBorder(last);
  }
  storeWordsBox();
  indexRow = -1;
  pos = -1;
  rBox = 'normal';
  editBox = true;
  erase = true;
}

function handleCancelWin() {
  showWin = !showWin;
}

function handleAcceptBoxWin() {
  deleteRow();
  showWin = !showWin;
}

function handleReset() {
  indexRow = -1;
  edit = false;
  editBox = true;
  erase = true;
  bgBox = '';
  rBox = 'normal';
  pos = -1;
  showBtnsSize = false;
  textBox = '';
  textBoxDesc = '';
  showWinInput = false;
}

$effect(()=>{
  if (intro) {
    intro = false;
    text = activity.content;
    arrWords = activity.arrWords;
    arrWordsBoxAux = activity.syntax.arrWordsBox;

    if (arrWords.length !== 0) {
      arrWordsBox = arrWordsBoxAux;
      for (let i = 0; i < arrWordsBox.length; i++) {
        rows.push({min: 0, max: 0, mask: false});
      }
      handleReset();
    } else {
      textToWordObjects();
      setTimeout(() => {
        widthWords();
        arrWordsBox = arrWordsBoxAux;
        handleReset();
      }, 500);
    }
  }
});

</script>

<Toast bind:this={toast} />


{#if showWinInput}
  <div class="bg-morphosyntax-morpho">
    <div class="win-syn-morpho">
      <div class="label-text-morpho">
        {#each labelText as word}
          <span class="word-t-morpho" class:sign-t={word.type === "sign"}>{word.word}</span>
        {/each}
      </div>
      <div class="wr-input-morpho">
        <Select name="select" onchange={changeMorphosyntax} label="Historial" requested={false} isError={false}>
          <option value="">Seleccionar</option>
          {#each arrSelectMorphosyntax as morphosyntax}
            <option value="{morphosyntax.morphosyntax}">{morphosyntax.morphosyntax} {morphosyntax.description.length !== 0 ? `(${morphosyntax.description})` : ''}</option>
          {/each}
        </Select>
      </div>
      <div class="wr-input-morpho">
        <Input type="text" bind:value={textBox} name="input1" label="Morfología o sintaxis" isError={false} />
      </div>
      <div class="wr-input-morpho">
        <Input type="text" bind:value={textBoxDesc} name="input2" label="Descripción (Opcional)" requested={false} isError={false} />
      </div>
      {#if rBox === "update"}
        <div class="wr-input-check-morpho">
          <div class="bold">Modificar</div>
          <div class="wr-options-morpho">
            <input type="radio" name="option" id="option1" onchange={()=>check_option = 1}><label for="option1">Sólo este</label>
          </div>
          <div class="wr-options-morpho">
            <input type="radio" name="option" id="option2" onchange={()=>check_option = 2}><label for="option2">Todos los relacionados</label>
          </div>
        </div>
      {/if}
      <div class="wr-btns-morpho">
        <button class="btn-cancel-morphosyntax-morpho" onclick={handleCancel}>Cancelar</button>
        <button class="btn-accept-morphosyntax-morpho" onclick={handleAcceptBox}>Aceptar</button>
      </div>
    </div>
  </div>
{/if}

{#if showWin}
  <div class="bg-morphosyntax-morpho">
    <div class="win-syn-morpho">
      <p class="text-syn-morpho">¿Quieres eliminar la fila?</p>
      <div class="wr-btns-morpho">
        <button class="btn-cancel-morphosyntax-morpho" onclick={handleCancelWin}>Cancelar</button>
        <button class="btn-accept-morphosyntax-morpho" onclick={handleAcceptBoxWin}>Eliminar</button>
      </div>
    </div>
  </div>
{/if}




<div class="main-exercise-morphosyntax-morpho">

  <div class="header-syn-morpho">

    <div class="container-btns-morpho">

      <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={editBox} onclick={handleEditBox} disabled={editBox}>
        <svg class="svg-morpho w22-morpho" class:color-disabled-morpho={editBox} stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M3 21L12 21H21" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.2218 5.82839L15.0503 2.99996L20 7.94971L17.1716 10.7781M12.2218 5.82839L6.61522 11.435C6.42769 11.6225 6.32233 11.8769 6.32233 12.1421L6.32233 16.6776L10.8579 16.6776C11.1231 16.6776 11.3774 16.5723 11.565 16.3847L17.1716 10.7781M12.2218 5.82839L17.1716 10.7781" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </button>

      <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={erase} onclick={handleClear} disabled={erase}>
        <svg class="svg-morpho w22-morpho" class:color-disabled-morpho={erase} viewBox="0 0 24 24" stroke-width="1.5" fill="none"><path d="M21 21L9 21" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.889 14.8891L8.46436 7.46448" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.8934 12.6066L12.0858 3.41421C12.8668 2.63317 14.1332 2.63317 14.9142 3.41421L19.864 8.36396C20.645 9.14501 20.645 10.4113 19.864 11.1924L10.6213 20.435C10.2596 20.7968 9.76894 21 9.25736 21C8.74577 21 8.25514 20.7968 7.8934 20.435L2.8934 15.435C2.11235 14.654 2.11235 13.3877 2.8934 12.6066Z" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </button>

      {#if showBtnsSize === false}
        <button aria-label="Button" 
          class="btn-sy-morpho" 
          class:color-disabled-morpho={edit || !erase || !editBox} onclick={handleAddRow} disabled={edit || !erase || !editBox}>
          <svg class="svg-morpho w28-morpho" class:color-disabled-morpho={edit || !erase || !editBox} stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M6 12H12M18 12H12M12 12V6M12 12V18" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <button aria-label="Button" 
          class="btn-sy-morpho" 
          class:color-disabled-morpho={edit || !erase || !editBox || arrWordsBox.length === 0} 
          onclick={handleDeleteRow} disabled={edit || !erase || !editBox || arrWordsBox.length === 0}>
          <svg class="svg-morpho w28-morpho" class:color-disabled-morpho={edit || !erase || !editBox || arrWordsBox.length === 0} stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
      {:else}
        <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={erase} onclick={handleMinusFont}>
          <svg class="svg-morpho w28-morpho" stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M6 12H18" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={erase} onclick={handlePlusFont}>
          <svg class="svg-morpho w28-morpho" stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M6 12H12M18 12H12M12 12V6M12 12V18" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
      {/if}

    </div>

  </div>

  <div class="board-morpho">
    <!-- --------------------------- -->
    <div class="wrapper-board-morpho">
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
                {@const bg = `bg-${index}-${bx}`}
                <div 
                  class="pa-morpho"
                  class:border-morpho={w.type === "word" ? rs.border : false} 
                  class:resaltar-bx-morpho={rs.resaltar} 
                  style="width: {w.type === "word" ? w.width : w.width - 1}px;" 
                  onclick={()=>selectBox(index, bx)} role="button" tabindex="0" onkeyup={()=>{}}>
                  <!--  class:bg-box-synt={bg === bgBox} -->
                  <div 
                    class="bloque-morpho" 
                    class:line-morpho={rs.sw}  
                    style="width: {rs.width}; border-top: 2px solid {colorSynt(index)}; background: {bg === bgBox ? '#77bd2678' : bgColorSynt(index)}; font-size: {rs.size}px;" 
                    onclick={(e)=>selectSynt(e, index, bx)} role="button" tabindex="0" onkeyup={()=>{}}>{rs.label.morphosyntax}</div>
                </div>
              {/each}
            </div>
          {/each}
        </div>


      </div>
    </div>
  </div>

</div>
