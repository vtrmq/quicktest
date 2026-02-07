<script lang="ts">
type Point = {
  points: [{char: string; rss: boolean; rst: boolean}];
}
let modeSheet = $state(false);

let { infoData, indexExercise = -1 } = $props();

let points: Point[] = $state([]);
points = infoData.exercise.points;

function handleModeSheet() {
  modeSheet = !modeSheet;
}

function handleSelectPoint(point: number, item: number) {
  points[point].points[item].rss = !points[point].points[item].rss
}
</script>

<iframe title="" class="iframe" src={infoData.exercise.file} frameborder="0"></iframe>

<button class="btn-sheet" onclick={handleModeSheet}>Hoja de respuesta</button>

<div class="sheet-response" class:view-sheet={modeSheet}>
  <div class="header-sheet-response">
    <p>Hoja de respuestas</p>
    <button class="btn-close-sheet" onclick={handleModeSheet}>Ocultar</button>
  </div>
  <div class="container-points">
    {#each points as _points, point}
      <div class="row-points">
        <div class="label-item">{point + 1}</div>
        <div class="row-pts">
          {#each _points.points as points, item}
            <button class="btn-point" onclick={()=>handleSelectPoint(point, item)} class:rst-point={points.rss}>{points.char}</button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
.btn-close-sheet {
  padding: 0.5em 1em;
  cursor: pointer;
  outline: none;
  border-radius: 5px;
  font-family: var(--font-normal);
  background: var(--bg-blue);
  color: #fff;
  transition: var(--transition);
}
.btn-close-sheet:hover {
  background: var(--bg-blue-hover);
}
.header-sheet-response {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-normal);
  padding: 1em 0.5em 1em 0.5em;
  border-bottom: 1px solid #333;
  height: var(--height-header);
  background: #bde1e1;
}
.row-pts {
  display: flex;
  gap: 0.5em;
}
.label-item {
  font-family: var(--font-normal);
  font-weight: 900;
  font-size: 1.2em;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ff6060;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}
.btn-point {
  font-family: var(--font-normal);
  width: 36px;
  height: 36px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #ffffff;
  font-weight: 900;
  font-size: 1.1em;
}
.btn-point.rst-point {
  background: #11d511;
  color: #fff;
}
.row-points {
  display: flex;
  background: var(--border-item);
  padding: 8px;
  border-radius: var(--border-radius);
  position: relative;
  box-shadow: rgb(161 178 225) 0px 3px 0px 0px;
  gap: 1em;
}
.container-points {
  display: flex;
  flex-direction: column;
  gap: 1em;
  overflow-y: auto;
  height: calc(100% - var(--height-header));
  padding: 1em 0.5em 3em;
}
.sheet-response {
  position: fixed;
  height: 100%;
  width: 320px;
  top: 0;
  right: -330px;
  background: #fff;
  z-index: 1000;
  border-left: 1px solid;
  transition: 0.3s;
}
.sheet-response.view-sheet {
  right: 0;
}
.btn-sheet {
  position: absolute;
  top: 20px;
  right: 30px;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-family: var(--font-normal);
  background: var(--bg-blue);
  color: #fff;
  transition: var(--transition);
}
.btn-sheet:hover {
  background: var(--bg-blue-hover);
}
.iframe {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 1px;
}
</style>
