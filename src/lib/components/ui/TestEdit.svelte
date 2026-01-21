<script lang="ts">
import { ALFABETO } from '$lib/utils';
type Words = {
  id: number;
  word: string;
};
type Point = {
  answers: [{resp: '', image: '', rst: false, rss: false, word: '' }]; 
  images: []; 
  words: Words[];
  question: '';
  text: number;
}
let points: Point[] = $state([]);
let { pointsT = [] } = $props();
$effect(() => {
  points = pointsT;
});
</script>

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
              <div class="wr-image-answer">
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

<style>

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
</style>
