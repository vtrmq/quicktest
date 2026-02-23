<script lang="ts">
import { reemplazarEspacios } from '$lib/utils';
import { activityLocalstore } from "$lib/store/activity_student";
import { onMount } from 'svelte';
let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true } = $props();

type Option = { id: string; option: string };
type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
type PlacedOption = {
  id: string;
  option: string;
  x: number;
  y: number;
  resp: string;
  value: boolean;
};
type Opt = {
  id: string;
  option: string;
};

let container!: HTMLDivElement;
let canvas!: HTMLCanvasElement;
let ctx!: CanvasRenderingContext2D;

let placedOptions = $state<PlacedOption[]>([]);
let imagenPointOut = $state('');
let optionSuboptions = $state<Option[]>([]);
let lines = $state<Line[]>([]);
let selectedOption = $state<Option | null>(null);

placedOptions = infoData.exercise.placedOptions;
imagenPointOut = infoData.exercise.imagePointOut;
optionSuboptions = infoData.exercise.optionSuboptions;
lines = infoData.exercise.lines;

onMount(()=>{
  paint();
});

function resizeCanvas() {
  if (canvas && canvas.parentElement) {
    const r = canvas.parentElement!.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;
    redraw();
  }
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';

  for (const l of lines) drawLineWithCircle(l);

}

function drawLineWithCircle(l: Line) {
  const p1 = { x: l.x1, y: l.y1 };
  const p2 = { x: l.x2, y: l.y2 };

  const x1 = p1.x * canvas.width;
  const y1 = p1.y * canvas.height;
  const x2 = p2.x * canvas.width;
  const y2 = p2.y * canvas.height;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const ext = externalPoint(p1, p2);
  ctx.beginPath();
  ctx.arc(ext.x * canvas.width, ext.y * canvas.height, 4, 0, Math.PI * 2);
  ctx.fill();
}

function distanceToBorder(x: number, y: number) {
  return Math.min(x, 1 - x, y, 1 - y);
}

function externalPoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return distanceToBorder(a.x, a.y) <= distanceToBorder(b.x, b.y) ? a : b;
}

function handlePlaceWord(index: number, id: string) {
  if (isActionStudent === false) return;

  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }
  if (viewResult === 1) return;
  placedOptions[index].resp = selectedOption?.option as string;
  if (id === selectedOption?.id) {
    placedOptions[index].value = true;
  } else {
    placedOptions[index].value = false;
  }
  activityLocalstore.pointOut(indexExercise, JSON.stringify(placedOptions), scales);
}

function paint() {
  ctx = canvas.getContext('2d')!;
  resizeCanvas();
  redraw();
  window.addEventListener('resize', resizeCanvas);
};

function handleSelectOption(opt: Opt) {
  if (isActionStudent === false) return;
  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }
  if (viewResult === 0) {
    selectedOption = opt
  }
  //{viewResult === 0 ? selectedOption = opt : ()=>{}}
}

</script>

<div class="designer-point-out">

  <!-- Toolbar -->
  <div class="header-point-out">
    {infoData.exercise.question}
  </div>

  <!-- Contenedor imagen -->

  <div class="image-container-point-out" bind:this={container}>
    <div class="stage-point-out">
      <img src={imagenPointOut} draggable="false" alt="" />
      <canvas bind:this={canvas}></canvas>

      {#each placedOptions as item, index (item.id)}
        <button
          class="placed-point-out"
          style="left:{item.x * 100}%; top:{item.y * 100}%" onclick={()=>handlePlaceWord(index, item.id)} 
          class:item-bad-point-out={item.value === false && viewResult === 1}>
          <span>{item.resp}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Opciones -->
  <div class="options-point-out">
    {#each optionSuboptions as opt}
      <button
        class="btn-word-option-point-out"
        onclick={() => handleSelectOption(opt)}
        class:selected={selectedOption?.option === opt.option}>{@html reemplazarEspacios(opt.option)}</button>
    {/each}
  </div>

</div>
