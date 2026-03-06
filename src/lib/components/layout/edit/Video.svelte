<script lang="ts">
import arrowUp from '$lib/assets/svg/arrow-up.svg?raw';
import arrowDown from '$lib/assets/svg/arrow-down.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import test from '$lib/assets/svg/message-square-text.svg?raw';
import expand from '$lib/assets/svg/expand.svg?raw';
import minimize from '$lib/assets/svg/minimize.svg?raw';
import play from '$lib/assets/svg/play.svg?raw';
import { EditBtn, Toast } from '$lib/components';
import { onMount } from 'svelte';
import { WinTestEdit, TestDialog } from "$lib/components";

type Answer = {
  answer: string;
  rss: boolean;
  rst: boolean;
};
type Point = {
  question: string;
  image: string;
  points: Answer[]
};
type Question = {
  points: Point[];
  time_pause: string;
};

let { data, handleEvent = ()=>{}, id, onEvent = ()=>{} } = $props();
let textarea = $state<HTMLTextAreaElement>();
let localText = $derived(data.text);
let isEdit = $derived(data.isEdit);
let toast = $state<Toast | null>(null);
let winTestEdit = $state<WinTestEdit | null>(null);
let testDialog = $state<TestDialog | null>(null);
let questions: Question[] = $state(data.questions);

let videoWrapper = $state<HTMLDivElement>();
let isFullscreen = $state(false);

let player: YT.Player | null = null;
let playerDiv = $state<HTMLDivElement>();
let isPlaying = $state(false);
let currentTime = $state(0);
let duration = $state(0);
let timeInterval: number | null = null;

let rangeElement = $state<HTMLInputElement>();
let isDragging = $state(false);

let progressPercent = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
// Coloque esto en varias funciones, si hay algún problema quitarlo if (!player) return;

const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api ';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    (window as any).onYouTubeIframeAPIReady = () => {};
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
    controls: 0,
    modestbranding: 1,
    rel: 0,
    disablekb: 1,
    fs: 0,
    iv_load_policy: 3,
    playsinline: 1,
    cc_load_policy: 0,
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
  if (!player) return;
  if (timeInterval) clearInterval(timeInterval);
  timeInterval = window.setInterval(() => {
    if (player && isPlaying && !isDragging) {
      currentTime = player.getCurrentTime();
      const time = `${Math.floor(currentTime / 60)}:${(Math.floor(currentTime) % 60).toString().padStart(2, '0')}`;
      
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].time_pause === time) {
          player.pauseVideo();
          isPlaying = false;
          stopTrackingTime();
          for (let i = 0; i < questions.length; i++) {
            for (let j = 0; j < questions[i].points.length; j++) {
              for (let x = 0; x < questions[i].points[j].points.length; x++) {
                questions[i].points[j].points[x].rss = false;
              }
            }
          }
          testDialog?.show(questions[i].points);
          return;
        }
      }
    }
  }, 1000);
};

const stopTrackingTime = () => {
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
};

