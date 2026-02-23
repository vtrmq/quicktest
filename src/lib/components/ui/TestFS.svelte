<script lang="ts">
import { activityLocalstore } from "$lib/store/activity_student";
import { corregirIEnFrase } from '$lib/utils';

type Words = {
  id: number;
  word: string;
};
type Point = {
  words: Words[];
  image: ''; 
  answersFS: [{id: number, word: string;}];
  audio: string;
}

let { viewResult = 0, infoData, indexExercise = -1, scales, type_activity, isActionStudent = true } = $props();
let points: Point[] = $state([]);

points = infoData.exercise.points;

function handleSelectWordFS(point: number, index: number) {
  if (isActionStudent === false) return;
  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }
  if (viewResult === 1) return;
  points[point].answersFS.push(points[point].words[index]);
  activityLocalstore.testFS(indexExercise, JSON.stringify(points), scales);
}
function handleSelectWordFSRemove(point: number, index: number) {
  if (isActionStudent === false) return;
  if (type_activity === 'V') {
    const time = activityLocalstore.getTime();
    if (time !== null && time.min === 0 && time.seg === 0) {
      return;
    }
  }
  if (viewResult === 1) return;
  points[point].answersFS.splice(index, 1);
  activityLocalstore.testFS(indexExercise, JSON.stringify(points), scales);
}
</script>

<div class="container-activity-fs">

  <h1 class="title-fs">{infoData.exercise.content}</h1>

  {#each points as qs, point}
    <div class="container-question-fs">
      <div class="wr-point-number-fs"><div class="point-number-fs">{point + 1}</div></div>

      <div class="wr-container-box-fs">
        {#if qs.image.length !== 0}
          <div>
            <div class="wr-image-question-fs">
              <img class="image-question-fs" src={qs.image} alt="" />
            </div>
          </div>
        {/if}

        {#if qs.audio.length !== 0}
          <div class="wr-audio-fs">
            <audio class="audio-fs" src={qs.audio} controls></audio>
          </div>
        {/if}

        {#if qs.answersFS}
          {@const orden = qs.answersFS.every((obj, i) => i === 0 || obj.id >= qs.answersFS[i - 1].id)}
          <div class="container-answer-fs-rs" class:rst-bad={!orden && viewResult === 1 || ((qs.answersFS.length !== qs.words.length) && viewResult === 1)}>
            {#each qs.answersFS as word, index}
              <button class="answer-fs-rs" onclick={()=>handleSelectWordFSRemove(point, index)}>{word.word}</button>
            {/each}
          </div>
        {/if}

        {#if qs.words.length !== 0}
          <div class="container-answer-fs">
            {#each qs.words as word, index}
              <button class="answer-fs" onclick={()=>handleSelectWordFS(point, index)}>{corregirIEnFrase(word.word)}</button>
            {/each}
          </div>
        {/if}

      </div>

    </div>
  {/each}
</div>
