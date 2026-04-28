<script lang="ts">
import { marked } from 'marked';
import { fade } from 'svelte/transition';
import reading from '$lib/assets/images/reading.png';
import { ALFABETO, R2_DOMAIN, FOLDER_IMAGES } from '$lib/utils';

type Point = {
  errors: 0;
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
const root_image = `${R2_DOMAIN}/${FOLDER_IMAGES}`;

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
            <div class="question-test">{@html marked(qs.question)}</div>

            {#if qs.images.length !== 0}
              <div class="container-images-question-test">
                {#each qs.images as img, i}
                  <div class="box-image-question-test">
                    <div class="wr-image-question-test">
                      <img class="image-question-test" src="{root_image}/{img}" alt="" />
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
                      <img class="image-question-test" src="{root_image}/{answer.image}" alt="" />
                    </div>
                  {/if}
                  <div class="wr-input-item-test">
                    <div class="answer-item-test">{@html marked(answer.resp)}</div>
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
