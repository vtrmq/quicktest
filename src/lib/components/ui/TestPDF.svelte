<script lang="ts">
import { fade } from 'svelte/transition';
import { activityLocalstore } from "$lib/store/activity_student";
import { ordenarPorClave, ordenarNumeros, addCountTest, R2_DOMAIN, FOLDER_FILES } from '$lib/utils';
import { Dialog } from "$lib/components";

/*
type Point = {
  points: [{char: string; rss: boolean; rst: boolean, success: boolean, error: boolean}];
}
type WordError = {
  point: number;
  errors: number[];
};
*/

type Point = {
  char: string;
  rst: boolean;
  rss: boolean;
  success: boolean;
  error?: boolean; // El signo ? indica que es opcional, ya que no existe inicialmente
}

type Question = {
  errors: number;
  points: Point[];
  value: number;
  success: boolean;
}

type WordError = {
  point: number;
  errors: number[];
}

let dialog = $state<Dialog | null>(null);
let modeSheet = $state(false);
const root_file = `${R2_DOMAIN}/${FOLDER_FILES}`;

let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true, viewBtnSheet, isWordsErrors = false } = $props();
/*
(()=>{
  console.log($state.snapshot(infoData))
})();
*/

let points: Question[] = $state([]);
let wordsErrors: WordError[] = [];
points = infoData.exercise.points;
wordsErrors = infoData.exercise.wordsErrors;

if (isWordsErrors) {
  points = addCountTest(infoData.exercise.points, infoData.exercise.wordsErrors);
}

function handleModeSheet() {
  modeSheet = !modeSheet;
}

function handleSelectPoint(point: number, item: number) {
  if (isWordsErrors) {
    const error = points[point].points[item].error;
    if (error) {
      dialog?.show({
        type: '',
        message: `
          <h1 class="title-err center">Respuesta seleccionada erroneamente</h1>
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
  if (viewResult === 1) return;
  points[point].points[item].rss = !points[point].points[item].rss;

  if (points[point].points[item].rss && points[point].points[item].success === false) {
    points[point].points[item].success = true;
  } else if (points[point].points[item].rss === false && points[point].points[item].rst === true && points[point].points[item].success) {
    points[point].points[item].success = false;
  }

  let sw = false;

  if ((points[point].points[item].rss === true && points[point].points[item].rst === false && points[point].points[item].success) 
    || (points[point].points[item].rss === false && points[point].points[item].rst === true && points[point].points[item].success)) { // Malo
    for (let x = 0; x < wordsErrors.length; x++) {
      if (wordsErrors[x].point === point) {
        sw = true;
        if (!wordsErrors[x].errors.includes(item)) {
          wordsErrors[x].errors.push(item);
          wordsErrors[x].errors = ordenarNumeros(wordsErrors[x].errors)
        }
      }
    }
    if (sw === false) {
      wordsErrors.push({point: point, errors: [item]});
    }
  }
  //console.log($state.snapshot(wordsErrors))
  const _wordsErrors = ordenarPorClave(wordsErrors, "point");
  activityLocalstore.testPDF(indexExercise, JSON.stringify(points), JSON.stringify(_wordsErrors), scales);
}

function handleValidated() {
  //console.log(viewResult)
  viewResult = viewResult === 2 ? 1 : 2;
}
</script>

<Dialog bind:this={dialog} action={()=>{}} />

<iframe title="" class="iframe-test" src="{root_file}/{infoData.exercise.file}" frameborder="0"></iframe>

{#if !viewBtnSheet}
  <button class="btn-sheet" onclick={handleModeSheet} transition:fade={{ duration: 180 }}>Hoja de respuesta</button>
{/if}

<div class="sheet-response" class:view-sheet={modeSheet}>
  <div class="header-sheet-response">
    <p>Respuestas</p>
    <div class="wr-btns-r">
      {#if type_activity === "R"}
        <button class="btn-result-exerc" onclick={()=>handleValidated()}>
          {#if isActionStudent}
            {#if viewResult === 2}
              Resultados
            {:else}
              Continuar
            {/if}
          {:else if isActionStudent === false}
            {#if viewResult === 2}
              Validar
            {:else}
              Resultados
            {/if}
          {/if}
        </button>
      {/if}
      <button class="btn-close-sheet" onclick={handleModeSheet}>Ocultar</button>
    </div>
  </div>
  <div class="container-points-testpdf">
    {#each points as _points, point}
      <div class="row-points-testpdf">
        <div class="label-item-testpdf">{point + 1}</div>
        <div class="row-pts-testpdf">
          {#each _points.points as points, item}
            <button 
              class="btn-point-testpdf" 
              onclick={()=>handleSelectPoint(point, item)} 
              class:rst-point={points.rss && (viewResult === 2 || viewResult === 0)}
              class:rst-good={(points.rss === true && points.rst === true) && viewResult === 1}
              class:rst-bad={(points.rss === true && points.rst === false) && viewResult === 1}
              class:rst-std={((points.rss === false && points.rst === true && isActionStudent === false) && viewResult === 1)}>
              {points.char}
              {#if isWordsErrors && points.error}
                <span class="bool-errors">👆</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
.wr-btns-r {
  display: flex;
  gap: 1em;
}
</style>
