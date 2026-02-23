<script lang="ts">
import { fade } from 'svelte/transition';
import reading from '$lib/assets/images/reading.png';
import { ALFABETO } from '$lib/utils';
import { activityLocalstore } from "$lib/store/activity_student";

type Point = {
  answers: [{resp: string, image: string, rst: boolean, rss: boolean, word: string }]; 
  images: []; 
  question: '';
  value: number;
}

let points: Point[] = $state([]);

let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true } = $props();

(()=>{
  console.log($state.snapshot(infoData))
})();

let progressElement: HTMLProgressElement = $state() as HTMLProgressElement;
let requestID: number = 0;
let durationInSeconds = 0;

let visible = $state(false);
let time = $state(-1);
let mode = $state('');

points = infoData.exercise.points;
visible = infoData.visible;
time = infoData.time;
mode = infoData.mode;

function handleStartLecture() {
  visible = false;
  durationInSeconds = time;
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
      mode = 'normal';
    }
  }

  requestAnimationFrame(update);
}

function handleSelectItem(point: number, index: number) {
  if (isActionStudent === false) return;
  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }
  if (viewResult === 1) return;
  points[point].answers[index].rss = !points[point].answers[index].rss;
  activityLocalstore.test(indexExercise, JSON.stringify(points), scales);
}

</script>


<div class="rf-test">
  {#if mode === 'normal'}

    <div class="center-exercise-test">


      <div class="container-activity-test">
        <h1 class="question-test-test">{infoData.exercise.question}</h1>
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
                <div 
                  class="container-answer-test" 
                  class:rst-point-test={(answer.rss && viewResult === 0) || (answer.rss === true && answer.rst === true && viewResult === 1)} 
                  class:item-bad-test={((answer.rss === true && answer.rst === false)) && viewResult === 1} 
                  class:item-rst-test={((answer.rss === false && answer.rst === true && isActionStudent === false) && viewResult === 1)} 
                  onclick={()=>handleSelectItem(point, index)} 
                  onkeyup={()=>{}} role="button" tabindex="0">
                  <div class="wr-label-point-test">
                    <div class="label-resp-test" 
                      class:rst-point-test={(answer.rss && viewResult === 0) || (answer.rss === true && answer.rst === true && viewResult === 1)} 
                      class:item-bad-test={(answer.rss === true && answer.rst === false) && viewResult === 1} 
                      class:item-rst-test={((answer.rss === false && answer.rst === true && isActionStudent === false) && viewResult === 1)} 
                    >Respuesta {index + 1}</div>
                  </div>
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

  {:else if mode === 'lecture' && visible} <!-- Mensaje inicio de lectura -->

    <div class="box-info-lecture-test">
      <h2 class="label-h2-test">Comprensión de lectura</h2>
      <p class="title-lecture-test">Título: {infoData.exercise.question}</p>
      <div class="wr-img-lecture-test"><img src={reading} alt="" /></div>
      <button class="btn-start-lecture-test" onclick={handleStartLecture}>Iniciar actividad</button>
    </div>

  {:else if mode === 'lecture' && !visible} <!-- Muestra la lectura -->

    <div class="center-exercise-test">
      <div class="wrapper-lecture-test" transition:fade>
        <progress bind:this={progressElement} class="progress-test progresbar-test" id="myProgress" value="0" max="100" style="width: 100%;"></progress>
        <h2 class="title-lecture-test">{infoData.exercise.question}</h2>
        <p class="p-lecture-test">{infoData.exercise.content}</p>
      </div>
    </div>

  {/if}
</div>
