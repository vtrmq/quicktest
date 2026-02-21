<script lang="ts">
import { goto } from '$app/navigation';
import { deserialize } from '$app/forms';
import { page } from '$app/state';
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { filtrarParametros, getDateTimeUTC } from "$lib/utils";
import { Toast } from '$lib/components';

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
  LinkBack,
  Chonometer,
} from '$lib/components';

let { data } = $props();
let visible = $state(false);
let isSend = $state(false);
let toast = $state<Toast | null>(null);
const search = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId', 'topicId', 'activityId', 'origin']);

//console.log(page)
//console.log(data.info?.activity.type_general)

let scales = data.info?.scales;
let type_activity = data.info?.activity.type_general;

type Item = {
  exercise: {};
  points: [];
  type: string;
};

type Info = {
  activity: {activity: string;};
  activityId: number;
  courseId: number;
  origin: string;
  scales: object;
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


function handleViewResult(_viewResult: number) {
  viewResult = _viewResult;
}

async function handleSendActivity(activity: object, url: string) {

  const formData = new FormData();
  formData.append('dateTime', getDateTimeUTC());
  formData.append('activity', JSON.stringify(activity));

  const response = await fetch('?/send', {
    method: 'POST',
    body: formData
  });

  isSend = true;
  const resp = await response.text();
  const result = deserialize(resp);

  if (result.type === "success") {
    goto(url);
  } else if (result.type === "failure") {
    toast?.view({
      type: result.type,
      message: result.data?.message,
      time: 3000
    });
    isSend = false;
  } else if (result.type === "redirect") {
    goto('/')
  }

}

</script>

<Toast bind:this={toast} />

{#if visible}

  <HeaderExercise>
    {#if type_activity === 'V'}
      <div><Chonometer /></div>
    {:else if type_activity === 'R'}
      <LinkBack href="/student/subject/topic/activity/info?{search}" --color-link="#fff">Volver</LinkBack>
    {/if}
    <ListExercises {info} items={items} {handleActivity} {handleViewResult} {handleSendActivity} {isSend} />
  </HeaderExercise>

  <div class="container-body" bind:this={containerBody} transition:fade>

    {#if type === 'info'}

      <div class="container-info">
        <h1 class="topic">{info.topic}</h1>
        <h2 class="activity">{info.activity.activity}</h2>
      </div>

    {:else}

      {#key indexExercise}
        {#if type === 'match'}

          <Match {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'morphosyntax'}

          <Morphosyntax {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'point-out'}

          <PointOut {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'select'}

          <SelectWord {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'character'}

          <Character {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'test'}

          <Test {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'test-pdf'}

          <TestPDF {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

        {:else if type === 'test-fs'}

          <TestFS {type_activity} {viewResult} {scales} {indexExercise} {infoData} />

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
