<script lang="ts">
import { fade } from 'svelte/transition';
import { Toast } from '$lib/components';
import reading from '$lib/assets/images/reading.png';
import { colors, normalizeToDigit } from '$lib/utils';
import { activityLocalstore } from "$lib/store/activity_student";

type Option = {
  option: string;
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

let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true } = $props();
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

question = infoData.exercise.question;
words = infoData.exercise.words;
options = infoData.exercise.optionSuboptions;
visible = infoData.visible;
time = infoData.time;
mode = infoData.mode;

indexOptWord = -1;

// =============================================

function handleSelectWord(index: number) {

  if (isActionStudent === false) return;

  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }

  if (viewResult === 1) return;

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
  } else {
    words[index].resp = false;
    words[index].selection_word = '';
  }
  
  activityLocalstore.character(indexExercise, JSON.stringify(words), scales);

}

function handleSelectOptWord(index: number) {
  if (isActionStudent === false) return;
  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }
  if (viewResult === 1) return;
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

<Toast bind:this={toast} />

<div class="rf-character">
  {#if mode === 'normal'}

    <div class="center-exercise-character">
      <div class="body-exercise-select user-select-none" class:grid-select={options.length}>

        <div class="box1-select">
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
                  onclick={()=>handleSelectOptWord(index)}>{opt.option}</button>
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

<!--
<style>
.item-bad {
  background: #e35353;
  color: #fff;
  border-bottom: 2px solid #fdadad;
}
progress {
  appearance: none;       /* Quita el estilo nativo */
  -webkit-appearance: none;
  width: 100%;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

/* Fondo de la barra (el contenedor) */
progress::-webkit-progress-bar {
  background-color: #ffffff; /* Blanco */
}

/* Color de la barra de carga (Relleno) */
progress::-webkit-progress-value {
  background-color: #007bff; /* Azul */
  transition: width 0.1s ease; /* Suaviza el movimiento */
}

/* Compatibilidad para Firefox */
progress::-moz-progress-bar {
  background-color: #007bff; /* Azul */
}

.progresbar {
  position: absolute;
  top: -3px;
  background: aqua;
  width: 100%;
  left: 0;
  height: 9px;
}
.btn-break {
  font-family: var(--font-normal);
  padding: 0.6em 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-size: 1em;
  background: var(--bg-blue);
  color: #fff;
  transition: var(--transition);
  margin-top: 1em;
}
.btn-break:hover {
  background: var(--bg-blue-hover);
}
.rf {
  width: 100%;
  height: 100%;
  position: relative;
}
.center-exercise {
  max-height: calc(100% - 0px);
  /*height: 100%;*/
  width: 100%;
  display: flex;
  justify-content: center;
  top: 0;
  position: absolute;
}
.title-lecture {
  font-family: var(--font-normal);
  font-size: 1.2em;
  padding-bottom: 1em;
  line-height: 28px;
}
.wrapper-lecture {
  width: 100%;
  max-width: 500px;
  border: 2px solid var(--bg-header-synt);
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: var(--border-radius);
  overflow-y: auto;
  height: calc(100% - calc(var(--height-header) + -60px));
  top: 0;
  position: absolute;
}
.p-lecture {
  font-family: var(--font-normal);
  line-height: 34px;
  font-size: 1em;
}
.box-info-lecture {
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  padding-bottom: 2em;
}
.label-h2 {
  font-family: var(--font-normal);
  font-weight: 800;
}
.wr-img-lecture {
  width: 200px;
  height: 200px;
}
.wr-img-lecture > img {
  width: 100%;
  height: 100%;
}
.btn-start-lecture {
  font-family: var(--font-normal);
  padding: 0.6em 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-size: 1em;
  background: var(--bg-blue);
  color: #fff;
  transition: var(--transition);
}
.btn-start-lecture:hover {
  background: var(--bg-blue-hover);
}
</style>
-->
