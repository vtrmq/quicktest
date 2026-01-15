<script lang="ts">
import { ALFABETO } from '$lib/utils';
import { page } from '$app/state';
import { HeaderExercise, EditExercise, LinkBack, BtnAudio, Select, Input, Toast } from '$lib/components';
import { filtrarParametros, colorSynt, bgColorSynt, removeFinalPunctuationMark, wordObjects } from '$lib/utils';
import { activityLocalstore } from '$lib/store/activity';
import "$lib/css/morphosyntax.css";

type Item = {
  exercise: {};
  points: [];
  type: string;
};
type Words = {
  id: number;
  word: string;
};
type Point = {
  answers: [{resp: '', image: '', rst: false, rss: false, word: '' }]; 
  images: []; 
  image: ''; 
  words: Words[];
  question: '';
  answersFS: [{id: number, word: string;}];
  text: number;
}
type Label = {
  description: string;
  morphosyntax: string;
}
type Exercise = {
  arrWords: [];
  content: string;
  syntax: {arrWordsBox: [], isGrid: boolean};
}
type ArrWord = {
  type: string;
  width: number;
  word: string;
}

let { data } = $props();
console.log(data)
let items = data.items;
let type = $state('info');
let points: Point[] = $state([]);
let idPoint = $state(-1);

const root = filtrarParametros(page.url.href, ['topicId']);

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
type LabeText = {
  word: string;
  type: string;
};

let toast = $state<Toast>();
let indexExercise = -1;
let text = $state('');
let arrWords: ArrWord[] = $state([]);
let arrWordsBox: ArrWordBox[][] = $state([]);
let arrWordsBoxAux: ArrWordBox[][] = [];
let rows: any = [];
let indexRow = -1;
let edit = $state(true);
let editBox = $state(true);
let erase = $state(true);
let highlightBorder = $state(false);
let rBox = $state('normal');
let pos = -1;
let bgBox = $state('');
let textBox = $state('');
let textBoxDesc = $state('');
let labelText: LabeText[] = $state([]);
let arrSelectMorphosyntax: Label[] = $state([]);
let check_option = $state(0);
let showWinInput = $state(false);
let showWin = $state(false);
let showBtnsSize = $state(false);

function handleClearLet() {
  indexRow = -1;
  edit = false;
  editBox = true;
  erase = true;
  highlightBorder = false;
  bgBox = '';
  rBox = 'normal';
  pos = -1;
  showBtnsSize = false;
  labelText = [];
  textBox = '';
  textBoxDesc = '';
  showWinInput = false;
}

function handleReset() {
  arrWords = [];
  arrWordsBox = [];
  rows = [];
  indexRow = -1;
  edit = false;
  editBox = true;
  erase = true;
  highlightBorder = false;
  bgBox = '';
  rBox = 'normal';
  pos = -1;
  showBtnsSize = false;
  labelText = [];
  textBox = '';
  textBoxDesc = '';
  showWinInput = false;
}

function textToWordObjects() {
  // Usamos una expresión regular para dividir el texto en palabras y signos de puntuación
  indexRow = -1;
  arrWords = [];
  rows.push({min: 0, max: 0, mask: false});
  //rows = [];

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
  //activityLocalstore.arrWordsBox(indexExercise, arrWords);
  //activity.arrWords = arrWords;
  //morphosyntaxLocalstore.arrWords(indexExercise, arrWords);
  //activityLocalstore.arrWordsBox(indexExercise, arrWords);
}

function loadSintax(activity: Exercise) {
  handleReset();
  text = activity.content;
  arrWords = activity.arrWords;
  arrWordsBoxAux = activity.syntax.arrWordsBox;
  highlightBorder = activity.syntax.isGrid;

  if (arrWords.length !== 0) {
    arrWordsBox = arrWordsBoxAux;
    for (let i = 0; i < arrWordsBox.length; i++) {
      rows.push({min: 0, max: 0, mask: false});
    }
  } else {
    textToWordObjects();
    setTimeout(() => {
      widthWords();
      arrWordsBox = arrWordsBoxAux;
    }, 500);
  }
}

