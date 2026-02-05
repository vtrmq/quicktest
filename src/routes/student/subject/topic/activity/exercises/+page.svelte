<script lang="ts">
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';

import { 
  HeaderExercise, 
  ListExercises,
  Match,
  Morphosyntax,
  PointOut,
} from '$lib/components';


let { data } = $props();
let visible = $state(false);
//console.log(data)

type Item = {
  exercise: {};
  points: [];
  type: string;
};
/*
type ArrWordBox = {
  label: {"morphosyntax": string, "description": string};
  response: {"morphosyntax": string, "value": boolean};
  width: string; 
  sw: boolean; 
  min: number; 
  max: number; 
  size: number; 
  border: boolean;
  resaltar: boolean;
  type: string;
}
type Words = {
  id: number;
  word: string;
};
type Point = {
  answers: [{resp: '', image: '', rst: false, rss: false, word: '' }]; 
  images: []; 
  image: ''; 
  words: Words[];
  question: '';
  answersFS: [{id: number, word: string;}];
  text: number;
  audio: string;
}
type Word = {
  color: string;
  errors: number;
  resp: boolean;
  resp_color: string;
  selection_word: number;
  sign: number;
  type: string;
  value: boolean;
  word: string;
};
type Option = {
  option: string;
};
type Exercise = {
  arrWords: [];
  content: string;
  syntax: {arrWordsBox: ArrWordBox[][], isGrid: boolean};
  question: string;
  words: Word[];
  optionSuboptions: Option[];
  points: object;
}
*/




type Info = {
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

//let activity: Exercise | undefined = $state();
//let testPDF = $state();
let infoData = $state();
//let points: Point[] = $state([]);

//console.log(items)

onMount(()=>{
  visible = true;
});

function handleActivity(index: number, _items: Item[]) {
  if (index !== -1) {
    visible = false;
    type = _items[index].type;
    indexExercise = index;
    infoData = _items[index];
    //console.log($state.snapshot(infoData))
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

</script>


{#if visible}

  <HeaderExercise>
    <span>&nbsp;</span>
    <ListExercises {info} items={items} {handleActivity} />
  </HeaderExercise>

  <div class="container-body" bind:this={containerBody} transition:fade>

    {#if type === 'info'}

      <div class="container-info">
        <h1 class="topic">{info.topic}</h1>
        <h2 class="activity">{info.activity}</h2>
      </div>

    {:else if type === 'match'}

      <Match {indexExercise} {infoData} />

    {:else if type === 'morphosyntax'}

      <Morphosyntax {indexExercise} {infoData} />

    {:else if type === 'point-out'}

      <PointOut {indexExercise} {infoData} />

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
