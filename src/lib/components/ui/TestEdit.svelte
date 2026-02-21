<script lang="ts">
import { fade } from 'svelte/transition';
import reading from '$lib/assets/images/reading.png';
import { ALFABETO } from '$lib/utils';

type Point = {
  answers: [{resp: string, image: string, rst: boolean, rss: boolean, word: string }]; 
  images: []; 
  question: '';
  value: number;
}
type InfoData = {
  mode: string;
  visible: boolean;
  time: number;
}

let points: Point[] = $state([]);
let { activity = {}, infoData } = $props();
let _infoData: InfoData = $state({mode: '', visible: false, time: 0});
let progressElement: HTMLProgressElement = $state() as HTMLProgressElement;
let requestID: number = 0;
let durationInSeconds = 0;

$effect(() => {
  _infoData = infoData;
  points = activity.points;
});

function handleStartLecture() {
  //console.log($state.snapshot(_infoData))
  _infoData.visible = false;
  durationInSeconds = _infoData.time;
  //startProgress(timeActivity);
  requestID = requestAnimationFrame(startProgress);
}

function startProgress() {
  const durationInMs = durationInSeconds * 1000;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;

    // Calculamos el progreso (de 0 a 1)
    const progress = Math.min(elapsed / durationInMs, 1);

    // El elemento <progress> usa valores de 0 a 100 (o el 'max' definido)
    if (!progressElement) {
      cancelAnimationFrame(requestID); // Detiene la ejecución en el navegador
      requestID = 0;
      return;
    }
    progressElement.value = progress * 100;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      //console.log("¡Actividad completada!");
      cancelAnimationFrame(requestID); // Detiene la ejecución en el navegador
      requestID = 0;
      _infoData.mode = 'normal';
    }
  }

  requestAnimationFrame(update);
}

</script>


