<script lang="ts">
import { activityLocalstore } from '$lib/store/activity';
import { onMount } from 'svelte';
import { colorSynt } from '$lib/utils';

type Side = 'left' | 'right';
type Words = {
  word: string;
};
type SelectedWord = {
  element: HTMLButtonElement; 
  side: Side;
}
type Connection = {
  left: string;
  right: string;
}

let { indexExercise, activity } = $props();
let leftWords: Words[] = $state([]);
let rightWords: Words[] = $state([]);
let containerMatch = $state() as HTMLDivElement;
let leftColumn = $state() as HTMLDivElement;
let rightColumn = $state() as HTMLDivElement;
let canvasMatch = $state() as HTMLCanvasElement;
let columnsContainer = $state() as HTMLDivElement;
let wordConnections: Connection[] = $state([]);

let selectedWord: SelectedWord | null = null;
let connections: Connection[] = [];
let IdMatch = '';
let box_match = $state('');
let ctx: CanvasRenderingContext2D | null = null;

$effect(() => {
  leftWords = activity.leftWords;
  rightWords = activity.rightWords;
  wordConnections = activity.wordConnections;
});

let swHeight = false;
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

function connect(leftWord: HTMLButtonElement, rightWord: HTMLButtonElement) {
  const connection = {
    left: leftWord.id,
    right: rightWord.id
  };
  const existingConnection = connections.find((c: Connection) => 
    c.left === connection.left && c.right === connection.right);

  if (existingConnection) {
    connections = connections.filter((c: Connection) => c !== existingConnection);
  } else {
    connections.push(connection);
  }
  saveConnections();
  drawConnections();
}

function drawConnections() {

  canvasMatch.width = columnsContainer.offsetWidth;
  canvasMatch.height = columnsContainer.offsetHeight;

  if (ctx) {
    ctx.clearRect(0, 0, canvasMatch.width, canvasMatch.height);

    connections.forEach((connection: Connection, index: number) => {

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

function saveConnections() {
  wordConnections = connections;
  let arrConnections = JSON.parse(JSON.stringify(connections))
  activityLocalstore.connectionsMatch(indexExercise, arrConnections);
}

function selectWordMatch(wordElement: Event, side: Side, index: number) {
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

function viewConnections() {
  updateCanvasSize();
  ctx = canvasMatch.getContext('2d');
  connections = activity.wordConnections;
  drawConnections();
  window.addEventListener('resize', updateCanvasSize);
}

onMount(()=>{
  viewConnections();
});

</script>

<div class="body-exercise-match" bind:this={containerMatch}>
  <div class="mg-center">
    <div class="pd1">
      <h1 class="question-match">{activity.question}</h1>
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
