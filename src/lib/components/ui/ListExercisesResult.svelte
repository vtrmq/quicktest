<script lang="ts">
import { typeExerc, scaleNota, formatearNota } from "$lib/utils"
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
let student = info.student;

function handleViewBoxExercise() {
  viewBox = !viewBox;
}

function handleSelectActivity(index: number) {
  viewResult = 0;
  itemResaltado = index;
  viewBox = !viewBox;
  handleActivity(index, items, viewResult);
}

function handleViewResultX(option: string) {
  viewResult = option === 'result' ? 1 : 0;
  handleViewResult(viewResult);
}

(()=>{
  items = JSON.parse(info.answer)
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
})();

</script>

<div class="wr-result-menu">
  <div class="in-header-exerc">
    {#if info.activity.type_general === 'R'}
      {#if viewResult === 0}
        <div class="wr-btns-resul-save-exerc">
          <button class="btn-result-exerc" onclick={()=>handleViewResultX('result')}>Validar</button>
        </div>
      {:else}
        <div class="wr-btns-resul-save-exerc">
          <button class="btn-result-exerc" onclick={()=>handleViewResultX('activities')}>Resultados</button>
        </div>
      {/if}
    {/if}
  </div>
  <button class="btn-view-close-exerc" onclick={handleViewBoxExercise}>{@html menu}</button>
</div>

<div class="container-edit-exercise" class:view-box-exerc={viewBox}>
  <div class="header-box-exercise">
    <div class="info-nota-exerc">
      {#if student !== undefined}
        <div>{student.name} {student.surnames}</div>
      {/if}
      <div>Nota: {formatearNota(parseFloat(notaFinal.nota))} {notaFinal.scale}</div>
    </div>
    <button class="btn-view-close-exerc" onclick={handleViewBoxExercise}>{@html circleX}</button>
  </div>

  <div class="body-box-exercise">

    <div class="container-info-exerc">
      <h1 class="topic-exerc">{info.topic}</h1>
      <h2 class="activity-exerc">{info.activity.activity}</h2>
    </div>
    <div class="row-items-exerc">
      {#if viewResult === 0 || viewResult === 1}
        {#each items as item, index}
          <div class="row-link-activity-exerc" class:resaltar-exerc={itemResaltado === index}>
            <button class="link-activity-exerc" onclick={()=>handleSelectActivity(index)}>
              <div class="box-item-link-exerc">{index + 1}</div>
              <div class="container-info-exerc">
                <div class="wr-info-result-exerc">
                  <span class="label-activity-exercise" class:resaltar-exerc={itemResaltado === index}>{typeExerc(item.type)}</span>
                  <span class="item-value-exerc">{formatearNota(item.value)} {scaleNota(scales, parseFloat(formatearNota(item.value))).scale}</span>
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
.wr-result-menu {
  display: flex;
  gap: 1em;
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
