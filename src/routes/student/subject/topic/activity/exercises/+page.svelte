<script lang="ts">
import { goto } from '$app/navigation';
import { deserialize } from '$app/forms';
import { page } from '$app/state';
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { filtrarParametros, getDateTimeUTC } from "$lib/utils";
import { Toast } from '$lib/components';
import { activityLocalstore } from '$lib/store/activity_student';
import { beforeNavigate } from '$app/navigation';

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
  Chonometer,
  CharacterPart, 
} from '$lib/components';

let { data } = $props();
let visible = $state(false);
let isSend = $state(false);
let toast = $state<Toast | null>(null);
let listExercises = $state<ListExercises | null>(null);
const search = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId', 'topicId', 'activityId', 'origin']);

console.log(data)

//console.log(page)
//console.log(data.info?.activity.type_general)

let scales = data.info?.scales;
let type_activity = data.info?.activity.type_general;

//console.log(data)

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
let typeGeneral = $state(data.info?.activity.type_general);

onMount(()=>{
  visible = true;
});

function handleActivity(index: number, _items: Item[], _viewResult: number, _viewBtnSheet: boolean) {

  viewResult = _viewResult;
  //console.log(viewResult)
  viewBtnSheet = _viewBtnSheet;

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
  //console.log(viewResult)
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
    activityLocalstore.clear();
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

let viewBtnSheet = $state(true);
function handlePropag(sw: boolean) {
  viewBtnSheet = sw;
}

let navegacionConfirmada = false;

beforeNavigate(({ cancel, to, type }) => {
  // Si ya confirmamos, dejamos que pase
  if (navegacionConfirmada) return;

  // Si es una navegación que queremos interceptar (atrás o links)
  if (to && type !== 'link') {
    cancel(); // Cancelamos la navegación instantáneamente
    toast?.view({
      type: '',
      message: 'Debes enviar la acividad',
      time: 3000
    });
  }
});

function handleGoActivityInfo() {
  goto(`/student/subject/topic/activity/info?${search}`);
}

function handleChangeResultView() {
  listExercises?.handleViewResultX();
}

</script>

<Toast bind:this={toast} />

{#if visible}

  <HeaderExercise>
    {#if type_activity === 'V'}
      <div><Chonometer /></div>
    {:else if type_activity === 'R'}
      <!--LinkBack href="/student/subject/topic/activity/info?{search}" --color-link="#fff">Volver</LinkBack-->
      <button class="btn-back" onclick={handleGoActivityInfo}>Atrás</button>
    {/if}
    <ListExercises bind:this={listExercises} {info} items={items} {handleActivity} {handleViewResult} {handleSendActivity} {isSend} {handlePropag} />
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

          <Match {type_activity} {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {:else if type === 'morphosyntax'}

          <Morphosyntax {type_activity} {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {:else if type === 'point-out'}

          <PointOut {type_activity} {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {:else if type === 'select'}

          <SelectWord {type_activity} {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {:else if type === 'character'}

          <Character {type_activity} {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {:else if type === 'characterPart'}

          <CharacterPart {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {:else if type === 'test'}

          <Test {type_activity} {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {:else if type === 'test-pdf'}

          <TestPDF {type_activity} {viewResult} {scales} {indexExercise} {infoData} {viewBtnSheet} />

        {:else if type === 'test-fs'}

          <TestFS {type_activity} {viewResult} {scales} {indexExercise} {infoData} {typeGeneral} {handleChangeResultView} />

        {/if}
      {/key}

    {/if}
  </div>
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