const destroyYouTubePlayer = () => {
  if (!player) return;
  stopTrackingTime();
  if (player) {
    player.destroy();
    player = null;
  }
  isPlaying = false;
  currentTime = 0;
  duration = 0;
};

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoWrapper?.requestFullscreen().catch(err => {
      console.error(`Error al entrar fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

onMount(() => {
  const handleFullscreenChange = () => {
    isFullscreen = !!document.fullscreenElement;
  };
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  if (!isEdit && localText?.trim()) {
    setTimeout(initYouTubePlayer, 50);
  }
  
  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    destroyYouTubePlayer();
  };
});

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

function handleRangeStart() {
  isDragging = true;
}

function handleRangeEnd() {
  isDragging = false;
}

function handleRangeInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const newTime = parseFloat(target.value);
  
  if (player) {
    player.seekTo(newTime, true);
  }
  
  currentTime = newTime;
}

function togglePlay() {
  if (!player) return;
  if (isPlaying) {
    player?.pauseVideo();
  } else {
    player?.playVideo();
  }
}

function handleStartVideo() {
  player?.playVideo();
}

</script>

<Toast bind:this={toast} />
<WinTestEdit bind:this={winTestEdit} {questions} handleSend={handleSendQuestions} />

<div class="video-wrapper" bind:this={videoWrapper}>
  
  <TestDialog bind:this={testDialog} {handleStartVideo} />
  
  <div class="container-iframe">
    {#if !isEdit}
      <div class="wr-iframe" class:fullscreen={isFullscreen}>
        
        <div class="youtube-player" bind:this={playerDiv}></div>

        <div class="range-container">
          <!-- ✅ CAMBIO: Usar background linear-gradient en el container en lugar de un div separado -->
          <div class="range-track">
            <div 
              class="range-fill" 
              style="width: {progressPercent}%"
            ></div>
            <input 
              type="range"
              bind:this={rangeElement}
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onmousedown={handleRangeStart}
              onmouseup={handleRangeEnd}
              ontouchstart={handleRangeStart}
              ontouchend={handleRangeEnd}
              oninput={handleRangeInput}
              class="video-range"
            />
          </div>
        </div>

        <button class="btn-play-overlay" onclick={togglePlay} class:hiden={isPlaying}>{@html play}</button>
        
        <button class="btn-fullscreen" onclick={toggleFullscreen}>
          {#if isFullscreen}{@html minimize}{:else}{@html expand}{/if}
        </button>
        
        {#if !isFullscreen}
          <button class="btn-select-video" onclick={viewTextArea}>Editar</button>
        {/if}

        <div class="video-time-overlay">
          ⏱️ {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}
        </div>

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
</div>

<style>

/* ✅ CAMBIO: Nueva estructura con track y fill como hijos */
.range-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 0 10px;
  /*background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);*/
  --thumb-size: 16px;
  --track-height: 6px;
  --fill-color: #2196F3;
  --thumb-color: #2196F3;
}

/* ✅ CAMBIO: Track que contiene el fill y el input */
.range-track {
  position: relative;
  width: 100%;
  height: var(--track-height);
  background: #FF9800;
  border-radius: 3px;
}
/*
.range-container:hover .range-track {
  height: 10px;
}
*/
/* ✅ CAMBIO: Fill que crece desde la izquierda hasta el porcentaje */
.range-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--fill-color);
  border-radius: 3px;
  pointer-events: none;
  z-index: 1;
  /* ✅ CAMBIO: El truco - extender más allá del 100% para compensar el thumb */
  max-width: calc(100% - var(--thumb-size) / 2);
}

/* ✅ CAMBIO: Input range que ocupa todo el ancho incluyendo el área del thumb */
.video-range {
  position: absolute;
  left: calc(var(--thumb-size) / -2); /* ✅ Centrar el track del input */
  right: calc(var(--thumb-size) / -2);
  width: calc(100% + var(--thumb-size)); /* ✅ Ancho total + thumb */
  height: 100%;
  top: 0;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  margin: 0;
  z-index: 2;
}

.video-range::-webkit-slider-runnable-track {
  height: 100%;
  background: transparent;
}

.video-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  background: var(--thumb-color);
  border: 2px solid #fff;
  cursor: grab;
  margin-top: -5px; /* Centrar en track de 6px */
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: transform 0.1s;
  position: relative;
  z-index: 3;
}

.video-range::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.video-range::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.3);
}

.video-range::-moz-range-track {
  height: 100%;
  background: transparent;
}

.video-range::-moz-range-thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  background: var(--thumb-color);
  border: 2px solid #fff;
  cursor: grab;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  position: relative;
  z-index: 3;
}

.video-range:focus {
  outline: none;
}

.btn-play-overlay {
  position: absolute;
  width: 80px;
  height: 80px;
  background: #cdebaa;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 3px solid #88b94e;
  box-shadow: rgb(0 0 0 / 65%) 0px 5px 15px;
}
:global {
  .btn-play-overlay > svg {
    width: 50px;
    color: #333;
    stroke-width: 3px;
  }
}
.btn-play-overlay.hiden {
  display: none;
}

.video-wrapper {
  width: 100%;
  position: relative;
}

.video-wrapper:fullscreen {
  background: #000;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-wrapper:fullscreen .container-iframe {
  width: 100%;
  height: 100%;
  padding: 0;
}

.video-wrapper:fullscreen .wr-iframe {
  width: 100%;
  height: 100%;
  max-width: none;
  box-shadow: none;
  border: none;
  padding: 0;
}

.btn-fullscreen {
  position: absolute;
  bottom: 20px;
  right: 10px;
  width: 52px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  transition: background 0.2s;
}

.btn-fullscreen:hover {
  background: rgba(0, 0, 0, 0.9);
}

:global(.btn-fullscreen > svg) {
  width: 20px;
  height: 20px;
  color: #fff;
}

.video-wrapper:fullscreen .btn-select-video {
  display: none;
}

:global(.container-win-test-wt) {
  z-index: 9999 !important;
}

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
  top: 12px;
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
  padding: 0.7em;
  justify-content: center;
  align-items: center;
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

.video-time-overlay {
  position: absolute;
  bottom: 20px;
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
  
  .video-wrapper:fullscreen .wr-iframe {
    width: 100%;
  }
}
</style>
