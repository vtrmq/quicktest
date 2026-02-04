<script lang="ts">
import { reemplazarEspacios } from '$lib/utils';
import { activityLocalstore } from '$lib/store/activity';
import { onMount } from 'svelte';

/* =======================
   TIPOS
======================= */
type Option = { id: string; option: string };

type PlacedOption = {
  id: string;
  option: string;
  x: number;
  y: number;
  resp: string;
  value: boolean;
};

type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/* =======================
   PROPS + STATE
======================= */
let { activity, intro = true, indexExercise = -1 } = $props();

let visibleWord = $state(true);
let imagenPointOut = $state('');
let optionSuboptions = $state<Option[]>([]);
let placedOptions = $state<PlacedOption[]>([]);
let lines = $state<Line[]>([]);

let mode = $state<'place' | 'draw'>('place');
//let selectedOption = $state<string | null>(null);
let selectedOption = $state<Option | null>(null);

/* =======================
   CANVAS
======================= */
let container!: HTMLDivElement;
let canvas!: HTMLCanvasElement;
let ctx!: CanvasRenderingContext2D;

/* =======================
   DRAW STATE
======================= */
let drawing = false;
let startPoint: { x: number; y: number } | null = null;
let currentPoint: { x: number; y: number } | null = null;

/* =======================
   INIT
======================= */
$effect(() => {
  if (!intro) return;
  intro = false;

  imagenPointOut = activity.imagePointOut;
  optionSuboptions = activity.optionSuboptions;
  placedOptions = activity.placedOptions ?? [];
  lines = activity.lines ?? [];
});

/* =======================
   OBJETO DE DISEÑO (PARA GUARDAR)
======================= */
$effect(() => {
  // Evita guardar antes de que cargue la actividad
  if (intro) return;

  const designExercise = {
    lines: lines,
    placedOptions: placedOptions,
  };
  //console.log(designExercise)
  activityLocalstore.pointOut(indexExercise, designExercise);
});


onMount(() => {
  ctx = canvas.getContext('2d')!;
  resizeCanvas();
  redraw();
  window.addEventListener('resize', resizeCanvas);
});

/* =======================
   CANVAS CORE
======================= */
function resizeCanvas() {
  //const r = container.getBoundingClientRect();
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

  if (drawing && startPoint && currentPoint) {
    drawPreviewLine(startPoint, currentPoint);
  }
}

/* =======================
   GEOMETRÍA
======================= */
function distanceToBorder(x: number, y: number) {
  return Math.min(x, 1 - x, y, 1 - y);
}

function externalPoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return distanceToBorder(a.x, a.y) <= distanceToBorder(b.x, b.y) ? a : b;
}

function distancePointToLine(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const t = lenSq ? dot / lenSq : -1;

  let xx, yy;
  if (t < 0) { xx = x1; yy = y1; }
  else if (t > 1) { xx = x2; yy = y2; }
  else { xx = x1 + t * C; yy = y1 + t * D; }

  return Math.hypot(px - xx, py - yy);
}

/* =======================
   DIBUJO
======================= */
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

function drawPreviewLine(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x1 = a.x * canvas.width;
  const y1 = a.y * canvas.height;
  const x2 = b.x * canvas.width;
  const y2 = b.y * canvas.height;

  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

  const ext = externalPoint(a, b);
  ctx.beginPath();
  ctx.arc(ext.x * canvas.width, ext.y * canvas.height, 7, 0, Math.PI * 2);
  ctx.fill();
}

// Inicio
/* =======================
   POINTER EVENTS
======================= */
/*
function onPointerDown(e: PointerEvent) {
  container.setPointerCapture(e.pointerId);

  const r = container.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;

  const px = x * canvas.width;
  const py = y * canvas.height;
  const tolerance = 10;

  const before = lines.length;
  lines = lines.filter(l =>
    distancePointToLine(
      px, py,
      l.x1 * canvas.width, l.y1 * canvas.height,
      l.x2 * canvas.width, l.y2 * canvas.height
    ) > tolerance
  );

  // Si se borró una línea, NO dibujamos
  if (before !== lines.length) {
    redraw();
    return;
  }

  if (mode === 'draw') {
    drawing = true;
    startPoint = { x, y };
    currentPoint = { x, y };
    redraw();
    return;
  }

  if (mode === 'place' && selectedOption) {
    placedOptions.push({
      id: crypto.randomUUID(),
      option: selectedOption,
      x,
      y
    });
    selectedOption = null;
  }
}
*/

function onPointerDown(e: PointerEvent) {
  container.setPointerCapture(e.pointerId);

  const r = container.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;

  /* ==========================
     PRIORIDAD: COLOCAR PALABRA
  ========================== */
  if (selectedOption) {
    placedOptions.push({
      //id: crypto.randomUUID(),
      id: selectedOption.id,
      option: selectedOption.option,
      value: false,
      x,
      y,
      resp: ''
    });
    selectedOption = null;
    redraw();
    return; // NO borrar, NO dibujar
  }

  /* ==========================
     BORRADO POR CLICK EN LÍNEA
  ========================== */
  const px = x * canvas.width;
  const py = y * canvas.height;
  const tolerance = 10;

  const lineIndex = lines.findIndex(l =>
    distancePointToLine(
      px, py,
      l.x1 * canvas.width, l.y1 * canvas.height,
      l.x2 * canvas.width, l.y2 * canvas.height
    ) <= tolerance
  );

  if (lineIndex !== -1) {
    lines.splice(lineIndex, 1);
    redraw();
    return;
  }

  /* ==========================
     DIBUJO DE LÍNEA
  ========================== */
  if (mode === 'draw') {
    drawing = true;
    startPoint = { x, y };
    currentPoint = { x, y };
    redraw();
  }
}


