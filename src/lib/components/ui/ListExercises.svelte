<script lang="ts">
import { typeExerc, scaleNota, formatearNota } from "$lib/utils"
import { activityLocalstore } from '$lib/store/activity_student';
let { info, items, handleActivity, handleViewResult } = $props();
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
let viewResult = $state(0);
let notaFinal: NotaFinal = $state({nota: '', percentage: 0, scale: ''}) as NotaFinal;

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
}

function handleSelectActivity(index: number) {
  viewResult = 0;
  itemResaltado = index;
  viewBox = !viewBox;
  const _items = activityLocalstore.get();
  handleActivity(index, _items, viewResult);
}

function handleViewResultX(option: string) {
  viewResult = option === 'result' ? 1 : 0;
  items = activityLocalstore.get();
  let values = 0;
  let max = items.length;
  for (let i = 0; i < max; i++) {
    values = values + items[i].value;
  }
  let notaTotal = values / max;

  notaFinal = scaleNota(scales, notaTotal)

  const _minNota = scales.reduce((min: {min_value: number} , obj: {min_value: number}) => obj.min_value < min.min_value ? obj : min);

  if (parseFloat(notaFinal.nota) < parseFloat(_minNota.min_value)) {
    notaFinal.nota = _minNota.min_value;
    notaFinal.scale = _minNota.scale;
    //notaFinal.percentage =  parseFloat( (_minNota.min_value * 10).toFixed(0) );
  }

  handleViewResult(viewResult);
}

function handleViewResultTest() {
  viewResult = viewResult === 0 ? 2 : 0;
}

function sortById<T extends { position: number }>(array: T[]): T[] {
  // Usamos [...array] para no mutar el array original
  return [...array].sort((a, b) => a.position - b.position);
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
  notaFinal = scaleNota(scales, notaTotal)
  //console.log($state.snapshot(notaFinal))

  const minNota = scales.reduce((min: {min_value: number} , obj: {min_value: number}) => obj.min_value < min.min_value ? obj : min);
  //const maxNota = scales.reduce((max: {max_value: number} , obj: {max_value: number}) => obj.max_value > max.max_value ? obj : max);

  if (parseFloat(notaFinal.nota) < parseFloat(minNota.min_value)) {
    const _notaFinal = scaleNota(scales, minNota.min_value);
    notaFinal.nota = _notaFinal.nota;
    notaFinal.scale = _notaFinal.scale;
    notaFinal.percentage = _notaFinal.percentage;
  }

  const info = {
    nota: parseFloat(notaFinal.nota),
    scale: notaFinal.scale,
    percentage: notaFinal.percentage,
    items: itemsOrder
  };
  console.log($state.snapshot(info))
}

</script>

