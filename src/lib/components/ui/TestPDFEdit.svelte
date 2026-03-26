<script lang="ts">
import { fade } from 'svelte/transition';
import { R2_DOMAIN, FOLDER_FILES } from '$lib/utils';
let { testPDF, viewBtnSheet } = $props();
let modeSheet = $state(false);
const root_file = `${R2_DOMAIN}/${FOLDER_FILES}`;

function handleModeSheet() {
  modeSheet = !modeSheet;
}
</script>

<iframe title="" class="iframe-test" src="{root_file}/{testPDF.file}" frameborder="0"></iframe>

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