function handleActivity(index: number, _items: Item[]) {
  if (index !== -1) {
    type = _items[index].type;
    indexExercise = index;
    console.log(type)
    if (type === 'test' || type === 'test-fs') {
      points = _items[index].points;
    } else if (type === 'morphosyntax') {
      const activity = _items[index].exercise as Exercise;
      loadSintax(activity);
    }
  } else if (index === -1) {
    type = 'info';
  }
}

function handleSelectWordFS(point: number, index: number) {
  points[point].answersFS.push(points[point].words[index]);
}

function handleSelectWordFSRemove(point: number, index: number) {
  points[point].answersFS.splice(index, 1);
}

/*
function hablar(texto: string) {
  // Verificar si el navegador soporta la API
  if ('speechSynthesis' in window) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    
    console.log(texto)
    // Configurar el idioma a inglés
    mensaje.lang = 'en-US';
    
    // Opcional: ajustar velocidad y tono
    mensaje.rate = 1; // Velocidad normal (0.1 a 10)
    mensaje.pitch = 1; // Tono (0 a 2)

    // Reproducir el audio
    window.speechSynthesis.speak(mensaje);
  } else {
    console.log("Tu navegador no soporta texto a voz.");
  }
}
*/

function hablar(point: number, texto: string) {
  if (!texto || texto.trim() === '') return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'en-US';
  utterance.rate = 0.6;
  utterance.pitch = 1;
  utterance.volume = 1;
  idPoint = point;

  utterance.onend = () => {
    idPoint = -1;
  };
  synth.speak(utterance);
}

function handleAudio(point: number) {
  const texto = String(points[point].text);
  hablar(point, texto);
  /*
  speechSynthesis.speak(
    new SpeechSynthesisUtterance('test')
  );
  */
}


//let isSave = $state(false);
//async function handleSave() {}

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

