<script lang="ts">
import { ALFABETO } from '$lib/utils';
import { page } from '$app/state';
import { HeaderExercise, EditExercise, LinkBack, BtnAudio } from '$lib/components';
import { filtrarParametros } from '$lib/utils';

type Item = {
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
}

let { data } = $props();
console.log(data)
let items = data.items;
let type = $state('info');
let points: Point[] = $state([]);
let idPoint = $state(-1);

const root = filtrarParametros(page.url.href, ['topicId']);

function handleActivity(index: number, _items: Item[]) {
  if (index !== -1) {
    type = _items[index].type;
    points = _items[index].points;
    console.log($state.snapshot(points));
  } else if (index === -1) {
    type = 'info';
  }
}

function handleSelectWordFS(point: number, index: number) {
  points[point].answersFS.push(points[point].words[index]);
}

function handleSelectWordFSRemove(point: number, index: number) {
  points[point].answersFS.splice(index, 1);
}

/*
function hablar(texto: string) {
  // Verificar si el navegador soporta la API
  if ('speechSynthesis' in window) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    
    console.log(texto)
    // Configurar el idioma a inglés
    mensaje.lang = 'en-US';
    
    // Opcional: ajustar velocidad y tono
    mensaje.rate = 1; // Velocidad normal (0.1 a 10)
    mensaje.pitch = 1; // Tono (0 a 2)

    // Reproducir el audio
    window.speechSynthesis.speak(mensaje);
  } else {
    console.log("Tu navegador no soporta texto a voz.");
  }
}
*/

function hablar(texto: string) {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'en-US';
  //utterance.lang = 'el';
  utterance.rate = 0.6;      // Velocidad (0.1 a 10)
  utterance.pitch = 1;     // Tono (0 a 2)
  utterance.volume = 1;    // Volumen (0 a 1)
  utterance.onend = function() {
    idPoint = -1;
  };
  speechSynthesis.speak(utterance);
}

function handleAudio(point: number) {
  const texto = String(points[point].text);
  hablar(texto);
  idPoint = point;
}
</script>

<HeaderExercise>
  <LinkBack href="/teacher/topic/activity?{root}" --color-link="#fff">Actividades</LinkBack>
  <EditExercise topic={data.topic} activity={data.activity} items={items} {handleActivity} />
</HeaderExercise>

