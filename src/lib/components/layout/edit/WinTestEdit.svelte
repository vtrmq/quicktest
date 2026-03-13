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
let body = document.documentElement as HTMLElement;
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
  body.style.height = '100vh'
}

function handleCloseWin(e:KeyboardEvent) {
  if (isDisplay && e.key === 'Escape') {
    isDisplay = !isDisplay;
    body.style.overflowY = 'scroll'
    body.style.height = ''
  }
}
function handleCloseEventWin() {
  if (isDisplay) {
    isDisplay = !isDisplay;
    body.style.overflowY = 'scroll'
    body.style.height = ''
  }
}
onMount(()=>{
  body = document.getElementsByTagName('body')[0]
});
onDestroy(()=>{
  body.style.overflowY = 'scroll'
  body.style.height = ''
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
  <div class="container-win-test-wt" transition:fade={{ duration: 200 }}>
    <div class="container-test-wt">
      <div class="header-test-wt">
        <h1 class="t-title-wt">Editar test</h1>
        <div class="btns-tp-wt">
          <button class="btn-new-point-test-edit-wt" onclick={()=>handleNewQuestion()}>{@html filePlus}</button>
          <button class="btn-close-win-test-edit-wt" onclick={()=>handleCloseEventWin()}>{@html circleX}</button>
        </div>
      </div>

      <div class="container-body-test-wt" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0" bind:this={bodyTest}>
        <div class="body-test-wt">
          {#if !isEdit}

            {#each questionsAll as question, inx}
              <!-- Variable que tiene todas la preguntas del video -->
              <div class="num-test-wt">Test {inx + 1}</div>
              <div class="row-time-wt">
                <Input type="text" name="time_pause" label="Tiempo de la pausa" bind:value={question.time_pause} />
                <button onclick={()=>handleInsertQuestion(inx)} class="btn-insert-wt">{@html receiptText}</button>
                <button class="btn-delete-wt" onclick={()=>handleActionShowWinTest(inx, "test")}>{@html trash}</button>
              </div>

              <div class="container-items-answer-wt">
                {#each question.points as qs, point}
                  <div>
                    <div class="wr-point-number-test"><div class="point-number-test">{point + 1}</div></div>
                    <div class="row-question-wt">
                      <p class="question-wt">{qs.question}</p>
                      <div class="wr-opt-select">
                        <OptionSelect>
                          <button onclick={()=>handleEditQuestion(inx, point)}>{@html pencil} <span>Editar</span></button>
                          <button onclick={()=>handleActionShowWinQuestion(inx, point, "question")}>{@html trash} <span>Eliminar</span></button>
                        </OptionSelect>
                      </div>
                    </div>

                    <div class="wr-points-wt">
                      {#each qs.points as rs, index}
                        <div class="container-answer-wt" onclick={()=>handleSelectItem(inx, point, index)} onkeyup={()=>{}} role="button" tabindex="0" class:rst-point-wt={rs.rst}>
                          <div class="wr-label-point-wt"><div class="label-resp-wt" class:rst-point-wt={rs.rst}>Respuesta {index + 1}</div></div>
                          <div class="wr-input-item-wt">
                            <div class="answer-item-wt">{rs.answer}</div>
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
              <h1 class="label-response-wt">Respuestas</h1>

              <div class="container-items-answer-wt">

                {#each questionTest.points as answer, index}
                  <div class="container-answer-wt">

                    <div class="wr-input-item-wt">
                      <textarea class="textarea-item-wt" bind:value={answer.answer}></textarea>
                    </div>

                    <div class="wr-btn-img-item-wt">
                      <button class="btn-remove-item-wt" onclick={()=>handleRemoveItem(index)}>Quitar</button>
                    </div>

                  </div>
                {/each}

                <div class="wr-btns-te-wt">
                  <button class="btn-te-wt ins-p-wt" onclick={()=>handleAddPoint()}>Colocar respuesta</button>
                  {#if stateTest === "new"}
                    <button class="btn-te-wt add-p-wt" onclick={()=>handleAddQuestion()}>Listo</button>
                  {:else if stateTest === "update"}
                    <button class="btn-te-wt add-p-wt" onclick={()=>handleUpdateQuestion()}>Actualizar</button>
                  {/if}
                  <button class="btn-te-wt cancel-p-wt" onclick={()=>handleCancelQuestion()}>Cancelar</button>
                </div>
              </div>

            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
