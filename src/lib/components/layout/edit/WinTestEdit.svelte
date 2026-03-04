<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { TextArea, Input } from "$lib/components"

type Answer = {
  answer: string;
  rss: boolean;
  rst: boolean;
};
type Point = {
  question: string;
  image: string;
  points: Answer[]
};
type Question = {
  points: Point[];
  time_pause: string;
};

let { questions, handleSend } : {questions: Question[], handleSend: (e: any)=>void} = $props();
let body: any;
let isDisplay = $state(false);
let isEdit = $state(false);

// Datos de cada test del video
let points: Point[] = $state([]);
let questionTest: Point = $state({ question: '', image: '', points: [] })

export function show() {
  isDisplay = !isDisplay;
  const body = document.getElementsByTagName('body')[0]
  body.style.overflowY = 'hidden'
}

function handleCloseWin(e:KeyboardEvent) {
  if (isDisplay && e.key === 'Escape') {
    isDisplay = !isDisplay;
    body.style.overflowY = 'scroll'
  }
}
function handleCloseEventWin() {
  if (isDisplay) {
    isDisplay = !isDisplay;
    body.style.overflowY = 'scroll'
  }
}
onMount(()=>{
  body = document.getElementsByTagName('body')[0]
});
onDestroy(()=>{
  body.style.overflowY = 'scroll'
});

function handleNewQuestion() {
  questions.push({points: [], time_pause: ''});
}

function handleRemoveItem(index: number) {
  questionTest.points.splice(index, 1);
}

function handleAddPoint() {
  questionTest.points.push({answer: '', rss: false, rst: false});
}

function handleAddQuestion() {
  points.push(questionTest);
  isEdit = !isEdit;
  questions[posQuestion].points.push(...points);
  questionTest = { question: '', image: '', points: [] };
  points = [];
  // AQUI ENVIAR questions AL COMPONENTE Video.svelte
  handleSend(JSON.stringify(questions))
}

function handleSelectItem(pos:number, point: number, index: number) {
  console.log($state.snapshot(questions))
  console.log(pos, point, index)
  //handleSend(questions)
  //arrayQuestionsTest[point].answers[index].rst = !arrayQuestionsTest[point].answers[index].rst;
  handleSend(JSON.stringify(questions))
}

let posQuestion = -1;
function handleInsertQuuestion(inx: number) {
  posQuestion = inx;
  questionTest = { question: '', image: '', points: [] };
  points = [];
  isEdit = !isEdit;
}

function handleCancelQuestion() {
  isEdit = !isEdit;
  questionTest = { question: '', image: '', points: [] };
  points = [];
}

</script>

<svelte:window onkeydown={handleCloseWin} />

