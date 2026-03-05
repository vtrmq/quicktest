<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import { fade } from 'svelte/transition';
import trash from '$lib/assets/svg/trash.svg?raw';
import receiptText from '$lib/assets/svg/receipt-text.svg?raw';
import circleX from '$lib/assets/svg/circle-x.svg?raw';
import filePlus from '$lib/assets/svg/file-plus.svg?raw';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import { TextArea, Input, Dialog, OptionSelect } from "$lib/components"

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
let bodyTest = $state() as HTMLDivElement;
let dialog = $state<Dialog | null>(null);

// Datos de cada test del video
let points: Point[] = $state([]);
let questionTest: Point = $state({ question: '', image: '', points: [] })
let questionsAll: Question[] = $state(questions);
let stateTest = $state("new");
let indexTest = -1;
let indexQuestion = -1;
let questionTestCopy: Point = $state({ question: '', image: '', points: [] })
let optionDelete = '';
let posTestDelete = -1;
let posQuestionDelete = -1;

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

async function handleNewQuestion() {
  questionsAll.push({points: [], time_pause: ''});
  await tick();
  bodyTest.scrollTo({
    top: bodyTest.scrollHeight,
    behavior: 'smooth'
  });
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
  questionsAll[posQuestion].points.push(...points);
  questionTest = { question: '', image: '', points: [] };
  points = [];
  // AQUI ENVIAR questions AL COMPONENTE Video.svelte
  handleSend(JSON.stringify(questionsAll))
}

function handleSelectItem(pos:number, point: number, index: number) {
  questionsAll[pos].points[point].points[index].rst = !questionsAll[pos].points[point].points[index].rst;
  handleSend(JSON.stringify(questionsAll))
}

let posQuestion = -1;
function handleInsertQuestion(inx: number) {
  posQuestion = inx;
  questionTest = { question: '', image: '', points: [] };
  points = [];
  isEdit = !isEdit;
  stateTest = "new";
}

function handleCancelQuestion() {
  if (stateTest === "update") {
    questionsAll[indexTest].points[indexQuestion] = questionTestCopy;
  }
  isEdit = !isEdit;
  questionTest = { question: '', image: '', points: [] };
  questionTestCopy = { question: '', image: '', points: [] };
  points = [];
  stateTest = "new";
}

function handleActionDelete(e: string) {
  if (e === 'accept' && optionDelete === "test") {
    questionsAll = questionsAll.filter((_: any, i: number) => i !== posTestDelete);
    posQuestionDelete = -1;
    handleSend(JSON.stringify(questionsAll))
  } else if (e === 'accept' && optionDelete === "question") {
    const points = JSON.parse(JSON.stringify(questionsAll[posTestDelete].points));
    const _points = points.filter((_: any, i: number) => i !== posQuestionDelete);
    questionsAll[posTestDelete].points = _points;
    handleSend(JSON.stringify(questionsAll))
  }
}

function handleActionShowWinTest(indexTest: number, option: string) {
  posTestDelete = indexTest;
  optionDelete = option;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar el test #${indexTest + 1}?`,
  });
}

function handleActionShowWinQuestion(indexTest: number, indexQuestion: number, option: string) {
  posTestDelete = indexTest;
  posQuestionDelete = indexQuestion;
  optionDelete = option;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar la pregunta #${indexQuestion + 1}?`,
  });
}

function handleEditQuestion(_indexTest: number, _indexQuestion: number) {
  indexTest = _indexTest;
  indexQuestion = _indexQuestion;
  stateTest = "update";
  questionTest = questionsAll[indexTest].points[indexQuestion]
  questionTestCopy = JSON.parse(JSON.stringify(questionTest));
  isEdit = !isEdit;
}

function handleUpdateQuestion() {
  questionsAll[indexTest].points[indexQuestion] = questionTest;
  questionTest = { question: '', image: '', points: [] };
  isEdit = !isEdit;
}

</script>

<Dialog bind:this={dialog} action={handleActionDelete} />
<svelte:window onkeydown={handleCloseWin} />