<div class="container-body">

  {#if type === 'info'}

    <div class="container-info">
      <h1 class="topic">{data.topic}</h1>
      <h2 class="activity">{data.activity}</h2>
    </div>

  {:else if type === 'test'}

    <div class="container-activity">
      {#each points as qs, point}
        <div class="container-question">
          <div class="wr-point-number"><div class="point-number">{point + 1}</div></div>
          <div class="question">{qs.question}</div>

          {#if qs.images.length !== 0}
            <div class="container-images-question">
              {#each qs.images as img, i}
                <div class="box-image-question">
                  <div class="wr-image-question">
                    <img class="image-question" src={img} alt="" />
                  </div>
                  {#if qs.images.length > 1}
                    <div class="label-image">Imagen {ALFABETO(i + 1)}</div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <div class="container-items-answer">
            {#each qs.answers as answer, index}
              <div class="container-answer" class:rst-point={answer.rst}>
                <div class="wr-label-point"><div class="label-resp" class:rst-point={answer.rst}>Respuesta {index + 1}</div></div>
                {#if answer.image.length !== 0}
                  <div class="wr-image-question">
                    <img class="image-question" src={answer.image} alt="" />
                  </div>
                {/if}
                <div class="wr-input-item">
                  <div class="answer-item">{answer.resp}</div>
                </div>
              </div>
            {/each}
          </div>
          
        </div>
      {/each}
    </div>

  {:else if type === 'test-fs'}

    <div class="container-activity">
      {#each points as qs, point}
        <div class="container-question">
          <div class="wr-point-number"><div class="point-number">{point + 1}</div></div>
          
          <div class="wr-container-box-fs">
            {#if qs.image.length !== 0}
              <div class="box-image-question">
                <div class="wr-image-question">
                  <img class="image-question" src={qs.image} alt="" />
                </div>
              </div>
            {/if}

            <div class="wr-btn-audio"><BtnAudio sw={point === idPoint} onclick={()=>handleAudio(point)} /></div>

            {#if qs.answersFS}
              <div class="container-answer-fs-rs">
                {#each qs.answersFS as word, index}
                  <button class="answer-fs" onclick={()=>handleSelectWordFSRemove(point, index)}>{word.word}</button>
                {/each}
              </div>
            {/if}

            {#if qs.words.length !== 0}
              <div class="container-answer-fs">
                {#each qs.words as word, index}
                  <button class="answer-fs" onclick={()=>handleSelectWordFS(point, index)}>{word.word}</button>
                {/each}
              </div>
            {/if}

          </div>

        </div>
      {/each}
    </div>

  {/if}
</div>

<style>
.wr-btn-audio {
  display: flex;
  justify-content: center;
}
.wr-container-box-fs {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 2em;
}
.container-answer-fs-rs {
  display: flex;
  gap: 0.8em;
  justify-content: center;
  padding: 1em 0.5em 1em;
  background: #c5eb98;
  box-shadow: #98c95d 0px 7px 0px 0px;
  border-radius: var(--border-radius);
  flex-wrap: wrap;
}
.container-answer-fs {
  display: flex;
  gap: 0.8em;
  justify-content: center;
  padding: 1em 0.5em 1em;
  background: var(--border-item);
  box-shadow: rgb(161 178 225) 0px 7px 0px 0px;
  border-radius: var(--border-radius);
  flex-wrap: wrap;
}
.answer-fs {
  cursor: pointer;
  font-family: var(--font-normal);
  font-size: 1.6em;
  background: #ffffff;
  box-shadow: rgb(155 161 177) 0px 7px 0px 0px;
  padding: 0 0.2em;
  border-radius: 6px;
  color: #4e5b69;
  font-weight: 800;
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
.wr-input-item {
  position: relative;
  display: flex;
  align-items: center;
  /*border: 1px solid var(--color-border-input);*/
  border-radius: var(--border-radius);
  padding: 2px 3px 2px 0;
  transition: var(--transition);
  background: #fff;
  border: 1px solid #fff;
}
.answer-item {
  width: 100%;
  resize: none;
  background: transparent;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
  line-height: 28px;
}
.wr-label-point {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  top: -22px;
  left: 0;
}
.label-resp {
  background: var(--border-item);
  font-family: var(--font-normal);
  font-size: 0.88em;
  padding: 5px 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  transition: var(--transition);
}
.label-resp.rst-point {
  background: #11d511;
}
.container-answer {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  background: var(--border-item);
  padding: 8px;
  border-radius: var(--border-radius);
  position: relative;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: rgb(161 178 225) 0px 7px 0px 0px;
}
.container-answer.rst-point {
  background: #11d511;
  box-shadow: rgb(0 167 0) 0px 7px 0px 0px;
}
.container-items-answer {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 3em;
}
.image-question {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
}
.wr-image-question {
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid #b5c7fb;
}
.container-images-question {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding-bottom: 2em;
}
.question {
  font-family: var(--font-normal);
  padding-bottom: 2em;
  line-height: 28px;
  font-size: var(--font-size);
}
.container-activity {
  width: 100%;
  max-width: 500px;
}
.container-question {
  padding: 0.5em 0;
}
.wr-point-number {
  display: flex;
  justify-content: center;
  background: #93deff;
  height: 1px;
  align-items: center;
  margin: 1em 0 2em;
}
.point-number {
  background: #93deff;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  font-family: var(--font-normal);
  font-weight: 600;
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