{#if isDisplay}
  <div class="container-win-test" transition:fade={{ duration: 200 }}>
    <div class="container-test">
      <div class="header-test">
        <h1>Editar test</h1>
        <div class="btns-tp">
          <button class="btn-new-point" onclick={()=>handleNewQuestion()}>X</button>
          <button class="btn-close" onclick={()=>handleCloseEventWin()}>X</button>
        </div>
      </div>
      <div class="container-body-test" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0">
        <div class="body-test">
          {#if !isEdit}

            {#each questions as question, inx}
              <!-- Variable que tiene todas la preguntas del video -->
              <div class="row-time">
                <Input type="text" name="time_pause" label="Tiempo de la pausa" bind:value={question.time_pause} />
                <button onclick={()=>handleInsertQuuestion(inx)}>A</button>
                <button>B</button>
              </div>

              <div class="container-items-answer">
                {#each question.points as qs, point}
                  <p class="question">{qs.question}</p>

                  {#each qs.points as rs, index}
                    <div class="container-answer" onclick={()=>handleSelectItem(inx, point, index)} onkeyup={()=>{}} role="button" tabindex="0" class:rst-point={rs.rst}>
                      <div class="wr-label-point"><div class="label-resp" class:rst-point={rs.rst}>Respuesta {index + 1}</div></div>
                      <div class="wr-input-item">
                        <div class="answer-item">{rs.answer}</div>
                      </div>
                    </div>
                  {/each}

                {/each}
              </div>
            {/each}

          {:else}
            <div>
              <TextArea name="def" label="Pregunta" bind:value={questionTest.question} --height-text-area="80px" isError={false} />
              <br>
              <h1 class="label-response">Respuestas</h1>

              <div class="container-items-answer">

                {#each questionTest.points as answer, index}
                  <div class="container-answer">

                    <div class="wr-input-item">
                      <textarea class="textarea-item" bind:value={answer.answer}></textarea>
                    </div>

                    <div class="wr-btn-img-item">
                      <button class="btn-remove-item" onclick={()=>handleRemoveItem(index)}>Quitar</button>
                    </div>

                  </div>
                {/each}

                <div>
                  <button onclick={()=>handleAddPoint()}>Colocar punto</button>
                  <button onclick={()=>handleAddQuestion()}>Adicionar pregunta</button>
                  <button onclick={()=>handleCancelQuestion()}>Cancelar</button>
                </div>
              </div>


            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
.row-time {
  display: flex;
  gap: 1em;
  align-items: center;
}
.question {
  font-family: var(--font-normal);
  padding-bottom: 1em;
  line-height: 28px;
  font-size: var(--font-size);
}
.answer-item {
  width: 100%;
  resize: none;
  background: transparent;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
  line-height: 28px;
}
.label-resp {
  background: var(--border-item);
  font-family: var(--font-normal);
  font-size: 0.88em;
  padding: 5px 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  transition: var(--transition);
}
.label-resp.rst-point {
  background: #11d511;
}
.wr-label-point {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  top: -22px;
  left: 0;
}
.btn-remove-item {
  padding: 0.2em 0.5em;
  border-radius: 4px;
  cursor: pointer;
  background: #f1baa9;
  font-family: var(--font-normal);
}
.wr-btn-img-item {
  display: flex;
  justify-content: center;
  gap: 1em;
}
.textarea-item {
  resize: none;
  width: 100%;
  resize: none;
  background: transparent;
  height: 65px;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
  line-height: 23px;
}
.wr-input-item {
  position: relative;
  display: flex;
  align-items: center;
  /*border: 1px solid var(--color-border-input);*/
  border-radius: var(--border-radius);
  padding: 2px 3px 2px 0;
  transition: var(--transition);
  background: #fff;
  border: 1px solid #fff;
}
.wr-input-item:focus-within {
  border: 1px solid #6049eb;
  box-shadow: 0px 0px 0px 4px rgba(119, 112, 255, 0.2);
}
.container-answer {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  background: var(--border-item);
  padding: 8px;
  border-radius: var(--border-radius);
  position: relative;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: rgb(161 178 225) 0px 7px 0px 0px;
}
.container-answer.rst-point {
  background: #11d511;
  box-shadow: rgb(0 167 0) 0px 7px 0px 0px;
}
.label-response {
  font-family: var(--font-normal);
  font-weight: 900;
  font-size: 1em;
}
.container-items-answer {
  margin: 1em 0 5em;
  display: flex;
  flex-direction: column;
  gap: 3em;
}


.btns-tp {
  display: flex;
  gap: 0.6em;
}
.btn-new-point {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #cfebae;
  border-radius: 50px;
  cursor: pointer;
  transition: var(--transition);
}
.btn-new-point:hover {
  background: #b9dd8e;
}
.btn-close {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffe3e3;
  border-radius: 50px;
  cursor: pointer;
  transition: var(--transition);
}
.btn-close:hover {
  background: #f1c6c6;
}
.body-test {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 2em 1em;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  min-height: 100%;
}
.header-test {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e7e7e7;
  height: var(--height-header);
  align-items: center;
  padding: 0 0.5em;
}
.container-body-test {
  height: calc(100% - var(--height-header));
  overflow-y: auto;
}
.container-test {
  background: #fff;
  height: 100%;
  width: 100%;
}
.container-win-test {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-screen);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 160;
}
</style>