<button class="btn-view-close" onclick={handleViewBoxExercise}>{@html menu}</button>
<div class="container-edit-exercise" class:view-box={viewBox}>
  <div class="header-box-exercise">
    <div class="in-header">
      {#if info.activity.type_general === 'R'}
        {#if viewResult === 0}
          <div class="wr-btns-resul-save">
            <button class="btn-result" onclick={()=>handleViewResultX('result')}>Resultados</button>
            <!--button class="btn-save" onclick={()=>handleViewResultX('result')}>Guardar</button-->
          </div>
        {:else}
          <div class="wr-btns-resul-save">
            <button class="btn-result" onclick={()=>handleViewResultX('activities')}>Continuar</button>
            <button class="btn-save-test" onclick={handleSendTest}>Enviar</button>
            <div class="info-nota">
              {formatearNota(parseFloat(notaFinal.nota))} {notaFinal.scale}
            </div>
          </div>
        {/if}
      {:else if info.activity.type_general === 'V'}
        <button class="btn-save" onclick={handleViewResultTest}>
          {#if viewResult === 0}
            Enviar
          {:else if viewResult === 2}
            Cancelar
          {/if}
        </button>
      {/if}
    </div>
    <button class="btn-view-close" onclick={handleViewBoxExercise}>{@html circleX}</button>
  </div>

  <div class="body-box-exercise">

    <div class="container-info">
      <h1 class="topic">{info.topic}</h1>
      <h2 class="activity">{info.activity.activity}</h2>
    </div>
    <div class="row-items">
      {#if viewResult === 0 || viewResult === 1}
        {#each items as item, index}
          <div class="row-link-activity" class:resaltar={itemResaltado === index}>
            <button class="link-activity" onclick={()=>handleSelectActivity(index)}>
              <div class="box-item-link">{index + 1}</div>
              <div class="container-info-exerc">
                <div class="wr-info-result">
                  <span class="label-activity-exercise" class:resaltar={itemResaltado === index}>{typeExerc(item.type)}</span>
                  {#if viewResult === 1}
                    <span class="item-value">Nota: {formatearNota(item.value)} {scaleNota(scales, item.value).scale}</span>
                  {/if}
                </div>
                {#if item.type === 'morphosyntax' ||  item.type === 'test-pdf' || item.type === 'test-fs'}
                  <div class="text-left">{item.exercise.content}</div>
                {:else}
                  <div class="text-left">{item.exercise.question}</div>
                {/if}
              </div>
            </button>
          </div>
        {/each}
      {:else if viewResult === 2}
        <p class="txt-info">¿Quieres enviar el test?</p>
        <button class="btn-save-test" onclick={handleSendTest}>Enviar test</button>
      {/if}
    </div>

  </div>
</div>

<style>
:global {
  .btn-view-close > svg {
    width: 18px;
    color: #fff;
    stroke-width: 3px;
  }
}
.txt-info {
  font-family: var(--font-normal);
  font-size: 1em;
}
.info-nota {
  font-family: var(--font-normal);
  font-size: 1em;
  font-weight: 800;
  color: #fff;
}
.btn-save {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-family: var(--font-normal);
  font-size: 1em;
  background: #03ad03;
  color: #fff;
  height: 100%;
}
.btn-save-test {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7em 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-family: var(--font-normal);
  font-size: 1em;
  background: var(--bg-blue);
  color: #fff;
  height: 100%;
  transition: var(--transition);
}
.btn-save-test:hover {
  background: var(--bg-blue-hover);
}
.wr-btns-resul-save {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.item-value {
  font-weight: 800;
  color: #393939;
}
.wr-info-result {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.in-header {
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 35px;
  gap: 1em;
}
.btn-result {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-family: var(--font-normal);
  font-size: 1em;
  background: #7b68ee;
  color: #fff;
  height: 100%;
}
.container-info-exerc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.text-left {
  text-align: left;
  font-size: 1.05em;
}
.label-activity-exercise {
  font-family: var(--font-normal);
  font-size: 1.3em;
  font-weight: 700;
}
.label-activity-exercise.resaltar {
  font-weight: 900;
  font-style: italic;
  font-size: 1.5em;
}
.box-item-link {
  height: 90px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #94ebe8;
  font-family: var(--font-normal);
  font-weight: 900;
  font-size: 2em;
}
.link-activity {
  display: grid;
  grid-template-columns: 50px 1fr;
  font-family: var(--font-normal);
  cursor: pointer;
  border-radius: 6px;
  align-items: center;
  gap: 1em;
  overflow: hidden;
  width: 100%;
  background: transparent;
}
.row-link-activity {
  display: flex;
  width: 100%;
  background: #e1f1f9;
  align-items: center;
  padding-right: 0.3em;
  /*box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;*/
  border-radius: 6px;
  transition: var(--transition);
}
.row-link-activity:hover {
  background: #cee8f5;
}
.row-link-activity.resaltar {
  background: #56d3ce;
}
.row-items {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.container-info {
  padding: 0 0 1em;
}
.topic {
  font-size: 1.4em;
  font-family: var(--font-bold);
  margin-bottom: 0.3em;
}
.activity {
  font-family: var(--font-normal);
  font-size: 1em;
  font-weight: 500;
}
.body-box-exercise {
  background: #fff;
  height: calc(100% - var(--height-header));
  overflow-y: auto;
  padding: 1em 1em 2em;
  display: flex;
  flex-direction: column;
}
.header-box-exercise {
  height: var(--height-header);
  width: 100%;
  background: #ff9800;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5em 0 1em;
}
.btn-view-close {
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
.container-edit-exercise {
  width: 100%;
  max-width: 500px;
  height: 100%;
  background: azure;
  position: fixed;
  top: 0;
  right: -530px;
  transition: 0.4s;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.container-edit-exercise.view-box {
  right: 0;
}
</style>