function isBoxRemove(row: number) {
  for (let i = 0; i < arrWordsBox[row].length; i++) {
    arrWordsBox[row][i].border = false;
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

  if (row !== -1) {
    for (let i = 0; i < arrWordsBox.length; i++) {
      isBoxRemove(i);
    }
  }

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
  highlightBorder = false;
  editBox = true;
  erase = true;
  activityLocalstore.isGrid(indexExercise, false);
}

function handleClear() {
  let min = arrWordsBox[indexRow][pos].min;
  let max = arrWordsBox[indexRow][pos].max;

  if (indexRow < arrWordsBox.length - 1) {
    for (let i = min; i <= max; i++) {
      arrWordsBox[indexRow][i].resaltar = false;
      arrWordsBox[indexRow][i].border = highlightBorder;
      arrWordsBox[indexRow][i].min = -1;
      arrWordsBox[indexRow][i].max = -1;
      arrWordsBox[indexRow][i].label = {"morphosyntax": "", "description": ""};
      arrWordsBox[indexRow][i].width = '';
      arrWordsBox[indexRow][i].size = 15;
      arrWordsBox[indexRow][i].sw = false
    }
  } if (indexRow === arrWordsBox.length - 1) {
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
  }

  storeWordsBox();

  /*
  const _arrWordsBox = activityLocalstore.get();
  const activity = _arrWordsBox[indexExercise].exercise;
  loadSintax(activity);
  */


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
}
function handlePlusFont() {
}
function handleGrid() {
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
  console.log($state.snapshot(arrWordsBox))
  console.log(ps)

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
  //console.log($state.snapshot(arrWordsBox))
  storeWordsBox();
  if (last === 0) {
    highlightBorder = false;
    activityLocalstore.isGrid(indexExercise, false);
  }
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

</script>

<HeaderExercise>
  <LinkBack href="/teacher/topic/activity?{root}" --color-link="#fff">Actividades</LinkBack>
  <EditExercise topic={data.topic} activity={data.activity} items={items} {handleActivity} />
</HeaderExercise>
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



<div class="container-body">

  {#if type === 'info'}

    <div class="container-info">
      <h1 class="topic">{data.topic}</h1>
      <h2 class="activity">{data.activity}</h2>
    </div>

  {:else if type === 'test'}

    <div class="container-activity">
      {#each points as qs, point}
        <div class="container-question">
          <div class="wr-point-number"><div class="point-number">{point + 1}</div></div>
          <div class="question">{qs.question}</div>

          {#if qs.images.length !== 0}
            <div class="container-images-question">
              {#each qs.images as img, i}
                <div class="box-image-question">
                  <div class="wr-image-question">
                    <img class="image-question" src={img} alt="" />
                  </div>
                  {#if qs.images.length > 1}
                    <div class="label-image">Imagen {ALFABETO(i + 1)}</div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <div class="container-items-answer">
            {#each qs.answers as answer, index}
              <div class="container-answer" class:rst-point={answer.rst}>
                <div class="wr-label-point"><div class="label-resp" class:rst-point={answer.rst}>Respuesta {index + 1}</div></div>
                {#if answer.image.length !== 0}
                  <div class="wr-image-answer">
                    <img class="image-question" src={answer.image} alt="" />
                  </div>
                {/if}
                <div class="wr-input-item">
                  <div class="answer-item">{answer.resp}</div>
                </div>
              </div>
            {/each}
          </div>
          
        </div>
      {/each}
    </div>

  {:else if type === 'test-fs'}

    <div class="container-activity">
      {#each points as qs, point}
        <div class="container-question">
          <div class="wr-point-number"><div class="point-number">{point + 1}</div></div>
          
          <div class="wr-container-box-fs">
            {#if qs.image.length !== 0}
              <div class="box-image-question">
                <div class="wr-image-question">
                  <img class="image-question" src={qs.image} alt="" />
                </div>
              </div>
            {/if}

            <div class="wr-btn-audio">
              <BtnAudio sw={point === idPoint} onclick={()=>handleAudio(point)} />
            </div>

            {#if qs.answersFS}
              <div class="container-answer-fs-rs">
                {#each qs.answersFS as word, index}
                  <button class="answer-fs-rs" onclick={()=>handleSelectWordFSRemove(point, index)}>{word.word}</button>
                {/each}
              </div>
            {/if}

            {#if qs.words.length !== 0}
              <div class="container-answer-fs">
                {#each qs.words as word, index}
                  <button class="answer-fs" onclick={()=>handleSelectWordFS(point, index)}>{word.word}</button>
                {/each}
              </div>
            {/if}

          </div>

        </div>
      {/each}
    </div>

  {:else if type === 'morphosyntax'}

    <div class="main-exercise-morphosyntax-morpho">

      <div class="header-syn-morpho">

          <div class="container-btns-morpho">
            <!--button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={edit || !erase || !editBox || highlightBorder} onclick={handleSave} disabled={edit || !erase || !editBox || highlightBorder}>
              {#if isSave === false}
                <svg class="svg-morpho w22-morpho" class:color-disabled-morpho={edit || !erase || !editBox || highlightBorder} stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z" stroke="currentcolor" stroke-width="1.5"></path><path d="M8.6 9H15.4C15.7314 9 16 8.73137 16 8.4V3.6C16 3.26863 15.7314 3 15.4 3H8.6C8.26863 3 8 3.26863 8 3.6V8.4C8 8.73137 8.26863 9 8.6 9Z" stroke="currentcolor" stroke-width="1.5"></path><path d="M6 13.6V21H18V13.6C18 13.2686 17.7314 13 17.4 13H6.6C6.26863 13 6 13.2686 6 13.6Z" stroke="currentcolor" stroke-width="1.5"></path></svg>
              {:else}
                <svg class="svg-load-morpho" stroke-width="1" viewBox="0 0 24 24" fill="none"><path d="M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11" stroke="currentcolor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="currentcolor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13" stroke="currentcolor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21" stroke="currentcolor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              {/if}
            </button-->

            <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={editBox} onclick={handleEditBox} disabled={editBox}>
              <svg class="svg-morpho w22-morpho" class:color-disabled-morpho={editBox} stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M3 21L12 21H21" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.2218 5.82839L15.0503 2.99996L20 7.94971L17.1716 10.7781M12.2218 5.82839L6.61522 11.435C6.42769 11.6225 6.32233 11.8769 6.32233 12.1421L6.32233 16.6776L10.8579 16.6776C11.1231 16.6776 11.3774 16.5723 11.565 16.3847L17.1716 10.7781M12.2218 5.82839L17.1716 10.7781" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>

            <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={erase} onclick={handleClear} disabled={erase}>
              <svg class="svg-morpho w22-morpho" class:color-disabled-morpho={erase} viewBox="0 0 24 24" stroke-width="1.5" fill="none"><path d="M21 21L9 21" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.889 14.8891L8.46436 7.46448" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.8934 12.6066L12.0858 3.41421C12.8668 2.63317 14.1332 2.63317 14.9142 3.41421L19.864 8.36396C20.645 9.14501 20.645 10.4113 19.864 11.1924L10.6213 20.435C10.2596 20.7968 9.76894 21 9.25736 21C8.74577 21 8.25514 20.7968 7.8934 20.435L2.8934 15.435C2.11235 14.654 2.11235 13.3877 2.8934 12.6066Z" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>

            {#if showBtnsSize === false}
              <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={edit || !erase || !editBox} onclick={handleAddRow} disabled={edit || !erase || !editBox}>
                <svg class="svg-morpho w28-morpho" class:color-disabled-morpho={edit || !erase || !editBox} stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M6 12H12M18 12H12M12 12V6M12 12V18" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </button>
              <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={edit || !erase || !editBox || arrWordsBox.length === 0} onclick={handleDeleteRow} disabled={edit || !erase || !editBox || arrWordsBox.length === 0}>
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

            <button aria-label="Button" class="btn-sy-morpho" class:color-disabled-morpho={edit || !erase || !editBox || arrWordsBox.length < 2} class:highlight-border={highlightBorder} onclick={handleGrid} disabled={edit || !erase || !editBox || arrWordsBox.length < 2}>
              <svg class="svg-morpho w22-morpho" class:color-disabled-morpho={edit || !erase || !editBox || arrWordsBox.length < 2} stroke-width="1.5" viewBox="0 0 24 24" fill="none"><path d="M3 7.4V3.6C3 3.26863 3.26863 3 3.6 3H9.4C9.73137 3 10 3.26863 10 3.6V7.4C10 7.73137 9.73137 8 9.4 8H3.6C3.26863 8 3 7.73137 3 7.4Z" stroke="currentcolor" stroke-width="1.5"></path><path d="M14 20.4V16.6C14 16.2686 14.2686 16 14.6 16H20.4C20.7314 16 21 16.2686 21 16.6V20.4C21 20.7314 20.7314 21 20.4 21H14.6C14.2686 21 14 20.7314 14 20.4Z" stroke="currentcolor" stroke-width="1.5"></path><path d="M14 12.4V3.6C14 3.26863 14.2686 3 14.6 3H20.4C20.7314 3 21 3.26863 21 3.6V12.4C21 12.7314 20.7314 13 20.4 13H14.6C14.2686 13 14 12.7314 14 12.4Z" stroke="currentcolor" stroke-width="1.5"></path><path d="M3 20.4V11.6C3 11.2686 3.26863 11 3.6 11H9.4C9.73137 11 10 11.2686 10 11.6V20.4C10 20.7314 9.73137 21 9.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z" stroke="currentcolor" stroke-width="1.5"></path></svg>
            </button>
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

  {/if}
</div>

<style>
.wr-btn-audio {
  display: flex;
  justify-content: center;
}
.wr-container-box-fs {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 2em;
}
.container-answer-fs-rs {
  display: flex;
  gap: 0.8em;
  justify-content: center;
  padding: 1em 0.5em 1em;
  background: #c5eb98;
  box-shadow: #98c95d 0px 7px 0px 0px;
  border-radius: var(--border-radius);
  flex-wrap: wrap;
}
.container-answer-fs {
  display: flex;
  gap: 0.8em;
  justify-content: center;
  padding: 1em 0.5em 1em;
  background: var(--border-item);
  box-shadow: rgb(161 178 225) 0px 7px 0px 0px;
  border-radius: var(--border-radius);
  flex-wrap: wrap;
}
.answer-fs {
  cursor: pointer;
  font-family: var(--font-normal);
  font-size: 1.3em;
  background: #ffffff;
  box-shadow: rgb(155 161 177) 0px 4px 0px 0px;
  padding: 0 0.2em;
  border-radius: 6px;
  color: #4e5b69;
  font-weight: 800;
}
.answer-fs-rs {
  cursor: pointer;
  font-family: var(--font-normal);
  font-size: 1.6em;
  padding: 0 0.2em;
  border-radius: 6px;
  font-weight: 800;
  background: #ecffd7;
  box-shadow: rgb(106 147 58) 0px 7px 0px 0px;
  color: #232b2a;
}
.container-info {
  padding: 2em 0;
}
.topic {
  font-size: 1.7em;
  font-family: var(--font-bold);
  text-align: center;
  margin-bottom: 0.3em;
}
.activity {
  font-family: var(--font-normal);
  font-size: 1.2em;
  font-weight: 500;
  text-align: center;
}
.wr-input-item {
  position: relative;
  display: flex;
  align-items: center;
  /*border: 1px solid var(--color-border-input);*/
  border-radius: var(--border-radius);
  padding: 2px 3px 2px 0;
  transition: var(--transition);
  background: #fff;
  border: 1px solid #fff;
}
.answer-item {
  width: 100%;
  resize: none;
  background: transparent;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
  line-height: 28px;
}
.wr-label-point {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  top: -22px;
  left: 0;
}
.label-resp {
  background: var(--border-item);
  font-family: var(--font-normal);
  font-size: 0.88em;
  padding: 5px 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  transition: var(--transition);
}
.label-resp.rst-point {
  background: #11d511;
}
.container-answer {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  background: var(--border-item);
  padding: 8px;
  border-radius: var(--border-radius);
  position: relative;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: rgb(161 178 225) 0px 7px 0px 0px;
}
.container-answer.rst-point {
  background: #11d511;
  box-shadow: rgb(0 167 0) 0px 7px 0px 0px;
}
.container-items-answer {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 3em;
}
.image-question {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
  border-radius: var(--border-radius);
}
.wr-image-question {
  width: 100%;
  height: 380px;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  /*border: 1px solid #b5c7fb;*/
  padding: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.wr-image-answer {
  width: 100%;
  height: 380px;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
}
.container-images-question {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding-bottom: 2em;
}
.question {
  font-family: var(--font-normal);
  padding-bottom: 2em;
  line-height: 28px;
  font-size: var(--font-size);
}
.container-activity {
  width: 100%;
  max-width: 500px;
}
.container-question {
  padding: 0.5em 0;
}
.wr-point-number {
  display: flex;
  justify-content: center;
  background: #93deff;
  height: 1px;
  align-items: center;
  margin: 1em 0 2em;
}
.point-number {
  background: #93deff;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  font-family: var(--font-normal);
  font-weight: 600;
}

/* ================================== */
.container-body {
  position: fixed;
  top: var(--height-header);
  width: 100%;
  height: calc(100% - var(--height-header));
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1em 0.5em;
}
</style>
