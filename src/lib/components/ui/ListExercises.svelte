<script lang="ts">
import { page } from '$app/state';
import { typeExerc, scaleNota, formatearNota, filtrarParametros } from "$lib/utils"
import { activityLocalstore } from '$lib/store/activity_student';
let { info, items, handleActivity, handleViewResult, handleSendActivity = ()=>{}, isSend = false, handlePropag = ()=>{} } = $props();
import menu from '$lib/assets/svg/menu.svg?raw';
import circleX from '$lib/assets/svg/circle-x.svg?raw';

type NotaFinal = {
  nota: string;
  percentage: number;
  scale: string;
}

let viewBox = $state(false); // false
let itemResaltado = $state(-1);
let scales = info.scales;
let viewResult = $state(1);
let notaFinal: NotaFinal = $state({nota: '', percentage: 0, scale: ''}) as NotaFinal;
let viewResultNota = $state(false);

type Activity = {
  exercise: {points: [{position: any}]};
  mode: string;
  time: number;
  type: string;
  typeExercise: string;
  value: number;
  visible: boolean;
  position: any;
}

function handleViewBoxExercise() {
  viewBox = !viewBox;
  handlePropag(viewBox);
}

function handleSelectActivity(index: number) {
  //viewResult = 0;
  itemResaltado = index;
  viewBox = !viewBox;
  const _items = activityLocalstore.get();
  const viewResult = viewResultNota ? 1 : 2;
  handleActivity(index, _items, viewResult, viewBox);
}

export function handleViewResultX() {

  //viewResult = option === 'result' ? 1 : 2;
  viewResultNota = !viewResultNota;
  items = activityLocalstore.get();
  let values = 0;
  let max = items.length;
  for (let i = 0; i < max; i++) {
    values = values + items[i].value;
  }
  let notaTotal = values / max;
  notaFinal = scaleNota(scales, parseFloat(formatearNota(notaTotal)))
  const _minNota = scales.reduce((min: {min_value: number} , obj: {min_value: number}) => obj.min_value < min.min_value ? obj : min);

  if (parseFloat(notaFinal.nota) < parseFloat(_minNota.min_value)) {
    notaFinal.nota = _minNota.min_value;
    notaFinal.scale = _minNota.scale;
  }
  
  const viewResult = viewResultNota ? 1 : 2;
  handleViewResult(viewResult);
}

function handleViewResultTest() {
  viewResult = viewResult === 1 ? 4 : 1;
}

function sortById<T extends { position: number }>(array: T[]): T[] {
  // Usamos [...array] para no mutar el array original
  return [...array].sort((a, b) => a.position - b.position);
}

function handleSendTestPrev() {
  viewResult = 3;
  viewResultNota = false;
  handleViewResult(2);
}

function handleSendTest() {
  const _items = activityLocalstore.get();
  const itemsOrder: Activity[] = sortById(_items)
  //console.log(itemsOrder)

  for (let i = 0; i < itemsOrder.length; i++) {
    delete itemsOrder[i].position
    if (itemsOrder[i].type === "test" || itemsOrder[i].type === "test-fs") {
      const items: any = sortById(itemsOrder[i].exercise.points);
      for (let j = 0; j < items.length; j++) {
        delete items[j].position;
      }
      itemsOrder[i].exercise.points = items;
    }
  }

  let values = 0;
  let _max = itemsOrder.length;
  for (let i = 0; i < _max; i++) {
    values = values + itemsOrder[i].value;
  }

  let notaTotal = values / _max;
  notaFinal = scaleNota(scales, parseFloat(formatearNota(notaTotal)))
  //console.log($state.snapshot(notaFinal))

  const minNota = scales.reduce((min: {min_value: number} , obj: {min_value: number}) => obj.min_value < min.min_value ? obj : min);
  //const maxNota = scales.reduce((max: {max_value: number} , obj: {max_value: number}) => obj.max_value > max.max_value ? obj : max);

  if (parseFloat(notaFinal.nota) < parseFloat(minNota.min_value)) {
    const _notaFinal = scaleNota(scales, minNota.min_value);
    notaFinal.nota = _notaFinal.nota;
    notaFinal.scale = _notaFinal.scale;
    notaFinal.percentage = _notaFinal.percentage;
  }

  const result = {
    nota: parseFloat(notaFinal.nota),
    performance: notaFinal.scale,
    percentage: notaFinal.percentage,
    answer: itemsOrder,
    courseId: info.courseId,
    subjectId: info.subjectId,
    topicId: info.topicId,
    activityId: info.activityId,
    teacherId: info.teacherId,
  };
  //console.log(result)
  const search = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId', 'topicId']);
  const url = `/student/subject/topic/activity?${search}`;
  handleSendActivity(result, url);
}

