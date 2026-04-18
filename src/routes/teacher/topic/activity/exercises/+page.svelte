<script lang="ts">
import { fade } from 'svelte/transition';
//import { FOLDER_AUDIOS, R2_DOMAIN, ALFABETO } from '$lib/utils';
import { page } from '$app/state';
import { 
  HeaderExercise, 
  EditExercise, 
  //LinkBack, 
  SelectEdit, 
  CharacterEdit, 
  MorphosyntaxEdit, 
  TestFsEdit, 
  TestEdit, 
  MatchEdit, 
  PointOutEdit, 
  TestPDFEdit,
  CharacterPartEdit,
} from '$lib/components';
import { extractParams } from '$lib/utils';
import { activityLocalstore } from '$lib/store/activity';
import { onDestroy } from 'svelte';
import { goto } from '$app/navigation';

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

let { data } = $props();
let items = data.items;
let type = $state('info');

const root = extractParams(page.url.href, ['topicId', 'origin']);
let visible = $state(false);
let indexExercise = $state(-1);
let containerBody = $state() as HTMLDivElement;
let intro = $state(true);
let editExercise = $state<EditExercise>();

// ======================================================================
//  Main
// ======================================================================
let activity: Exercise | undefined = $state();
let testPDF = $state();
let infoData = $state();

function handleActivity(index: number, _items: Item[], _viewBtnSheet: boolean) {
  if (index !== -1) {
    viewBtnSheet = _viewBtnSheet;
    visible = false;
    intro = false;
    type = _items[index].type;
    indexExercise = index;
    infoData = _items[index];
    //console.log($state.snapshot(infoData))
    if (type === 'select') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'point-out') {
      intro = true;
      activity = _items[index].exercise as Exercise;
    } else if (type === 'character') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'characterPart') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'match') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'test') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'test-fs') {
      activity = _items[index].exercise as Exercise;
    } else if (type === 'test-pdf') {
      testPDF = _items[index].exercise;
    } else if (type === 'morphosyntax') {
      intro = true;
      activity = _items[index].exercise as Exercise;
    } else if (type === 'character') {
      activity = _items[index].exercise as Exercise;
    }
    setTimeout(() => {
      visible = true;
    }, 200);

  } else if (index === -1) {
    type = 'info';
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
// ======================================================================
// ======================================================================

onDestroy(()=>{
  activityLocalstore.clear();
});

let viewBtnSheet = $state(true);
function handlePropag(sw: boolean) {
  viewBtnSheet = sw;
}

function handleGoActivities(back: string) {
  editExercise?.save();
  if (back === "content") {
    goto(`/teacher/topic/content?topicId=${root.topicId}`);
  } else if (back === "activity") {
    goto(`/teacher/topic/activity?topicId=${root.topicId}`);
  }
}
</script>

<HeaderExercise>
  {#if root.origin === "content"}
    <!--LinkBack href="/teacher/topic/content?topicId={root.topicId}" --color-link="#fff">Actividades</LinkBack-->
    <button class="btn-back" onclick={()=>handleGoActivities("content")}>Atrás</button>
  {:else if root.origin === "activity"}
    <!--LinkBack href="/teacher/topic/activity?topicId={root.topicId}" --color-link="#fff">Actividades</LinkBack-->
    <button class="btn-back" onclick={()=>handleGoActivities("activity")}>Atrás</button>
  {/if}
  <EditExercise 
    params={{activityId: data.activityId, topicId: data.topicId}}  
    activity={data.activity} 
    items={items} 
    {handleActivity} {handlePropag} bind:this={editExercise} /> <!-- topic={data.topic} -->
</HeaderExercise>

<!--Toast bind:this={toast} /-->


{#if type === 'info'}

  <div class="container-info">
    <h1 class="topic">Construye la actividad</h1> <!-- {data.topic} -->
    <h2 class="activity">{data.activity}</h2>
  </div>

{:else}

  {#if visible}
    <div class="container-body" bind:this={containerBody} transition:fade>

        {#key indexExercise}
          {#if type === 'select'}

            <SelectEdit {indexExercise} {activity} />

          {:else if type === 'character'}

            <CharacterEdit {indexExercise} {activity} {infoData} />

          {:else if type === 'test'}

            <TestEdit {activity} {infoData} />

          {:else if type === 'test-pdf'}

            <TestPDFEdit {testPDF}  {viewBtnSheet} />

          {:else if type === 'match'}

            <MatchEdit {indexExercise} {activity} {infoData} />

          {:else if type === 'test-fs'}

            <TestFsEdit {activity} />

          {:else if type === 'morphosyntax'}

            <MorphosyntaxEdit {indexExercise} {activity} {intro} />

          {:else if type === 'point-out'}

            <PointOutEdit {indexExercise} {activity} {intro} />

          {:else if type === 'characterPart'}

            <CharacterPartEdit {indexExercise} {activity} {infoData} />

          {/if}
        {/key}

    </div>
  {/if}
{/if}

<style>
.btn-back {
  background: transparent;
  color: #fff;
  font-family: var(--font-normal);
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
.container-info {
  padding: 2em 0;
  top: 5em;
  position: relative;
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
