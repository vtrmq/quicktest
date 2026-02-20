<script lang="ts">
import { fade } from 'svelte/transition';
import { activityLocalstore } from "$lib/store/activity_student";
import reading from '$lib/assets/images/reading.png';
import { colorSynt } from '$lib/utils';
    import { onMount } from 'svelte';
//import { onMount } from 'svelte';

type Side = 'left' | 'right';
type Words = { word: string; };
type Connection = {
  left: string;
  right: string;
}
type SelectedWord = {
  element: HTMLButtonElement; 
  side: Side;
}

let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity } = $props();

let selectedWord: SelectedWord | null = null;
let canvasMatch = $state() as HTMLCanvasElement;
let leftColumn = $state() as HTMLDivElement;
let rightColumn = $state() as HTMLDivElement;
let columnsContainer = $state() as HTMLDivElement;
let containerMatch = $state() as HTMLDivElement;
let leftWords: Words[] = $state([]);
let rightWords: Words[] = $state([]);
let wordConnectionsTeacher: Connection[] = $state([]);
let wordConnections: Connection[] = $state([]);
let box_match = $state('');
let mode = $state('normal');
let visible = $state(true);
let time = $state(0);
let progressElement: HTMLProgressElement = $state() as HTMLProgressElement;
let requestID: number = 0;
let durationInSeconds = 0;
let ctx: CanvasRenderingContext2D | null = null;
let swHeight = false;
let IdMatch = '';

leftWords = infoData.exercise.leftWords;
rightWords = infoData.exercise.rightWords;
wordConnections = infoData.exercise.wordConnectionsStudent;
wordConnectionsTeacher = infoData.exercise.wordConnections;

mode = infoData.mode;
time = infoData.time;

$effect(()=>{
  handlePaintErrors()
});
onMount(()=>{
  viewConnections();
});

function handlePaintErrors() {
  wordConnections.forEach((connection: Connection) => {
    const leftWord = Array.from(leftColumn.children)
    .find((el): el is HTMLButtonElement =>
      el instanceof HTMLButtonElement && el.id === connection.left
    );

    const rightWord = Array.from(rightColumn.children)
    .find((el): el is HTMLButtonElement =>
      el instanceof HTMLButtonElement && el.id === connection.right
    );

    if (leftWord && rightWord) {
      const resp = wordConnectionsTeacher.some((conn: Connection) =>
        conn.left === leftWord.id && conn.right === rightWord.id
      )
      document.getElementById(leftWord.id)?.classList.remove('error');
      if (resp === false && viewResult === 1) {
        document.getElementById(leftWord.id)?.classList.add('error');
      }
    }
  });
}

function saveConnections() {
  let arrConnections = JSON.parse(JSON.stringify(wordConnections))
  activityLocalstore.match(indexExercise, JSON.stringify(arrConnections), scales);
}

function connect(leftWord: HTMLButtonElement, rightWord: HTMLButtonElement) {
  const connection = {
    left: leftWord.id,
    right: rightWord.id
  };
  const existingConnection = wordConnections.find((c: Connection) => 
    c.left === connection.left && c.right === connection.right);

  if (existingConnection) {
    wordConnections = wordConnections.filter((c: Connection) => c !== existingConnection);
  } else {
    wordConnections.push(connection);
  }
  saveConnections();
  drawConnections();
}

function selectWordMatch(wordElement: Event, side: Side, index: number) {

  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }

  if (viewResult === 1) return;

  const element  = wordElement.target as HTMLButtonElement;

  let sw = false;
  if (side === 'left') {
    if (selectedWord !== null && IdMatch === element.id) {
      box_match = '';
      sw = false;
    } else if (selectedWord !== null && IdMatch !== element.id) {
      box_match = '';
      IdMatch = element.id;
      sw = true;
    } else if (selectedWord === null) {
      IdMatch = element.id;
      sw = true;
    }
  }
  if (sw) {
    selectedWord = { element, side };
    box_match = `L-${index}`;
    sw = false;
  } else if (selectedWord !== null && selectedWord.side !== side) {
    connect(selectedWord.element, element);
    box_match = '';
    selectedWord = null;
    sw = false;
  } else {
    if (selectedWord !== null) {
      box_match = '';
      selectedWord = null;
      sw = false;
    }
  }

}

