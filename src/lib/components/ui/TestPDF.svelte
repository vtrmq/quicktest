<script lang="ts">
import { activityLocalstore } from "$lib/store/activity_student";

type Point = {
  points: [{char: string; rss: boolean; rst: boolean}];
}

let modeSheet = $state(false);

let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true } = $props();

(()=>{
  console.log($state.snapshot(infoData))
})();

let points: Point[] = $state([]);
points = infoData.exercise.points;

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
  points[point].points[item].rss = !points[point].points[item].rss
  activityLocalstore.testPDF(indexExercise, JSON.stringify(points), scales);
}
</script>

<iframe title="" class="iframe-test" src={infoData.exercise.file} frameborder="0"></iframe>

<button class="btn-sheet" onclick={handleModeSheet}>Hoja de respuesta</button>

<div class="sheet-response" class:view-sheet={modeSheet}>
  <div class="header-sheet-response">
    <p>Hoja de respuestas</p>
    <button class="btn-close-sheet" onclick={handleModeSheet}>Ocultar</button>
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
              class:rst-point={points.rss && viewResult === 0}
              class:rst-good={(points.rss === true && points.rst === true) && viewResult === 1}
              class:rst-bad={(points.rss === true && points.rst === false) && viewResult === 1}
              class:rst-std={((points.rss === false && points.rst === true && isActionStudent === false) && viewResult === 1)} 
            >
              {points.char}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