{#if isDisplay}
  <div class="container-win-test" transition:fade={{ duration: 200 }}>
    <div class="container-test">
      <div class="header-test">
        <h1 class="t-title">Editar test</h1>
        <div class="btns-tp">
          <button class="btn-new-point-test-edit" onclick={()=>handleNewQuestion()}>{@html filePlus}</button>
          <button class="btn-close-win-test-edit" onclick={()=>handleCloseEventWin()}>{@html circleX}</button>
        </div>
      </div>
      <div class="container-body-test" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0" bind:this={bodyTest}>
        <div class="body-test">
          {#if !isEdit}

            {#each questionsAll as question, inx}
              <!-- Variable que tiene todas la preguntas del video -->
              <div class="num-test">Test {inx + 1}</div>
              <div class="row-time">
                <Input type="text" name="time_pause" label="Tiempo de la pausa" bind:value={question.time_pause} />
                <button onclick={()=>handleInsertQuestion(inx)} class="btn-insert">{@html receiptText}</button>
                <button class="btn-delete" onclick={()=>handleActionShowWinTest(inx, "test")}>{@html trash}</button>
              </div>

              <div class="container-items-answer">
                {#each question.points as qs, point}
                  <div>
                    <div class="wr-point-number-test"><div class="point-number-test">{point + 1}</div></div>
                    <div class="row-question">
                      <p class="question">{qs.question}</p>
                      <div class="wr-opt-select">
                        <OptionSelect>
                          <button onclick={()=>handleEditQuestion(inx, point)}>{@html pencil} <span>Editar</span></button>
                          <button onclick={()=>handleActionShowWinQuestion(inx, point, "question")}>{@html trash} <span>Eliminar</span></button>
                        </OptionSelect>
                      </div>
                    </div>

                    <div class="wr-points">
                      {#each qs.points as rs, index}
                        <div class="container-answer" onclick={()=>handleSelectItem(inx, point, index)} onkeyup={()=>{}} role="button" tabindex="0" class:rst-point={rs.rst}>
                          <div class="wr-label-point"><div class="label-resp" class:rst-point={rs.rst}>Respuesta {index + 1}</div></div>
                          <div class="wr-input-item">
                            <div class="answer-item">{rs.answer}</div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
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

                <div class="wr-btns-te">
                  <button class="btn-te ins-p" onclick={()=>handleAddPoint()}>Colocar punto</button>
                  {#if stateTest === "new"}
                    <button class="btn-te add-p" onclick={()=>handleAddQuestion()}>Adicionar</button>
                  {:else if stateTest === "update"}
                    <button class="btn-te add-p" onclick={()=>handleUpdateQuestion()}>Actualizar</button>
                  {/if}
                  <button class="btn-te cancel-p" onclick={()=>handleCancelQuestion()}>Cancelar</button>
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
.ins-p {
  background: #89d989;
  transition: var(--transition);
}
.ins-p:hover {
  background: #73d573;
}
.add-p {
  background: #ffca68;
  transition: var(--transition);
}
.add-p:hover {
  background: #ebb551;
}
.cancel-p {
  background: #fdaeae;
  transition: var(--transition);
}
.cancel-p:hover {
  background: #f38f8f;
}
.wr-btns-te {
  display: flex;
  justify-content: center;
  gap: 1em;
  border-top: 1px solid #cdcdcd;
  border-bottom: 1px solid #cdcdcd;
  padding: 0.8em;
}
.btn-te {
  padding: 0.8em 1em;
  font-family: var(--font-normal);
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
}
.t-title {
  font-family: var(--font-bold);
  font-size: 1.4em;
}
.num-test {
  font-family: var(--font-normal);
  font-weight: 500;
  margin-bottom: 0.5em;
}
.wr-points {
  display: flex;
  flex-direction: column;
  gap: 3em;
  margin-top: 2em;
}
.btn-insert {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  cursor: pointer;
}
:global {
  .btn-insert > svg {
    width: 20px;
    color: #0268b9;
  }
}
.btn-delete {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  cursor: pointer;
}
.row-question {
  display: flex;
  gap: 2em;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 1em 0 2em;
}
.row-time {
  display: flex;
  gap: 2em;
  align-items: center;
  border-top: 4px solid #2196F3;
  padding-top: 2em;
}
.question {
  font-family: var(--font-normal);
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
.btn-new-point-test-edit {
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
.btn-new-point-test-edit:hover {
  background: #d1f1ab;
}
:global {
  .btn-new-point-test-edit > svg {
    width: 27px;
    color: #00a707;
  }
}
.btn-close-win-test-edit {
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
.btn-close-win-test-edit:hover {
  background: #f7dada;
}
:global {
  .btn-close-win-test-edit > svg {
    width: 30px;
    color: #ff3d00;
  }
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
