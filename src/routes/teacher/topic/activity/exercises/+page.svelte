<script lang="ts">
//import { FOLDER_AUDIOS, R2_DOMAIN, ALFABETO } from '$lib/utils';
import { page } from '$app/state';
import { HeaderExercise, EditExercise, LinkBack, SelectEdit, CharacterEdit, MorphosyntaxEdit, TestFsEdit, TestEdit, MatchEdit } from '$lib/components';
import { filtrarParametros } from '$lib/utils';

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
type Item = {
  exercise: {};
  points: [];
  type: string;
};
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
}

let { data } = $props();
console.log(data)

let items = data.items;
let type = $state('info');
let points: Point[] = $state([]);
//let idPoint = $state(-1);

const root = filtrarParametros(page.url.href, ['topicId']);

//let toast = $state<Toast>();
let indexExercise = $state(-1);
let containerBody = $state() as HTMLDivElement;

let intro = $state(true);

// ======================================================================
//  Main
// ======================================================================
let activity: Exercise | undefined = $state();

function handleActivity(index: number, _items: Item[]) {
  if (index !== -1) {
    intro = false;
    type = _items[index].type;
    indexExercise = index;
    if (type === 'select') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'character') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'match') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'test' || type === 'test-fs') {
      points = _items[index].points;
    } else if (type === 'morphosyntax') {
      intro = true;
      activity = _items[index].exercise as Exercise;
    }
  } else if (index === -1) {
    type = 'info';
  }
  setTimeout(() => {
    containerBody.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 200);
}
// ======================================================================
// ======================================================================
</script>

<HeaderExercise>
  <LinkBack href="/teacher/topic/activity?{root}" --color-link="#fff">Actividades</LinkBack>
  <EditExercise topic={data.topic} activity={data.activity} items={items} {handleActivity} />
</HeaderExercise>

<!--Toast bind:this={toast} /-->

<div class="container-body" bind:this={containerBody}>

  {#if type === 'info'}

    <div class="container-info">
      <h1 class="topic">{data.topic}</h1>
      <h2 class="activity">{data.activity}</h2>
    </div>

  {:else if type === 'select'}

    <SelectEdit {indexExercise} {activity} />

  {:else if type === 'character'}

    <CharacterEdit {indexExercise} {activity} />

  {:else if type === 'test'}

    <TestEdit pointsT={points} />

  {:else if type === 'match'}

    <MatchEdit {indexExercise} {activity} />

  {:else if type === 'test-fs'}

    <TestFsEdit pointsT={points} />

  {:else if type === 'morphosyntax'}

    <MorphosyntaxEdit {indexExercise} {activity} {intro} />

  {/if}
</div>

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

/* ================================== */
.container-body {
  position: fixed;
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
