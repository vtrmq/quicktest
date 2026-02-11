<script lang="ts">
import { typeExerc } from "$lib/utils"
import { activityLocalstore } from '$lib/store/activity_student';
let { info, items, handleActivity } = $props();
import menu from '$lib/assets/svg/menu.svg?raw';
import circleX from '$lib/assets/svg/circle-x.svg?raw';


let viewBox = $state(false); // false
let itemResaltado = $state(-1);
let scales = info.scales;
console.log(scales)

function handleViewBoxExercise() {
  viewBox = !viewBox;
}

function handleSelectActivity(index: number) {
  itemResaltado = index;
  viewBox = !viewBox;
  const _items = activityLocalstore.get();
  handleActivity(index, _items);
}

</script>

<button class="btn-view-close" onclick={handleViewBoxExercise}>{@html menu}</button>
<div class="container-edit-exercise" class:view-box={viewBox}>
  <div class="header-box-exercise">
    <h2 class="label-header">Lista de actividades</h2>
    <button class="btn-view-close" onclick={handleViewBoxExercise}>{@html circleX}</button>
  </div>

  <div class="body-box-exercise">

    <div class="container-info">
      <h1 class="topic">{info.topic}</h1>
      <h2 class="activity">{info.activity}</h2>
    </div>
    <div class="row-items">
      {#each items as item, index}
        <div class="row-link-activity" class:resaltar={itemResaltado === index}>
          <button class="link-activity" onclick={()=>handleSelectActivity(index)}>
            <div class="box-item-link">{index + 1}</div>
            <div class="container-info-exerc">
              <span class="label-activity-exercise" class:resaltar={itemResaltado === index}>{typeExerc(item.type)}</span>
              {#if item.type === 'morphosyntax' ||  item.type === 'test-pdf' || item.type === 'test-fs'}
                <div class="text-left">{item.exercise.content}</div>
              {:else}
                <div class="text-left">{item.exercise.question}</div>
              {/if}
            </div>
          </button>
        </div>
      {/each}
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
.label-header {
  font-family: var(--font-bold);
  color: #fff;
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
