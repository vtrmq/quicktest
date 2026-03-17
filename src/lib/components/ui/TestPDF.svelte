<script lang="ts">
import { fade } from 'svelte/transition';
import { activityLocalstore } from "$lib/store/activity_student";
import { ordenarPorClave, ordenarNumeros } from '$lib/utils';

type Point = {
  points: [{char: string; rss: boolean; rst: boolean, success: boolean}];
}
type WordError = {
  point: number;
  errors: number[];
};

let modeSheet = $state(false);

let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true, viewBtnSheet } = $props();
/*
(()=>{
  console.log($state.snapshot(infoData))
  console.log($state.snapshot(type_activity))
})();
*/
let points: Point[] = $state([]);
let wordsErrors: WordError[] = [];
points = infoData.exercise.points;
wordsErrors = infoData.exercise.wordsErrors;

function handleModeSheet() {
  modeSheet = !modeSheet;
}

function handleSelectPoint(point: number, item: number) {
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

<iframe title="" class="iframe-test" src={infoData.exercise.file} frameborder="0"></iframe>

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