<div class="rf-test">
  {#if infoData.mode === 'normal'}

    <div class="center-exercise-test">


      <div class="container-activity-test">
        <h1 class="question-test-test">{activity.question}</h1>
        {#each points as qs, point}
          <div class="container-question-test">
            <div class="wr-point-number-test"><div class="point-number-test">{point + 1}</div></div>
            <div class="question-test">{qs.question}</div>

            {#if qs.images.length !== 0}
              <div class="container-images-question-test">
                {#each qs.images as img, i}
                  <div class="box-image-question-test">
                    <div class="wr-image-question-test">
                      <img class="image-question-test" src={img} alt="" />
                    </div>
                    {#if qs.images.length > 1}
                      <div class="label-image-test">Imagen {ALFABETO(i + 1)}</div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}

            <div class="container-items-answer-test">
              {#each qs.answers as answer, index}
                <div class="container-answer-test" class:rst-point-test={answer.rst}>
                  <div class="wr-label-point-test"><div class="label-resp-test" class:rst-point-test={answer.rst}>Respuesta {index + 1}</div></div>
                  {#if answer.image.length !== 0}
                    <div class="wr-image-answer-test">
                      <img class="image-question-test" src={answer.image} alt="" />
                    </div>
                  {/if}
                  <div class="wr-input-item-test">
                    <div class="answer-item-test">{answer.resp}</div>
                  </div>
                </div>
              {/each}
            </div>

          </div>
        {/each}
      </div>
    </div>

  {:else if _infoData.mode === 'lecture' && _infoData.visible === true} <!-- Mensaje inicio de lectura -->

    <div class="box-info-lecture-test">
      <h2 class="label-h2-test">Comprensión de lectura</h2>
      <p class="title-lecture-test">Título: {activity.question}</p>
      <div class="wr-img-lecture-test"><img src={reading} alt="" /></div>
      <button class="btn-start-lecture-test" onclick={handleStartLecture}>Iniciar actividad</button>
    </div>

  {:else if _infoData.mode === 'lecture' && _infoData.visible === false} <!-- Muestra la lectura -->

    <div class="center-exercise-test-test">
      <div class="wrapper-lecture-test" transition:fade>
        <progress bind:this={progressElement} class="progress-test progresbar-test" id="myProgress" value="0" max="100" style="width: 100%;"></progress>
        <h2 class="title-lecture-test">{activity.question}</h2>
        <p class="p-lecture-test">{activity.content}</p>
        <button class="btn-break-test" onclick={()=>_infoData.mode = 'normal'}>Saltar</button>
      </div>
    </div>

  {/if}
</div>

<!--
<style>
progress {
  appearance: none;       /* Quita el estilo nativo */
  -webkit-appearance: none;
  width: 100%;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

/* Fondo de la barra (el contenedor) */
progress::-webkit-progress-bar {
  background-color: #ffffff; /* Blanco */
}

/* Color de la barra de carga (Relleno) */
progress::-webkit-progress-value {
  background-color: #007bff; /* Azul */
  transition: width 0.1s ease; /* Suaviza el movimiento */
}

/* Compatibilidad para Firefox */
progress::-moz-progress-bar {
  background-color: #007bff; /* Azul */
}

.progresbar {
  position: absolute;
  top: -3px;
  background: aqua;
  width: 100%;
  left: 0;
  height: 9px;
}
.btn-break {
  font-family: var(--font-normal);
  padding: 0.6em 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-size: 1em;
  background: var(--bg-blue);
  color: #fff;
  transition: var(--transition);
  margin-top: 1em;
}
.btn-break:hover {
  background: var(--bg-blue-hover);
}
.rf {
  width: 100%;
  height: 100%;
  position: relative;
}
.center-exercise {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  top: 0;
  position: absolute;
}
.title-lecture {
  font-family: var(--font-normal);
  font-size: 1.2em;
  padding-bottom: 1em;
  line-height: 28px;
}
.wrapper-lecture {
  width: 100%;
  max-width: 500px;
  border: 2px solid var(--bg-header-synt);
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: var(--border-radius);
  overflow-y: auto;
  height: calc(100% - calc(var(--height-header) + -60px));
  top: 0;
  position: absolute;
}
.p-lecture {
  font-family: var(--font-normal);
  line-height: 34px;
  font-size: 1em;
}
.box-info-lecture {
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  padding-bottom: 2em;
}
.label-h2 {
  font-family: var(--font-normal);
  font-weight: 800;
}
.title-lecture {
  font-family: var(--font-normal);
  font-size: 1.2em;
  padding-bottom: 1em;
  line-height: 28px;
}
.wrapper-lecture {
  width: 100%;
  max-width: 500px;
  border: 2px solid var(--bg-header-synt);
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: var(--border-radius);
  overflow-y: auto;
  height: calc(100% - calc(var(--height-header) + -60px));
  top: 0;
  position: absolute;
}
.p-lecture {
  font-family: var(--font-normal);
  line-height: 34px;
  font-size: 1em;
}
.box-info-lecture {
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  padding-bottom: 2em;
}
.label-h2 {
  font-family: var(--font-normal);
  font-weight: 800;
}
.wr-img-lecture {
  width: 200px;
  height: 200px;
}
.wr-img-lecture > img {
  width: 100%;
  height: 100%;
}
.btn-start-lecture {
  font-family: var(--font-normal);
  padding: 0.6em 1em;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  font-size: 1em;
  background: var(--bg-blue);
  color: #fff;
  transition: var(--transition);
}
.btn-start-lecture:hover {
  background: var(--bg-blue-hover);
}


/* ================================== */

.wr-input-item {
  position: relative;
  display: flex;
  align-items: center;
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
  border-radius: var(--border-radius);
}
.wr-image-question {
  width: 100%;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  padding: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.wr-image-answer {
  width: 100%;
  height: 380px;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
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
.question-test {
  font-family: var(--font-normal);
  padding-bottom: 2em;
  line-height: 28px;
  font-size: 1.2em;
}
.container-activity {
  width: 100%;
  max-width: 500px;
  padding-bottom: 6em;
  position: absolute;
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
  width: 39px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  font-family: var(--font-normal);
  font-weight: 600;
  box-shadow: #43aad7 0px 4px 0px 0px;
}
</style>
-->
