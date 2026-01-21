<script lang="ts">
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

let { pointsT = [] } = $props();
let points: Point[] = $state([]);

$effect(() => {
  points = pointsT;
});

function handleSelectWordFS(point: number, index: number) {
  points[point].answersFS.push(points[point].words[index]);
}
function handleSelectWordFSRemove(point: number, index: number) {
  points[point].answersFS.splice(index, 1);
}
</script>

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

        {#if qs.audio.length !== 0}
          <div class="wr-audio">
            <audio class="audio" src={qs.audio} controls></audio>
          </div>
        {/if}

        {#if qs.answersFS}
          <div class="container-answer-fs-rs">
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

<style>
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
  position: relative;
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
.container-activity {
  width: 100%;
  max-width: 500px;
}
.wr-image-question {
  width: 100%;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid #b5c7fb;
}
.image-question {
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
}
.audio {
  height: 40px;
}
.wr-audio {
  display: flex;
  justify-content: center;
  align-items: end;
  margin-top: 1em;
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
  min-height: 62px;
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
  font-size: 1.3em;
  background: #ffffff;
  box-shadow: rgb(155 161 177) 0px 4px 0px 0px;
  padding: 0 0.2em;
  border-radius: 6px;
  color: #4e5b69;
  font-weight: 800;
}
.answer-fs-rs {
  cursor: pointer;
  font-family: var(--font-normal);
  font-size: 1.6em;
  padding: 0 0.2em;
  border-radius: 6px;
  font-weight: 800;
  background: #fbfbfb;
  box-shadow: rgb(151 159 141) 0px 7px 0px 0px;
  color: #232b2a;
}
</style>