function handleStartLecture() {
  visible = false;
  durationInSeconds = time;
  requestID = requestAnimationFrame(startProgress);
}

function drawArrow(fromx: number, fromy: number, tox: number, toy: number) {
  const headlen = 10; // length of head in pixels
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);
  if (!ctx) return;
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function getWordEdge(wordElement: HTMLButtonElement, side: string) {
  const rect = wordElement.getBoundingClientRect();
  const containerRect = columnsContainer.getBoundingClientRect();

  return {
    x: side === 'right'
      ? rect.right - containerRect.left
      : rect.left - containerRect.left,
    y: rect.top - containerRect.top + rect.height / 2
  };
}

//let isEntry = false;
function drawConnections() {

  canvasMatch.width = columnsContainer.offsetWidth;
  canvasMatch.height = columnsContainer.offsetHeight;

  if (ctx) {
    ctx.clearRect(0, 0, canvasMatch.width, canvasMatch.height);

    wordConnections.forEach((connection: Connection, index: number) => {

      //const leftWord: any = Array.from(leftColumn.children).find(el => el.id === connection.left);
      //const rightWord: any = Array.from(rightColumn.children).find(el => el.id === connection.right);
      const leftWord = Array.from(leftColumn.children)
      .find((el): el is HTMLButtonElement =>
        el instanceof HTMLButtonElement && el.id === connection.left
      );

      const rightWord = Array.from(rightColumn.children)
      .find((el): el is HTMLButtonElement =>
        el instanceof HTMLButtonElement && el.id === connection.right
      );

      if (leftWord && rightWord) {
        const start = getWordEdge(leftWord, 'right');
        const end = getWordEdge(rightWord, 'left');

        /*
        const resp = wordConnectionsTeacher.some((conn: Connection) =>
          conn.left === leftWord.id && conn.right === rightWord.id
        )
        document.getElementById(leftWord.id)?.classList.remove('error');
        if (resp === false && viewResult === 1) {
          document.getElementById(leftWord.id)?.classList.add('error');
        }
        */

        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = colorSynt(index);
        ctx.lineWidth = 1.5;

        // Draw arrows at both ends
        drawArrow(start.x, start.y, end.x, end.y);
        drawArrow(end.x, end.y, start.x, start.y);

        ctx.stroke();
      }
    });
  }
}

function updateCanvasSize() {
  if (containerMatch !== null && containerMatch !== undefined) {
    canvasMatch.width = containerMatch.offsetWidth - 5;
    if (swHeight === false) {
      canvasMatch.height = containerMatch.offsetHeight;
      swHeight = true;
    }
    drawConnections();
  } else {
    window.removeEventListener('resize', updateCanvasSize);
  }
}

function viewConnections() {
  updateCanvasSize();
  if (mode === 'normal') {
    ctx = canvasMatch.getContext('2d');
    wordConnections = infoData.exercise.wordConnectionsStudent;
    drawConnections();
    window.addEventListener('resize', updateCanvasSize);
  }
}

function viewLines() {
  mode = 'normal';
  setTimeout(()=>{
    viewConnections();
  }, 1000);
}

function startProgress() {
  const durationInMs = durationInSeconds * 1000;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;

    // Calculamos el progreso (de 0 a 1)
    const progress = Math.min(elapsed / durationInMs, 1);

    // El elemento <progress> usa valores de 0 a 100 (o el 'max' definido)
    if (!progressElement) {
      cancelAnimationFrame(requestID); // Detiene la ejecución en el navegador
      requestID = 0;
      return;
    }
    progressElement.value = progress * 100;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      //console.log("¡Actividad completada!");
      cancelAnimationFrame(requestID); // Detiene la ejecución en el navegador
      requestID = 0;
      viewLines();
    }
  }

  requestAnimationFrame(update);
}

