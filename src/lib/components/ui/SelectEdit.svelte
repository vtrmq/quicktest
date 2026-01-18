<script lang="ts">
import { Toast } from '$lib/components';
import { colors } from '$lib/utils';
import { activityLocalstore } from '$lib/store/activity';

type Option = {
  option: string;
};

type Word = {
  color: string;
  errors: number;
  resp: boolean;
  resp_color: string;
  selection_word: number;
  sign: number;
  type: string;
  value: boolean;
  word: string;
};

let { activity, indexExercise = -1 } = $props();
let toast = $state<Toast>();
let question = $state('');
let options: Option[] = $state([]);
let indexOptWord = $state(-1);
let words: Word[] = $state([]);

$effect(() => {
  question = activity.question;
  words = activity.words;
  options = activity.optionSuboptions;
  indexOptWord = -1;
});

// =============================================

let index_word = 0;
let selected_color = colors[0];

function handleSelectWord(index: number) {
  index_word = index;

  if (options.length === 0) {

    // Si no tiene opciones para elegir
    words[index].value = !words[index].value;
    if (words[index].value) {
      words[index].color = selected_color;
    } else {
      words[index].color = "";
    }

    let wd = JSON.parse(JSON.stringify(words[index]))
    activityLocalstore.wordSelect(indexExercise, index, wd);

  } else {
    // Si tiene opciones para elegir
    // Si no se ha seleccionado una de las opciones y la palabra tiene información

    if (indexOptWord === -1 && words[index].value === false) {
      toast?.view({
        type: 'fail',
        message: 'Selecciona una opción',
        time: 3500
      });
      return;
    } else if (indexOptWord === -1 && words[index].value === true) {
      words[index].color = "";
      words[index].selection_word = -1;
      words[index].value = false;
      let wd = JSON.parse(JSON.stringify(words[index]))
      activityLocalstore.wordSelect(indexExercise, index, wd);
      return;
    }

    words[index].value = !words[index].value;
    if (words[index].value) {
      words[index].color = colors[indexOptWord];
      words[index].selection_word = indexOptWord;
    } else {
      words[index].color = "";
      words[index].selection_word = -1;
    }
    let wd = JSON.parse(JSON.stringify(words[index]))
    activityLocalstore.wordSelect(indexExercise, index, wd);

  }
}

function handleSelectOptWord(index: number) {
  indexOptWord = indexOptWord === -1 || indexOptWord !== index ? index : -1;
}
</script>

<Toast bind:this={toast} />

<div class="body-exercise-select user-select-none" class:grid-select={options.length}>

  <div class="box1-select">
    <h1 class="title-select">{question}</h1>
    <div class="container-words-select">
      {#each words as w, index}
        {@const type = index < words.length - 1 ? words[index + 1].type : words[index].type}
        {#if w.word === "\n" && w.type === "x"}
          <div class="break"></div>
        {:else}
          {#if w.type === "w" && w.sign === 0}
            <span 
              class="word-select pointer normal-word-select {w.color}" 
              onclick={()=>handleSelectWord(index)} role="button" tabindex="0" onkeypress={() => {}}>{w.word}</span>
          {:else if type === "s" && w.type === "w" && w.sign === 3}
            <div class="flex-select word-select">
              <span 
                class="fnt-select pointer last-word-select {w.color}" 
                onclick={()=>handleSelectWord(index)} role="button" tabindex="0" onkeypress={() => {}}>{w.word}</span>
              <span class="sign-select">{words[index + 1].word}</span>
              <span class="sign-select">{words[index + 2].word}</span>
            </div>
          {:else if type === "s" && w.type === "w" && w.sign === 2}
            {#if index < words.length - 1}
              <div class="flex-select word-select">
                <span 
                  class="fnt-select pointer last-word-select {w.color}" 
                  onclick={()=>handleSelectWord(index)} role="button" tabindex="0" onkeypress={() => {}}>{w.word}</span>
                <span class="sign-select">{words[index + 1].word}</span>
              </div>
            {/if}
          {:else if type === "s" && w.type === "w" && w.sign === 4}
            <div class="flex-select word-select">
              <span class="sign-l-select">{words[index - 1].word}</span>
              <span 
                class="fnt-select pointer last-word-l-select {w.color}" 
                onclick={()=>handleSelectWord(index)} role="button" tabindex="0" onkeypress={() => {}}>{w.word}</span>
              <span class="sign-l-select">{words[index + 1].word}</span>
            </div>
          {:else if w.type === "w" && w.sign === 1}
            <div class="flex-select word-select">
              <span class="sign-l-select">{words[index - 1].word}</span>
              <span 
                class="fnt-select pointer last-word-l-select {w.color}" 
                onclick={()=>handleSelectWord(index)} role="button" tabindex="0" onkeypress={() => {}}>{w.word}</span>
            </div>
          {/if}
        {/if}
      {/each}
    </div>

  </div>

  {#if options.length}
    <div class="box2-select">
      <div class="bx-select">
        {#each options as opt, index}
          <button class="w-opt-select {colors[index]}" class:border-word-x-select={indexOptWord === index} 
            onclick={()=>handleSelectOptWord(index)}>{opt.option}</button>
        {/each}
      </div>
    </div>
  {/if}

</div>
