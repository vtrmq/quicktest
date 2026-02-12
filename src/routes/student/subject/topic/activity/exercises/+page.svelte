<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { fade } from 'svelte/transition';

import { 
  HeaderExercise, 
  ListExercises,
  Match,
  Morphosyntax,
  PointOut,
  SelectWord,
  Character,
  Test,
  TestPDF,
  TestFS,
} from '$lib/components';

let { data } = $props();
let visible = $state(false);

let scales = data.info?.scales;

type Item = {
  exercise: {};
  points: [];
  type: string;
};

type Info = {
  result: object;
  activity: string;
  activityId: number;
  courseId: number;
  origin: string;
  subjectId: number;
  teacherId: number;
  topic: string;
  topicId: number;
}

let items = data.items;
let type = $state('info');
let containerBody = $state() as HTMLDivElement;
let info: Info = data.info as Info;
let indexExercise = $state(-1);

let infoData = $state();
let viewResult = $state(0);


onMount(()=>{
  visible = true;
});

function handleActivity(index: number, _items: Item[], _viewResult: number) {

  viewResult = _viewResult;
  if (index !== -1) {
    visible = false;
    type = _items[index].type;
    indexExercise = index;
    infoData = _items[index];
    setTimeout(() => {
      visible = true;
    }, 200);

  }

  setTimeout(() => {
    if (containerBody) {
      containerBody.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, 200);
}

onDestroy(()=>{
  //activityLocalstore.clear();
});

function handleViewResult(_viewResult: number) {
  viewResult = _viewResult;
}

</script>


{#if visible}

  <HeaderExercise>
    <span>&nbsp;</span>
    <ListExercises {info} items={items} {handleActivity} {handleViewResult} />
  </HeaderExercise>

  <div class="container-body" bind:this={containerBody} transition:fade>

    {#if type === 'info'}

      <div class="container-info">
        <h1 class="topic">{info.topic}</h1>
        <h2 class="activity">{info.activity}</h2>
      </div>

    {:else}

      {#key indexExercise}
        {#if type === 'match'}

          <Match {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'morphosyntax'}

          <Morphosyntax {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'point-out'}

          <PointOut {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'select'}

          <SelectWord {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'character'}

          <Character {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'test'}

          <Test {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'test-pdf'}

          <TestPDF {scales} {indexExercise} {infoData} />

        {:else if type === 'test-fs'}

          <TestFS {scales} {indexExercise} {infoData} />

        {/if}
      {/key}

    {/if}
  </div>
{/if}

<style>
.container-info {
  padding: 2em 0;
}
.topic {
  font-size: 1.7em;
  font-family: var(--font-bold);
  text-align: center;
  margin-bottom: 0.3em;
}
.activity {
  font-family: var(--font-normal);
  font-size: 1.2em;
  font-weight: 500;
  text-align: center;
}
.container-body {
  position: absolute;
  top: var(--height-header);
  width: 100%;
  height: calc(100% - var(--height-header));
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1em 0.5em;
}
</style>
