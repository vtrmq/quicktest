<script lang="ts">
import { fade } from 'svelte/transition';

type Answer = {
  answer: string;
  rss: boolean;
  rst: boolean;
};
type Point = {
  question: string;
  image: string;
  points: Answer[];
};

let points: Point[] = $state([]);
let isDisplay = $state(false);
let isWin = $state(false);
let { handleStartVideo } = $props();

export function show(_points: Point[]) {
  points = _points;
  isDisplay = !isDisplay;
  const body = document.getElementsByTagName('body')[0]
  body.style.overflowY = 'hidden'
  body.style.height = '100vh'
}

let finished = $state(false);
let countErrors = $state(0);

function handleSelectItem(pos:number, point: number) {
  points[pos].points[point].rss = !points[pos].points[point].rss;
  countErrors = 0;
  let countFinished = 0;
  for (let i = 0; i < points.length; i++) {
    let finishedQuestion = false;
    for (let j = 0; j < points[i].points.length; j++) {
      if (points[i].points[j].rss === true && finishedQuestion === false) {
        finishedQuestion = true;
        countFinished = countFinished + 1;
      }
      if (points[i].points[j].rst === false && points[i].points[j].rss === true) {
        countErrors = countErrors + 1;
        break;
      }
    }
  }
  if (countErrors !== 0 && countFinished === points.length) {
    finished = false;
    isWin = true;
  } else if (countErrors === 0 && countFinished === points.length) {
    finished = true;
    isWin = true;
  }
}

function handleClose() {
  isWin = false;
}

function handleContinue() {
  isWin = false;
  isDisplay = !isDisplay;
  const body = document.getElementsByTagName('body')[0]
  body.style.overflowY = 'auto'
  handleStartVideo();
}

</script>

{#if isWin}
  <div class="container-win-msg" transition:fade={{ duration: 200 }}>
    <div class="win-body">
      {#if finished && countErrors === 0}
        <div class="wr-svg"><span>🎉</span></div>
        <div class="msg">Felicidades!!</div>
        <div class="wr-btn-close"><button class="btn-close" onclick={handleContinue}>Continuar</button></div>
      {:else}
        <div class="wr-svg"><span>☹️</span></div>
        {#if points.length === 1}
          <div class="msg">Test incorrecto</div>
        {:else}
          <div class="msg">Tienes {countErrors === 1 ? "un punto incorrecto" : `${countErrors} puntos incorrectos`}</div>
        {/if}
        <div class="wr-btn-close"><button class="btn-close" onclick={handleClose}>Inténtalo nuevamente</button></div>
      {/if}
    </div>
  </div>
{/if}

{#if isDisplay}
  <div class="container-win-test-wt" transition:fade={{ duration: 200 }}>
    <div class="container-test-wt">


      <div class="container-body-test-wt-ts">
        <div class="body-test-wt">

            {#each points as pt, inx}
              <!-- Variable que tiene todas la preguntas del video -->

              <div class="container-items-answer-wt">
                  <div>
                    <div class="wr-point-number-test"><div class="point-number-test">{inx + 1}</div></div>
                    <div class="row-question-wt">
                      <p class="question-wt">{pt.question}</p>
                      <div class="wr-opt-select">
                      </div>
                    </div>

                    <div class="wr-points-wt">
                      {#each pt.points as rs, index}
                        <div class="container-answer-wt" onclick={()=>handleSelectItem(inx, index)} onkeyup={()=>{}} role="button" tabindex="0" class:rst-point-wt={rs.rss}>
                          <div class="wr-label-point-wt"><div class="label-resp-wt" class:rst-point-wt={rs.rss}>Respuesta {index + 1}</div></div>
                          <div class="wr-input-item-wt">
                            <div class="answer-item-wt">{rs.answer}</div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
              </div>
            {/each}

          </div>
        </div>


    </div>
  </div>
{/if}

<style>
.wr-svg {
  display: flex;
  justify-content: center;
}
.wr-svg > span {
  font-size: 70px;
}
:global {
  .wr-svg > svg {
    width: 80px;
    color: #d73a09;
  }
}
.msg {
  text-align: center;
  font-family: var(--font-normal);
  font-size: 1.5em;
  font-weight: 600;
}
.wr-btn-close {
  display: flex;
  justify-content: center;
}
.btn-close {
  padding: 0.5em 2em;
  border-radius: 6px;
  font-family: var(--font-normal);
  font-size: 1em;
  cursor: pointer;
  background: #ffd1d1;
  transition: var(--transition);
  font-weight: 500;
}
.btn-close:hover {
  background: #f7bbbb;
}
.container-win-msg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00000057;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.win-body {
  background: #fff;
  padding: 2em 1em;
  border-radius: 6px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 2em;
  box-shadow: rgb(23 23 24 / 97%) 0px 7px 29px 0px;
}
.container-body-test-wt-ts {
  height: 100%;
  overflow-y: auto;
}
.container-body-test-wt-ts {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
.container-body-test-wt-ts::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.container-body-test-wt-ts::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.container-body-test-wt-ts::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}
.container-body-test-wt-ts::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
