<script lang="ts">
import { reemplazarEspacios } from '$lib/utils';
import { activityLocalstore } from '$lib/store/activity';
let { infoData, indexExercise = -1 } = $props();

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

let container!: HTMLDivElement;
let canvas!: HTMLCanvasElement;
let ctx!: CanvasRenderingContext2D;

let placedOptions = $state<PlacedOption[]>([]);
let imagenPointOut = $state('');
let optionSuboptions = $state<Option[]>([]);
let lines = $state<Line[]>([]);
let selectedOption = $state<Option | null>(null);

$effect(() => {
  placedOptions = infoData.exercise.placedOptions;
  imagenPointOut = infoData.exercise.imagePointOut;
  optionSuboptions = infoData.exercise.optionSuboptions;
  lines = infoData.exercise.lines;
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
  console.log(index, id)
  console.log($state.snapshot(placedOptions))
  console.log($state.snapshot(selectedOption))
  placedOptions[index].resp = selectedOption?.option as string;
  if (id === placedOptions[index].id) {
    console.log(true)
  } else {
    console.log(false)
  }
}

function paint() {
  ctx = canvas.getContext('2d')!;
  resizeCanvas();
  redraw();
  window.addEventListener('resize', resizeCanvas);
};

</script>

<div class="designer">

  <!-- Toolbar -->
  <div class="header">
    {infoData.exercise.question}
  </div>

  <!-- Contenedor imagen -->

  <div class="image-container" bind:this={container}>
    <div class="stage">
      <img src={imagenPointOut} draggable="false" alt="" />
      <canvas bind:this={canvas}></canvas>

      {#each placedOptions as item, index (item.id)}
        <button
          class="placed"
          style="left:{item.x * 100}%; top:{item.y * 100}%" onclick={()=>handlePlaceWord(index, item.id)}><span>{item.resp}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Opciones -->
  <div class="options">
    {#each optionSuboptions as opt}
      <button
        class="btn-word-option"
        onclick={() => {selectedOption = opt}}
        class:selected={selectedOption?.option === opt.option}>{@html reemplazarEspacios(opt.option)}</button>
    {/each}
  </div>

</div>

<style>
.options {
  background: #d1e1dc;
  display: flex;
  overflow-x: auto;
  padding: 3px 10px;
  gap: 0.6em;
  border-top: 2px solid #333;
  align-items: center;
}

.options button.selected {
  background: #333;
  color: white;
}
.btn-word-option {
  font-family: var(--font-normal);
  padding: 0.4em;
  border-radius: 4px;
  outline: none;
  border: none;
  cursor: pointer;
  background: #0aa74f;
  color: #fff;
  height: 32px;
}
.header {
  background: #fffede;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  border-bottom: 2px solid #333;
  height: 50px;
  font-family: var(--font-normal);
  text-align: center;
}
.designer {
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: auto;
  background: #fff;
  display: grid;
  grid-template-rows: 50px 1fr 60px;
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
}
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  touch-action: none;
  overflow-y: auto;
}
.stage {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.stage img {
  width: 100%;
  height: 100%;
  object-fit: fill; /* contain 🔥 clave */
  display: block;
}

.stage canvas {
  position: absolute;
  inset: 0;
}

.placed {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  font-family: var(--font-normal);
  padding: 4px 6px;
  border-radius: 6px;
  background: white;
  border: 1px solid #333;
  white-space: nowrap;
  min-width: 50px;
  height: 30px;
}
</style>