</script>

<div class="rf">
  {#if infoData.mode === 'normal'}

    <div class="center-exercise">
      <div class="body-exercise-match" bind:this={containerMatch}>
        <div class="mg-center">
          <div class="pd1">
            <h1 class="question-match">{infoData.exercise.question}</h1>
            <div class="container-columns" bind:this={columnsContainer}>
              <div class="column" bind:this={leftColumn}>
                {#each leftWords as w, index}
                  <button 
                    id="L-{index}" 
                    class="word-mt" 
                    class:selected-box={`L-${index}` === box_match}
                    onclick={(e)=>selectWordMatch(e, 'left', index)}>{w.word}</button>
                {/each}
              </div>
              <div class="column" bind:this={rightColumn}>
                {#each rightWords as w, index}
                  <button 
                    id="R-{index}" 
                    class="word-mt" 
                    onclick={(e)=>selectWordMatch(e, 'right', index)}>{w.word}</button>
                {/each}
              </div>
              <canvas class="canvas" bind:this={canvasMatch}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

  {:else if mode === 'lecture' && visible} <!-- Mensaje inicio de lectura -->

    <div class="box-info-lecture">
      <h2 class="label-h2">Comprensión de lectura</h2>
      <p class="title-lecture">Título: {infoData.exercise.question}</p>
      <div class="wr-img-lecture"><img src={reading} alt="" /></div>
      <button class="btn-start-lecture" onclick={handleStartLecture}>Iniciar actividad</button>
    </div>

  {:else if mode === 'lecture' && !visible} <!-- Muestra la lectura -->

    <div class="center-exercise">
      <div class="wrapper-lecture" transition:fade>
        <progress bind:this={progressElement} class="progresbar" id="myProgress" value="0" max="100" style="width: 100%;"></progress>
        <h2 class="title-lecture">{infoData.exercise.question}</h2>
        <p class="p-lecture">{infoData.exercise.content}</p>
      </div>
    </div>

  {/if}
</div>

<style>
progress {
  appearance: none;       /* Quita el estilo nativo */
  -webkit-appearance: none;
  width: 100%;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

/* Fondo de la barra (el contenedor) */
progress::-webkit-progress-bar {
  background-color: #ffffff; /* Blanco */
}

/* Color de la barra de carga (Relleno) */
progress::-webkit-progress-value {
  background-color: #007bff; /* Azul */
  transition: width 0.1s ease; /* Suaviza el movimiento */
}

/* Compatibilidad para Firefox */
progress::-moz-progress-bar {
  background-color: #007bff; /* Azul */
}

.progresbar {
  position: absolute;
  top: -3px;
  background: aqua;
  width: 100%;
  left: 0;
  height: 9px;
}
.rf {
  width: 100%;
  height: 100%;
  position: relative;
}
.center-exercise {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  top: 0;
  position: absolute;
}
.title-lecture {
  font-family: var(--font-normal);
  font-size: 1.2em;
  padding-bottom: 1em;
  line-height: 28px;
}
.wrapper-lecture {
  width: 100%;
  max-width: 500px;
  border: 2px solid var(--bg-header-synt);
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: var(--border-radius);
  overflow-y: auto;
  height: calc(100% - calc(var(--height-header) + -60px));
  top: 0;
  position: absolute;
}
.p-lecture {
  font-family: var(--font-normal);
  line-height: 34px;
  font-size: 1em;
}
.box-info-lecture {
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  padding-bottom: 2em;
}
.label-h2 {
  font-family: var(--font-normal);
  font-weight: 800;
}
.wr-img-lecture {
  width: 200px;
  height: 200px;
}
.wr-img-lecture > img {
  width: 100%;
  height: 100%;
}
.btn-start-lecture {
  font-family: var(--font-normal);
  padding: 0.6em 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-size: 1em;
  background: var(--bg-blue);
  color: #fff;
  transition: var(--transition);
}
.btn-start-lecture:hover {
  background: var(--bg-blue-hover);
}
</style>
