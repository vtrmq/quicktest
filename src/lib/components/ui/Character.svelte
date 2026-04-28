<script lang="ts">
import { fade } from 'svelte/transition';
import { Toast, Dialog, BtnChangeResult } from '$lib/components';
import reading from '$lib/assets/images/reading.png';
import { colors, normalizeToDigit, addCountCharacter } from '$lib/utils';
import { activityLocalstore } from "$lib/store/activity_student";

type Option = {
  option: string;
  total: number;
};

type Word = {
  errors: number;
  resp: boolean;
  selection_word: string;
  sign: number;
  type: string;
  value: boolean;
  word: string;
};

let { 
  viewResult = 0, 
  infoData, 
  indexExercise = -1, 
  scales, 
  type_activity, 
  isActionStudent = true, 
  isWordsErrors = false, 
  typeGeneral, 
  handleChangeResultView,
} = $props();

let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let question = $state('');
let options: Option[] = $state([]);
let indexOptWord = $state(-1);
let words: Word[] = $state([]);
let progressElement: HTMLProgressElement = $state() as HTMLProgressElement;
let requestID: number = 0;
let durationInSeconds = 0;
let visible = $state(false);
let time = $state(-1);
let mode = $state('');
let wordsErrors: string[] = [];

question = infoData.exercise.question;
words = infoData.exercise.words;
wordsErrors = infoData.exercise.wordsErrors;
options = infoData.exercise.optionSuboptions;
visible = infoData.visible;
time = infoData.time;
mode = infoData.mode;

indexOptWord = -1;

if (isWordsErrors) {
  options = addCountCharacter(infoData.exercise.optionSuboptions, infoData.exercise.wordsErrors);
}

// =============================================

function handleSelectWord(index: number) {

  if (isActionStudent === false) return;

  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }

  if (viewResult === 1) {
    toast?.view({
      type: '',
      message: 'Estás en modo resultados',
      time: 3000
    });
    return;
  }

  if (indexOptWord === -1 && words[index].selection_word === '') {
    toast?.view({
      type: 'fail',
      message: 'Selecciona una opción',
      time: 3500
    });
    return;
  }

  if (indexOptWord !== -1) {
    let word = words[index].word.toLowerCase();
    let option = options[indexOptWord].option.toLowerCase();

    if (word === option && words[index].selection_word === '') {
      words[index].resp = !words[index].resp;
      words[index].selection_word = words[index].word;
    } else if (word !== option && words[index].selection_word === '') {
      // Verificar si la primera letra de word es mayúscula si lo es colocar la primera letra en mayúscula a option para que parezca igual
      words[index].resp = false;
      words[index].selection_word = options[indexOptWord].option;
    } else if (words[index].selection_word !== '') {

      if (word === option) {
        words[index].resp = true;
        words[index].selection_word = words[index].word;
      } else {
        words[index].resp = false;
        words[index].selection_word = options[indexOptWord].option;
      }
    }
    if (words[index].resp === false) {
      wordsErrors.push(words[index].selection_word);
    }
  } else {
    words[index].resp = false;
    words[index].selection_word = '';
  }
  
  activityLocalstore.character(indexExercise, JSON.stringify(words), JSON.stringify(wordsErrors), scales);

}

function handleSelectOptWord(index: number) {

  if (isWordsErrors) {
    const err = wordsErrors.includes(options[index].option)
    const total = options[index].total;
    const message = total === 1 ? "La palabra fue colocada una vez incorrectamente" : `La palabra fue colocada ${total} veces incorrectamente`;
    if (err) {
      dialog?.show({
        type: '',
        message: `
          <h1 class="title-err center">${message}</h1>
        `,
      });
    }
  }

  if (isActionStudent === false) return;
  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }
  if (viewResult === 1) {
    toast?.view({
      type: '',
      message: 'Estás en modo resultados',
      time: 3000
    });
    return;
  }
  indexOptWord = indexOptWord === -1 || indexOptWord !== index ? index : -1;
}

function handleStartLecture() {
  //console.log($state.snapshot(_infoData))
  visible = false;
  durationInSeconds = time;
  //startProgress(timeActivity);
  requestID = requestAnimationFrame(startProgress);
}

function startProgress() {
  const durationInMs = durationInSeconds * 1000;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;

    // Calculamos el progreso (de 0 a 1)
    const progress = Math.min(elapsed / durationInMs, 1);

    // El elemento <progress> usa valores de 0 a 100 (o el 'max' definido)
    if (!progressElement) {
      cancelAnimationFrame(requestID); // Detiene la ejecución en el navegador
      requestID = 0;
      return;
    }
    progressElement.value = progress * 100;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      //console.log("¡Actividad completada!");
      cancelAnimationFrame(requestID); // Detiene la ejecución en el navegador
      requestID = 0;
      mode = 'normal';
    }
  }

  requestAnimationFrame(update);
}

