<script lang="ts">
import { fade } from 'svelte/transition';
import { Toast } from '$lib/components';
import reading from '$lib/assets/images/reading.png';
import { colors, normalizeToDigit } from '$lib/utils';
import { activityLocalstore } from '$lib/store/activity';

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
type InfoData = {
  mode: string;
  visible: boolean;
  time: number;
}

let { activity, indexExercise = -1, infoData } = $props();
let toast = $state<Toast>();
let question = $state('');
let options: Option[] = $state([]);
let indexOptWord = $state(-1);
let words: Word[] = $state([]);
let _infoData: InfoData = $state({mode: '', visible: false, time: 0});
let progressElement: HTMLProgressElement = $state() as HTMLProgressElement;
let requestID: number = 0;
let durationInSeconds = 0;

$effect(() => {
  _infoData = infoData;
  question = activity.question;
  words = activity.words;
  options = activity.optionSuboptions;
  indexOptWord = -1;
});

// =============================================

function barajarWords(array: Option[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function canAddWord(arr: Option[], word: string): boolean {
  const normalized = word.trim().toLowerCase();
  return !arr.some(
    item => item.option.trim().toLowerCase() === normalized
  );
}

function removeWord(arr: Option[], word: string): Option[] {
  const normalized = word.trim().toLowerCase();
  return arr.filter(
    item => item.option.trim().toLowerCase() !== normalized
  );
}

function handleSelectWord(index: number) {
  if (words[index].value === false) {
    words[index].value = !words[index].value;
    const word = words[index].word;
    if (canAddWord(options, word)) {
      options.push({option: word.toLowerCase()});
      options = barajarWords(options);
    }
  } else if (words[index].value === true) {
    words[index].value = !words[index].value;
    const word = words[index].word;
    let sw = true;
    for (let i = 0; i < words.length; i++) {
      if (words[i].value && words[i].word.toLowerCase() === word.toLowerCase()) {
        sw = false;
        break;
      }
    }
    if (sw) {
      // Quitar palabra de options
      options = removeWord(options, word);
    }
  }
  let _words = JSON.parse(JSON.stringify(words))
  let _options = JSON.parse(JSON.stringify(options))
  activityLocalstore.character(indexExercise, _words, _options);
}

function handleSelectOptWord(index: number) {
  indexOptWord = indexOptWord === -1 || indexOptWord !== index ? index : -1;
}

function handleStartLecture() {
  //console.log($state.snapshot(_infoData))
  _infoData.visible = false;
  durationInSeconds = _infoData.time;
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
      _infoData.mode = 'normal';
    }
  }

  requestAnimationFrame(update);
}

</script>

<Toast bind:this={toast} />

<div class="rf-character">
  {#if infoData.mode === 'normal'}

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
                    onclick={()=>handleSelectWord(index)}>{!w.value ? w.word : ''}</button>
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
                        onclick={()=>handleSelectWord(index)}>{!w.value ? w.word : ''}</button>
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
                <button class="w-opt-select {colors[num]}" 
                  onclick={()=>handleSelectOptWord(index)}>{opt.option}</button>
              {/each}
            </div>
          </div>
        {/if}

      </div>

    </div>

  {:else if _infoData.mode === 'lecture' && _infoData.visible === true} <!-- Mensaje inicio de lectura -->

    <div class="box-info-lecture-character">
      <h2 class="label-h2-character">Comprensión de lectura</h2>
      <p class="title-lecture-character">Título: {activity.question}</p>
      <div class="wr-img-lecture-character"><img src={reading} alt="" /></div>
      <button class="btn-start-lecture-character" onclick={handleStartLecture}>Iniciar actividad</button>
    </div>

  {:else if _infoData.mode === 'lecture' && _infoData.visible === false} <!-- Muestra la lectura -->

    <div class="center-exercise-character">
      <div class="wrapper-lecture-character" transition:fade>
        <progress bind:this={progressElement} class="progresbar-character progresbar-character" id="myProgress" value="0" max="100" style="width: 100%;"></progress>
        <h2 class="title-lecture-character">{activity.question}</h2>
        <p class="p-lecture-character">{activity.content}</p>
        <button class="btn-break-character" onclick={()=>_infoData.mode = 'normal'}>Saltar</button>
      </div>
    </div>

  {/if}
</div>
