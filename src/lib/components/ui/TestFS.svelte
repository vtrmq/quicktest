<script lang="ts">
import { FOLDER_IMAGES, FOLDER_AUDIOS, R2_DOMAIN, corregirIEnFrase, ordenarPorClave, mapWordErrorsToQuestions } from '$lib/utils';
import { activityLocalstore } from "$lib/store/activity_student";
const root_image = `${R2_DOMAIN}/${FOLDER_IMAGES}`;
const root_audio = `${R2_DOMAIN}/${FOLDER_AUDIOS}`;
import { Toast, Dialog, BtnChangeResult } from '$lib/components';

type WordItem = {
  id: number;
  word: string;
  error?: boolean; // Propiedad que agregaremos
}

type QuestionAudio = {
  text: string;
  image: string;
  audio: string;
  answersFS: WordItem[];
  words: WordItem[];
  value: number;
}

type WordErrorAudio = {
  point: number;
  errors: string[];
}

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

let wordsErrors: WordErrorAudio[] = [];
let points: QuestionAudio[] = $state([]);
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();

points = infoData.exercise.points;
wordsErrors = infoData.exercise.wordsErrors;

if (isWordsErrors) {
  points = mapWordErrorsToQuestions(infoData.exercise.points, infoData.exercise.wordsErrors);
}
/*
$effect(()=>{
  console.log($state.snapshot(infoData))
  console.log($state.snapshot(points))
});
*/
function handleSelectWordFS(point: number, index: number, word: WordItem) {
  if (isWordsErrors) {
    if (word.error) {
      dialog?.show({
        type: '',
        message: `
          <h1 class="title-err center">Palabra colocada incorrectamente</h1>
        `,
      });
    }
    return;
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

  points[point].answersFS.push(points[point].words[index]);
  const answers = points[point].answersFS;
  const words = ordenarPorClave(points[point].words, "id");

  if (answers.length <= words.length) {
    for (let i = 0; i < answers.length; i++) {
      let sw = false;
      if (answers[i].word !== words[i].word) {
        for (let x = 0; x < wordsErrors.length; x++) {
          if (wordsErrors[x].point === point) {
            sw = true;
            if (!wordsErrors[x].errors.includes(answers[i].word)) {
              wordsErrors[x].errors.push(answers[i].word);
            }
          }
        }
        if (sw === false) {
          wordsErrors.push({point: point, errors: [answers[i].word]});
        }
      }
    }
  }

  const _wordsErrors = ordenarPorClave(wordsErrors, "point");
  activityLocalstore.testFS(indexExercise, JSON.stringify(points), scales, JSON.stringify(_wordsErrors));
}

function handleSelectWordFSRemove(point: number, index: number) {
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
  points[point].answersFS.splice(index, 1);
  //console.log($state.snapshot(points))
  //console.log($state.snapshot(points[point]))
  activityLocalstore.testFS(indexExercise, JSON.stringify(points), scales);
}
</script>

<Dialog bind:this={dialog} action={()=>{}} />
<Toast bind:this={toast} />

<div class="container-activity-fs">

  <h1 class="title-fs">{infoData.exercise.content}</h1>

  {#if typeGeneral === 'R'}
    <div class="wr-btn-change-result">
      <BtnChangeResult onclick={()=>handleChangeResultView()} {viewResult} />
    </div>
  {/if}

  {#each points as qs, point}
    <div class="container-question-fs">
      <div class="wr-point-number-fs"><div class="point-number-fs">{point + 1}</div></div>

      <div class="wr-container-box-fs">
        {#if qs.image.length !== 0}
          <div>
            <div class="wr-image-question-fs">
              <img class="image-question-fs" src="{root_image}/{qs.image}" alt="" />
            </div>
          </div>
        {/if}

        {#if qs.audio.length !== 0}
          <div class="wr-audio-fs">
            <audio class="audio-fs" src="{root_audio}/{qs.audio}" controls></audio>
          </div>
        {/if}

        {#if qs.answersFS}
          {@const orden = qs.answersFS.every((obj, i) => i === 0 || obj.id >= qs.answersFS[i - 1].id)}
          <div class="container-answer-fs-rs" class:rst-bad={!orden && viewResult === 1 || ((qs.answersFS.length !== qs.words.length) && viewResult === 1)}>
            {#each qs.answersFS as word, index}
              <button class="answer-fs-rs" onclick={()=>handleSelectWordFSRemove(point, index)}>{word.word}</button>
            {/each}
          </div>
        {/if}

        {#if qs.words.length !== 0}
          <div class="container-answer-fs">
            {#each qs.words as word, index}
              <button class="answer-fs" onclick={()=>handleSelectWordFS(point, index, word)} class:bad-selected={isWordsErrors && word.error}>
                {corregirIEnFrase(word.word)}
              </button>
            {/each}
          </div>
        {/if}

      </div>

    </div>
  {/each}
</div>

<style>
.wr-btn-change-result {
  position: absolute;
  display: flex;
  justify-content: right;
  width: 100%;
}
</style>
