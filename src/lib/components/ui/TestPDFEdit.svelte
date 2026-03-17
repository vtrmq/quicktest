<script lang="ts">
import { fade } from 'svelte/transition';
let { testPDF, viewBtnSheet } = $props();
let modeSheet = $state(false);
function handleModeSheet() {
  modeSheet = !modeSheet;
}
</script>

<iframe title="" class="iframe-test" src={testPDF.file} frameborder="0"></iframe>

{#if !viewBtnSheet}
  <button class="btn-sheet" onclick={handleModeSheet} transition:fade={{ duration: 180 }}>Hoja de respuesta</button>
{/if}

<div class="sheet-response" class:view-sheet={modeSheet}>
  <div class="header-sheet-response">
    <p>Hoja de respuestas</p>
    <button class="btn-close-sheet" onclick={handleModeSheet}>Ocultar</button>
  </div>
  <div class="container-points-testpdf">
    {#each testPDF.points as _points, index}
      <div class="row-points-testpdf">
        <div class="label-item-testpdf">{index + 1}</div>
        <div class="row-pts-testpdf">
          {#each _points.points as points}
            <button class="btn-point-testpdf" class:rst-point={points.rst}>{points.char}</button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<!--
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
  padding: 1em 1em 3em;
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
-->
