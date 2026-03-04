<script lang="ts">
import arrowUp from '$lib/assets/svg/arrow-up.svg?raw';
import arrowDown from '$lib/assets/svg/arrow-down.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import test from '$lib/assets/svg/message-square-text.svg?raw';
import { EditBtn, Toast } from '$lib/components';
import { onMount, onDestroy } from 'svelte'; // ✅ onMount está aquí
import { WinTestEdit } from "$lib/components";

let { data, handleEvent = ()=>{}, id, onEvent = ()=>{}, option = "dev" } = $props();
let textarea = $state<HTMLTextAreaElement>();
let localText = $derived(data.text);
let isEdit = $derived(data.isEdit);
let toast = $state<Toast | null>(null);
let winTestEdit = $state<WinTestEdit | null>(null);
let questions = $state(data.questions);

// ──────────────────────────────────────────────────────
//  YouTube Player API & Tracking
// ──────────────────────────────────────────────────────
let player: YT.Player | null = null;
let playerDiv = $state<HTMLDivElement>();

let isPlaying = $state(false);
let currentTime = $state(0);
let duration = $state(0);
let timeInterval: number | null = null;

const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('✅ [Video] YouTube API cargada correctamente');
      console.log('🔑 [Video] window.YT disponible:', !!window.YT);
    };
    setTimeout(initYouTubePlayer, 2000);
  });
};

const initYouTubePlayer = async () => {
  if (!playerDiv || !localText?.trim()) return;
  
  await loadYouTubeAPI();
  
  const cleanUrl = localText.trim();
  const videoId = cleanUrl.match(/v=([a-zA-Z0-9_-]{11})/)?.[1] || 
                  cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)?.[1];
  
  if (!videoId) return;
  
  if (player) player.destroy();
  
  player = new YT.Player(playerDiv, {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
    events: {
      onReady: (event: YT.PlayerEvent) => {
        duration = event.target.getDuration();
      },
      onStateChange: (event: YT.OnStateChangeEvent) => {
        if (event.data === 1) {
          isPlaying = true;
          startTrackingTime();
        }
        if (event.data === 2 || event.data === 0) {
          isPlaying = false;
          stopTrackingTime();
        }
      },
    }
  });
};

const startTrackingTime = () => {
  if (timeInterval) clearInterval(timeInterval);
  timeInterval = window.setInterval(() => {
    if (player && isPlaying) {
      currentTime = player.getCurrentTime();
      duration = player.getDuration();
      const time = `${Math.floor(currentTime / 60)}:${(Math.floor(currentTime) % 60).toString().padStart(2, '0')}`
      console.log(option)
      console.log(currentTime)
      console.log(time)
    }
  }, 500);
};

const stopTrackingTime = () => {
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
};

const destroyYouTubePlayer = () => {
  stopTrackingTime();
  if (player) {
    player.destroy();
    player = null;
  }
  isPlaying = false;
  currentTime = 0;
  duration = 0;
};

// ✅ onMount EXPLÍCITO aquí
onMount(() => {
  if (!isEdit && localText?.trim()) {
    setTimeout(initYouTubePlayer, 50);
  }
});

// ✅ onDestroy para limpieza
onDestroy(() => {
  destroyYouTubePlayer();
});

// ✅ $effect para cuando cambia isEdit
$effect(() => {
  if (!isEdit && localText?.trim()) {
    setTimeout(initYouTubePlayer, 50);
  } else {
    destroyYouTubePlayer();
  }
});

function viewTextArea() {
  destroyYouTubePlayer();
  onEvent(id);
}

function handleTextAreaInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  localText = target.value;
}

function handle(action: string) {
  if (action === 'ok' && localText.trim().length === 0) {
    toast?.view({ type: 'success', message: 'Coloca el link del video' });
    return;
  }
  if (action === "test") {
    winTestEdit?.show();
    return;
  }
  const info = {text: localText, type: data.type, size: 0, isEdit, questions};
  handleEvent({data: info, action, id});
}

function handleSendQuestions(qs: any) {
  questions = JSON.parse(qs);
}

</script>

<Toast bind:this={toast} />
<WinTestEdit bind:this={winTestEdit} {questions} handleSend={handleSendQuestions} />

<div class="container-iframe">
  {#if !isEdit}
    <div class="wr-iframe">
      
      <!-- Contenedor del Player de YouTube -->
      <div class="youtube-player" bind:this={playerDiv}></div>
      
      <button class="btn-select-video" onclick={viewTextArea}>Editar</button>

      <!-- Overlay interno opcional: muestra el tiempo mientras se reproduce -->
      {#if isPlaying}
        <div class="video-time-overlay">
          ⏱️ {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}
        </div>
      {/if}

    </div>
  {:else}
    <div class="wr-textarea">
      <div>
        <textarea 
          spellcheck="false"
          oninput={(e)=>handleTextAreaInput(e)} 
          bind:this={textarea} 
          class="textarea" 
          name="video"
          placeholder="Coloca el link del video"
        >{localText}</textarea>
      </div>
      <div class="wr-btns">
        <EditBtn onclick={()=>handle('ok')}>Listo</EditBtn>
        <EditBtn onclick={()=>handle('test')}>{@html test}</EditBtn>
        <EditBtn onclick={()=>handle('up')}>{@html arrowUp}</EditBtn>
        <EditBtn onclick={()=>handle('down')}>{@html arrowDown}</EditBtn>
        <EditBtn onclick={()=>handle('delete')}>{@html trash}</EditBtn>
      </div>
    </div>
  {/if}
</div>

<style>
.btn-select-video {
  position: absolute;
  right: 11px;
  width: 80px;
  height: 50px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000;
  color: #fff;
  font-size: 1.1em;
  font-family: var(--font-normal);
  font-weight: 800;
  top: 10px;
  z-index: 10;
}
.wr-textarea {
  width: 100%;
}
.wr-iframe {
  display: flex;
  width: 100%;
  height: 300px;
  position: relative;
  box-shadow: rgb(149 157 165 / 46%) 0px 8px 24px;
  border: 1px solid #fff;
  padding: 10px;
}
.youtube-player {
  width: 100%;
  height: 100%;
}
.container-iframe {
  padding: 0.8em 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wr-btns {
  display: flex;
  justify-content: center;
  gap: 1em;
  padding-top: 10px;
  padding-bottom: 10px;
  background: #fff;
  border-radius: 40px;
  box-shadow: rgb(0 0 0 / 15%) 0px 3px 8px;
}
.textarea {
  width: 100%;
  resize: none;
  background: transparent;
  font-family: var(--font-normal);
  font-size: 1.1em;
  line-height: 30px;
}

/* Overlay de tiempo (interno del componente) */
.video-time-overlay {
  position: absolute;
  bottom: 60px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: var(--font-normal);
  pointer-events: none;
  z-index: 5;
}

@media(min-width: 700px) {
  .wr-iframe {
    width: 90%;
  }
}
</style>