</script>

<Dialog bind:this={dialog} action={()=>{}} />
<Toast bind:this={toast} />

<div class="rf-character">
  {#if mode === 'normal'}

    <div class="center-exercise-character">
      <div class="body-exercise-select user-select-none" class:grid-select={options.length}>

        <div class="box1-select">
          {#if typeGeneral === 'R'}
            <BtnChangeResult onclick={()=>handleChangeResultView()} {viewResult} />
          {/if}
          <h1 class="title-select">{question}</h1>
          <div class="container-words-character">
            {#each words as w, index}
              {@const type = index < words.length - 1 ? words[index + 1].type : words[index].type}
              {#if w.word === "\n" && w.type === "x"}
                <div class="break"></div>
              {:else}
                {#if w.type === "w" && w.sign === 0}
                  <button 
                    class="word-character pointer" class:raya-character={w.value}
                    class:item-bad-character={(w.value === true && w.resp === false) && viewResult === 1}
                    onclick={()=>handleSelectWord(index)}>{!w.value ? w.word : w.selection_word}</button>
                {:else if type === "s" && w.type === "w" && w.sign === 3}
                  <div class="flex-select word-character">
                    <button 
                      class="fnt-select pointer last-word-character" 
                      onclick={()=>handleSelectWord(index)}>{!w.value ? w.word : ''}</button>
                    <span class="sign-select">{!words[index + 1].value ? words[index + 1].word : ''}</span>
                    <span class="sign-select">{!words[index + 2].value ? words[index + 2].word : ''}</span>
                  </div>
                {:else if type === "s" && w.type === "w" && w.sign === 2}
                  {#if index < words.length - 1}
                    <div class="flex-select word-character">
                      <button 
                        class="fnt-select pointer last-word-character" class:raya-character={w.value}
                        class:item-bad-character={(w.value === true && w.resp === false) && viewResult === 1}
                        onclick={()=>handleSelectWord(index)}>{!w.value ? w.word : w.selection_word}</button>
                      <span class="sign-select">{!words[index + 1].value ? words[index + 1].word : ''}</span>
                    </div>
                  {/if}
                {:else if type === "s" && w.type === "w" && w.sign === 4}
                  <div class="flex-select word-character">
                    <span class="sign-l-select">{!words[index - 1].value ? words[index - 1].word : ''}</span>
                    <span 
                      class="fnt-select pointer last-word-l-select" 
                      onclick={()=>handleSelectWord(index)} role="button" tabindex="0" onkeypress={() => {}}>{!w.value ? w.word : ''}</span>
                    <span class="sign-l-select">{!words[index + 1].value ? words[index + 1].word : ''}</span>
                  </div>
                {:else if w.type === "w" && w.sign === 1}
                  <div class="flex-select word-character">
                    <span class="sign-l-select">{!words[index - 1].value ? words[index - 1].word : ''}</span>
                    <span 
                      class="fnt-select pointer last-word-l-select" 
                      onclick={()=>handleSelectWord(index)} role="button" tabindex="0" onkeypress={() => {}}>{!w.value ? w.word : ''}</span>
                  </div>
                {/if}
              {/if}
            {/each}
          </div>

        </div>

        {#if options.length}
          <div class="box2-select">
            <div class="bx-select">
              {#each options as opt, index}
                {@const num = normalizeToDigit(index)}
                <button class="w-opt-select {colors[num]}" class:resaltar={index === indexOptWord}
                  onclick={()=>handleSelectOptWord(index)}>
                  {opt.option}
                  {#if isWordsErrors && opt.total !== 0}
                    <span class="total-errors">{opt.total}</span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/if}

      </div>

    </div>

  {:else if mode === 'lecture' && visible === true} <!-- Mensaje inicio de lectura -->

    <div class="box-info-lecture-character">
      <h2 class="label-h2-character">Comprensión de lectura</h2>
      <p class="title-lecture-character">Título: {infoData.exercise.question}</p>
      <div class="wr-img-lecture-character"><img src={reading} alt="" /></div>
      <button class="btn-start-lecture-character" onclick={handleStartLecture}>Iniciar actividad</button>
    </div>

  {:else if mode === 'lecture' && visible === false} <!-- Muestra la lectura -->

    <div class="center-exercise-character">
      <div class="wrapper-lecture-character" transition:fade>
        <progress bind:this={progressElement} class="progress-character progresbar-character" id="myProgress" value="0" max="100" style="width: 100%;"></progress>
        <h2 class="title-lecture-character">{infoData.exercise.question}</h2>
        <p class="p-lecture-character">{infoData.exercise.content}</p>
        <button class="btn-break-character" onclick={()=>mode = 'normal'}>Saltar</button>
      </div>
    </div>

  {/if}
</div>

<style>
.btn-change {
  position: absolute;
  right: 0;
  top: -1px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