</script>

<button class="btn-view-close-exerc" onclick={handleViewBoxExercise}>{@html menu}</button>

<div class="container-edit-exercise" class:view-box-exerc={viewBox}>
  <div class="header-box-exercise">
    <div class="in-header-exerc">
      {#if info.activity.type_general === 'R'}

        {#if viewResult === 2}

          <div class="wr-btns-resul-save-exerc">
            <button class="btn-result-exerc" onclick={()=>handleViewResultX()}>Resultados</button>
          </div>

        {:else if viewResult === 1}

          <div class="wr-btns-resul-save-exerc">
            <button class="btn-result-exerc" onclick={()=>handleViewResultX()}>
              {#if viewResultNota}
                Continuar
              {:else}
                Resultados
              {/if}
            </button>
            <button class="btn-save-test-exerc" onclick={handleSendTestPrev} disabled={isSend}>
              Enviar
            </button>
            {#if viewResultNota}
              <div class="info-nota-exerc">
                {formatearNota(parseFloat(notaFinal.nota))} {notaFinal.scale}
              </div>
            {/if}
          </div>
        {/if}

      {:else if info.activity.type_general === 'V'}

        <button class="btn-save-exerc" onclick={handleViewResultTest}>
          {#if viewResult === 1}
            Enviar
          {:else if viewResult === 4}
            Cancelar
          {/if}
        </button>

      {/if}
    </div>
    <button class="btn-view-close-exerc" onclick={handleViewBoxExercise}>{@html circleX}</button>
  </div>

  <div class="body-box-exercise">

    <div class="container-info-exerc">
      <h1 class="topic-exerc">{info.topic}</h1>
      <h2 class="activity-exerc">{info.activity.activity}</h2>
    </div>
    <div class="row-items-exerc">
      {#if viewResult === 1}
        {#each items as item, index}
          <div class="row-link-activity-exerc" class:resaltar-exerc={itemResaltado === index}>
            <button class="link-activity-exerc" onclick={()=>handleSelectActivity(index)}>
              <div class="box-item-link-exerc">{index + 1}</div>
              <div class="container-info-exerc">
                <div class="wr-info-result-exerc">
                  <span class="label-activity-exercise" class:resaltar-exerc={itemResaltado === index}>{typeExerc(item.type)}</span>
                  {#if viewResultNota}
                    <span class="item-value-exerc">{formatearNota(item.value)} {scaleNota(scales, parseFloat(formatearNota(item.value))).scale}</span>
                  {/if}
                </div>
                {#if item.type === 'morphosyntax' ||  item.type === 'test-pdf' || item.type === 'test-fs'}
                  <div class="text-left-exerc">{item.exercise.content}</div>
                {:else}
                  <div class="text-left-exerc">{item.exercise.question}</div>
                {/if}
              </div>
            </button>
          </div>
        {/each}
      {:else if viewResult === 3}
        <div class="wr-info-send">
          <p class="txt-info-exerc center">¿Quieres enviar la actividad?</p>
          <div class="wr-btns-send-cancel">
            <button class="btn-save-test-exerc w150" onclick={handleSendTest}>
              {#if !isSend}
                Enviar actividad
              {:else}
                <svg class="svg-load-exerc" stroke-width="2" viewBox="0 0 24 24" fill="none"><path d="M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              {/if}
            </button>
            <button class="btn-cancel-send" onclick={()=>viewResult = 1}>Cancelar</button>
          </div>
        </div>
      {:else if viewResult === 4}
        <div class="wr-info-send">
          <p class="txt-info-exerc center">¿Quieres enviar el test?</p>
          <div class="wr-btns-send-cancel">
            <button class="btn-save-test-exerc w150" onclick={handleSendTest}>
              {#if !isSend}
                Enviar test
              {:else}
                <svg class="svg-load-exerc" stroke-width="2" viewBox="0 0 24 24" fill="none"><path d="M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              {/if}
            </button>
            <button class="btn-cancel-send" onclick={()=>viewResult = 1}>Cancelar</button>
          </div>
        </div>
      {/if}
    </div>

  </div>
</div>

<style>
:global {
  .btn-view-close-exerc > svg {
    width: 18px;
    color: #fff;
    stroke-width: 3px;
  }
}
.wr-info-send {
  background: #a3edee;
  padding: 2em;
  border-radius: 13px;
  box-shadow: rgb(77 156 193) 0px 7px 0px 0px;
}
.wr-btns-send-cancel {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-top: 1em;
}
.btn-view-close-exerc {
  width: 36px;
  height: 35px;
  cursor: pointer;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  background: #d98507;
}
</style>