function onPointerMove(e: PointerEvent) {
  if (!drawing || !startPoint) return;

  const r = container.getBoundingClientRect();
  currentPoint = {
    x: (e.clientX - r.left) / r.width,
    y: (e.clientY - r.top) / r.height
  };
  redraw();
}

function onPointerUp(e: PointerEvent) {
  if (!drawing || !startPoint || !currentPoint) return;

  lines.push({
    x1: startPoint.x,
    y1: startPoint.y,
    x2: currentPoint.x,
    y2: currentPoint.y
  });

  drawing = false;
  startPoint = null;
  currentPoint = null;

  mode = 'place'; // APAGA MODO DIBUJO

  container.releasePointerCapture(e.pointerId);
  redraw();
}

/* =======================
   DRAG BOTONES
======================= */
let draggingId: string | null = null;

function startDrag(e: PointerEvent, id: string) {
  e.stopPropagation();
  e.preventDefault();
  mode = 'place'; // apaga dibujo
  draggingId = id;
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
  window.addEventListener('pointermove', drag);
  window.addEventListener('pointerup', stopDrag);
}

function drag(e: PointerEvent) {
  if (!draggingId) return;

  const r = container.getBoundingClientRect();
  placedOptions = placedOptions.map(p =>
    p.id === draggingId
      ? { ...p, x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
      : p
  );
}

function stopDrag() {
  draggingId = null;
  window.removeEventListener('pointermove', drag);
  window.removeEventListener('pointerup', stopDrag);
}

function removeOption(e: Event, id: string) {
  e.stopPropagation();
  e.preventDefault();
  mode = 'place'; // apaga dibujo
  placedOptions = placedOptions.filter(p => p.id !== id);
}

function handleDraw() {
  if (mode === 'draw') {
    mode = 'place';
  } else {
    mode = 'draw';
  }
  selectedOption = null;
}
</script>

<div class="designer">

  <!-- Toolbar -->
  <div class="toolbar">
    <!--button class="btn-option-menu" onclick={() => mode = 'place'} class:active={mode === 'place'}>
      Colocar palabra
    </button-->
    <button class="btn-option-menu" onclick={handleDraw} class:active={mode === 'draw'}>
      Dibujar línea
    </button>
    <button class="btn-option-menu" onclick={() => {visibleWord = !visibleWord;}}>
      {visibleWord ? 'Ocultar texto' : 'Mostrar texto'}
    </button>
  </div>

  <!-- Contenedor imagen -->

  <div class="image-container" bind:this={container}
    onpointerdown={onPointerDown}
    onpointerup={onPointerUp}
    onpointermove={onPointerMove}
  >
    <div class="stage">
      <img src={imagenPointOut} draggable="false" alt="" />
      <canvas bind:this={canvas}></canvas>

      {#each placedOptions as item (item.id)}
        <button
          class="placed"
          style="left:{item.x * 100}%; top:{item.y * 100}%"
          onpointerdown={(e) => startDrag(e, item.id)}
        ><span class:visible-word={!visibleWord}>{item.option}</span><span class="remove" onpointerdown={(e) => removeOption(e, item.id)} role="button" tabindex="0">✕</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Opciones -->
  <div class="options">
    {#each optionSuboptions as opt}
      <button
        class="btn-word-option"
        disabled={placedOptions.some(p => p.option === opt.option)}
        onclick={() => {mode = 'place'; selectedOption = opt}}
        class:selected={selectedOption?.option === opt.option}>{@html reemplazarEspacios(opt.option)}</button>
    {/each}
  </div>

</div>


<style>
.visible-word {
  display: none;
}
.btn-option-menu {
  font-family: var(--font-normal);
  padding: 0.4em;
  border-radius: 4px;
  outline: none;
  border: none;
  cursor: pointer;
  width: 100px;
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

/* CANVAS */
.stage canvas {
  position: absolute;
  inset: 0;
}

.placed {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: grab;
  font-family: var(--font-normal);
  padding: 4px 6px;
  border-radius: 6px;
  background: white;
  border: 1px solid #333;
  white-space: nowrap;
  min-width: 50px;
  height: 30px;
}

.remove {
  margin-left: 6px;
  cursor: pointer;
  display: none;
}

.options {
  background: #d1e1dc;
  display: flex;
  overflow-x: auto;
  padding: 3px 10px;
  gap: 0.6em;
  border-top: 2px solid #333;
  align-items: center;
  /*
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1em;
  border-top: 2px solid #333;
*/
}

.options button.selected {
  background: #333;
  color: white;
}
.options button:disabled {
  background: #838c91;
  color: #fff;
}
.toolbar {
  background: #68c7f5;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  border-bottom: 2px solid #333;
}
.toolbar button.active {
  font-weight: bold;
}

</style>



  <!--div
    class="image-container"
    bind:this={container}
    onpointerdown={onPointerDown}
    onpointerup={onPointerUp}
    onpointermove={onPointerMove}
  >
    <img src={imagenPointOut} draggable="false" alt="" />

    <canvas bind:this={canvas}></canvas>

    {#each placedOptions as item (item.id)}
      <button
        class="placed"
        style="
          left: {item.x * 100}%;
          top: {item.y * 100}%;
        "
        onpointerdown={(e) => startDrag(e, item.id)}
      >
        {item.option}
        <span class="remove" onpointerdown={(e) => removeOption(e, item.id)} onkeyup={()=>{}} role="button" tabindex="0">✕</span>
      </button>
    {/each}
  </div-->
