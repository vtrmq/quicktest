<script lang="ts">
import { FOLDER_AUDIOS, R2_DOMAIN } from '$lib/utils';
import { EditText, LinkBack, Toolbar, ImageContent, VideoContent, Vignette, Toast, Audios, Dialog } from "$lib/components";
import { typeActivity, quitarExtension } from "$lib/utils";
import { deserialize } from '$app/forms';
import trash from '$lib/assets/svg/trash.svg?raw'
import fileSpreadsheet from '$lib/assets/svg/file-spreadsheet.svg?raw';

let { data } = $props();
let dialog = $state<Dialog | null>(null);
let content = $state(JSON.parse(data.topic.content) ?? []);
let posLine = $state(-1);
let indexContent = $state(-1);
let noneSpace = $state(true);
let visibleToolbar = $state(false);
let toast = $state<Toast | null>(null);
let isLoad = $state(false);
let topicId = data.topic.topic_id;
let audio = $state<Audios | null>(null);
const root = `${R2_DOMAIN}/${FOLDER_AUDIOS}`;

type Extra = {
  type_activity: string;
  items: any;
};
let activities = $state(data.activities);
let extras: Extra[] = $state(data.extras);

type Response = {
  question: string;
  rss: boolean;
  rst: boolean;
};
type Point = {
  question: string;
  image: string;
  response: Response[]
};
type Question = {
  points: Point[];
  time_pause: string;
};

type DataInput = {
  id: number;
  data: {text: string; type: string; isEdit: boolean, questions: Question[]};
  action: 'delete' | 'ok' | 'up' | 'down'
}

type Result = {
  type: string;
  message?: string;
  data?: {message: string; type: string;}
};

if (content.length === 0) {
  content.push( {type: 'title', text: data.topic.topic, size: 0, isEdit: false, questions: []} )
}

function handleAction(info: DataInput) {
  if (info.action === 'ok') {

    content[info.id] = info.data;
    content[info.id].isEdit = false;

  } else if (info.action === 'delete') {

    let pos = info.id;
    if (content.length === 1) return;
    content.splice(pos, 1);

  } else if (info.action === 'up' || info.action === 'down') {

    let pos = -1;
    if (info.action === 'up') {
      pos = info.id - 1;
    } else if (info.action === 'down') {
      pos = info.id + 1;
    }

    if (pos === -1 || pos === content.length) return

    content[info.id] = info.data;
    const text_a = content[info.id].text;
    const type_a = content[info.id].type;
    const size_a = content[info.id].size;

    const text_b = content[pos].text;
    const type_b = content[pos].type;
    const size_b = content[pos].size;

    content[pos] = {text: text_a, type: type_a, size: size_a, isEdit: true};
    content[info.id] = {text: text_b, type: type_b, size: size_b, isEdit: false};

  }
}

function returnContent() {
  let sw = false;
  for (let i = 0; i < content.length; i++) {
    if (content[i].isEdit) {
      sw = true;
      break;
    }
  }
  return sw;
}

function handleEventEdit(index: number) {
  posLine = -1;
  if (returnContent() === false) {
    for (let i = 0; i < content.length; i++) {
      content[i].isEdit = false;
    }
    content[index].isEdit = true;
  } else {
    toast?.view({ type: 'success', message: 'Hay un editor abierto' });
  }
}

function handleSelectLine(index: number) {
  if (noneSpace || returnContent()) return;
  if (posLine === -1 || posLine !== index) {
    posLine = index;
    indexContent = index;
    visibleToolbar = true;
  } else {
    posLine = -1;
    indexContent = -1;
    visibleToolbar = false;
  }
}

function handleEyeLine() {
  posLine = -1;
  indexContent = -1;
  noneSpace = !noneSpace;
  visibleToolbar = true;
  visibleToolbar = false;
}

function handleBtnToolbar(action: string) {
  posLine = -1;
  visibleToolbar = false;
  if (action === 'title' || action === 'subtitle' || action === 'paragraph') {
    content.splice(indexContent + 1, 0, {type: action, text: '', size: 0, isEdit: true});
  } else if (action === 'image') {
    content.splice(indexContent + 1, 0, {type: action, text: '', size: 60, isEdit: true});
  } else if (action === 'video') {
    content.splice(indexContent + 1, 0, {type: action, text: '', size: 0, isEdit: true, questions: []});
  } else if (action === 'vignette') {
    content.splice(indexContent + 1, 0, {type: action, text: [{item: ''}], size: 0, isEdit: true});
  }
}

async function handleActionSave() {
  if (returnContent()) {
    toast?.view({ type: 'success', message: 'Hay un editor abierto' });
    return;
  }
  isLoad = true;
  const formData = new FormData();
  formData.append('topicId', topicId);
  formData.append('content', JSON.stringify(content));
  formData.append('extras', JSON.stringify(extras));

  const response = await fetch('?/save', {
    method: 'POST',
    body: formData
  })
  isLoad = false;
  const responseText = await response.text();
  const result: Result = deserialize(responseText);
  if (result.type === 'success' || result.type === 'failure') {
    toast?.view({ type: result.type, message: result.data?.message, time: 3000 });
  }
}

type AudiosAll = {
  name: string;
  shadow_audio: string;
};

async function handleAudioSelect(audio: AudiosAll) {
  //let localAudio: string = `${root_audio}/${_audio}`;
  if (extras.length === 0) {
    extras.push({type_activity: "audios", items: [{name: audio.name, shadow_audio: audio.shadow_audio}]});
  } else {
    for (let i = 0; i < extras.length; i++) {
      if (extras[i].type_activity === "audios") {
        extras[i].items.push({name: audio.name, shadow_audio: audio.shadow_audio});
      }
    }
  }
}

function handleShowAudio() {
  audio?.handleShowAudios();
}

function handleActionRemoveExtra(e: string) {
  if (e === 'accept') {
    let items = JSON.parse(JSON.stringify(extras[posItemExtra.index].items));
    items = items.filter((_: any, i: number) => i !== posItemExtra.item);
    extras[posItemExtra.index].items = items;
  }
}

let posItemExtra = {index: -1, item: -1};
function handleActionShowWin(index: number, item: number) {
  posItemExtra = {index, item};
  let message = '';
  switch (extras[index].type_activity) {
    case "audios": message = "¿Quieres quitar el audio?"; break;
  }
  dialog?.show({
    type: 'delete',
    message,
  });
}

</script>

<Toast bind:this={toast} />
<Audios bind:this={audio} onSelectAudio={handleAudioSelect} />
<Dialog bind:this={dialog} action={handleActionRemoveExtra} />

<div class="content">
  <div class="header-content">
    <LinkBack href="/teacher/topic">Temas</LinkBack>
  </div>
  {#each content as section, index}
    {#if section.type === 'title'}
      <EditText data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'subtitle'}
      <EditText data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'paragraph'}
      <EditText data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'image'}
      <ImageContent data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'video'}
      <VideoContent data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {:else if section.type === 'vignette'}
      <Vignette data={section} handleEvent={handleAction} id={index} onEvent={handleEventEdit} />
    {/if}
    <div class="space" class:none-space={noneSpace} onclick={()=>handleSelectLine(index)} onkeyup={()=>{}} role="button" tabindex="0">
      <div class="line" class:visible={index === posLine}></div>
    </div>
  {/each}

  {#if activities.length !== 0}
    <div class="container-activities">
      <h1 class="act">Actividades del tema</h1>
      <div class="wr-activities">
        {#each activities as activity}
          <div class="container-activity">
            <div class="wrapper-container-activity">
              <div class="name-activity">{activity.activity}</div>
              <div>Tipo: {typeActivity(activity.type_general)}</div>
              {#if activity.time !== null}
                <div>Tiempo: {activity.time} min</div>
              {/if}
              {#if (activity.items === null && activity.file === null) || (activity.items.length === 0 && activity.file === null)}
                <div class="red">La actividad no tiene ejercicios</div>
              {/if}
            </div>
            <a class="link-subject" href="/teacher/topic/activity/exercises?topicId={activity.topic_id}&activityId={activity.activity_id}&origin=content">{@html fileSpreadsheet}</a>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#each extras as activity, index}
    {#if activity.type_activity === "audios" && activity.items.length !== 0}
      <div class="container-activities">
        <h1 class="act">Audios</h1>
        <div class="container-audios">
          {#each activity.items as audio, item}
            <div class="wr-audios">
              <div class="wr-audio-text">
                <audio class="audio" src="{root}/{audio.shadow_audio}" controls></audio>
                <div class="name-audio">{quitarExtension(audio.name)}</div>
                <button class="btn-trash" onclick={()=>handleActionShowWin(index, item)}>{@html trash}</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/each}

</div>

<Toolbar 
  {isLoad} 
  visible={visibleToolbar} 
  {handleEyeLine} 
  {handleActionSave} 
  {noneSpace} 
  {handleBtnToolbar} {handleShowAudio} />

<style>
:global {
  .link-subject > svg {
    width: 24px;
    color: #4CAF50;
    stroke-width: 2px;
  }
}
.wrapper-container-activity {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}
.wr-activities {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.btn-trash {
  width: 35px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  background: transparent;
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 4px;
}
:global {
  .btn-trash > svg {
    width: 22px;
    color: #f35656;
  }
}
.container-audios {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.wr-audio-text {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.4em;
  align-items: center;
}
.name-audio {
  padding: 0.5em;
  width: 100%;
  font-size: 1em;
  text-align: center;
  border-radius: 5px;
  font-family: var(--font-normal);
}
.wr-audios {
  display: flex;
  gap: 1em;
  border-radius: 8px;
  background: #ffffff;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
  padding: 1.8em 1em 1em;
  position: relative;
}
.act {
  font-family: var(--font-bold);
  font-size: 1.4em;
  margin-bottom: 1em;
  color: brown;
  padding-left: 0.6em;
}
.name-activity {
  font-weight: 700;
  font-size: 1.1em;
}
.container-activity {
  border-radius: 8px;
  background: #f0ffff8a;
  height: max-content;
  width: 100%;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
  padding: 1em;
  gap: 1em;
  display: flex;
  font-family: var(--font-normal);
  justify-content: space-between;
}
.container-activities {
  padding: 2em 0;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@keyframes blink {
0% {
  opacity: 0;
}
50% {
  opacity: 1;
}
100% {
  opacity: 0;
}
}
.line {
  background: #71c0ff;
  height: 40%;
  width: 100%;
  display: none;
  animation: blink .7s infinite;
}
.line.visible {
  display: block;
}
.space {
  height: 10px;
  border-top: 1px dashed #2196f3f2;
  border-bottom: 1px dashed #2196f3f2;
  cursor: pointer;
  width: 100%;
  background: transparent;
  color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}
.space.none-space {
  opacity: 0;
}
.content {
  padding: 1em 0 5em;
  margin: 0 auto;
}
@media (min-width: 700px) {
  .content {
    padding: 1em 1em 0;
    margin: 0 auto 6em;
    max-width: 600px;
  }
}
</style>
