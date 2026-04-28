<script lang="ts">
import { Toast, Dialog, BtnChangeResult } from '$lib/components';
import { colors } from '$lib/utils';
import { activityLocalstore } from "$lib/store/activity_student";

type CharacterPart = {
  br: boolean;
  char: string;
  show: boolean;
  word: string;
  errors: string[];
};
type Word = {
  characters: CharacterPart[];
  type: string;
  word: string;
};

let { 
  viewResult = 0, 
  infoData, 
  indexExercise = -1, 
  scales, 
  typeGeneral,
  handleChangeResultView,
} = $props();
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let question = $state('');
let words: Word[] = $state([]);
let options: string[] = $state([]);
let indexOptWord = $state(-1);

//console.log($state.snapshot(infoData))
//console.log($state.snapshot(typeGeneral))

question = infoData.exercise.question;
words = infoData.exercise.words;
options = infoData.exercise.options;

function handleSelectWordCharacter(index: number, ix: number) {
  if (viewResult === 1) {
    toast?.view({
      type: '',
      message: 'Estás en modo resultados',
      time: 3000
    });
    return;
  }
  if (indexOptWord === -1) {
    toast?.view({
      type: '',
      message: 'Selecciona una opción',
      time: 2500
    });
    return;
  }

  let word = words[index].characters[ix].char.toLowerCase();
  let option = options[indexOptWord];

  let char = words[index].characters[ix].char;

  words[index].characters[ix].show = true;
  words[index].characters[ix].word = char.toLowerCase() === option.toLowerCase() ? char : option;

  if (word !== option.toLowerCase()) {
    const optionToLower = option.toLowerCase();
    const yaExiste = words[index].characters[ix].errors.some(item => item.toLowerCase() === optionToLower);
    if (!yaExiste) {
      words[index].characters[ix].errors.push(optionToLower);
    }
  }
  let wordsErrors = [];
  let totalPoints = 0;
  let sumPoints = 0;

  for (let i = 0; i < words.length; i++) {
    if (words[i].type === 'r' && words[i].characters.length !== 0) {
      for (let j = 0; j < words[i].characters.length; j++) {
        if (words[i].characters[j].br) {
          totalPoints = totalPoints + 1;
          if (words[i].characters[j].errors.length !== 0) {
            wordsErrors.push(...words[i].characters[j].errors);
          }
          if (words[i].characters[j].word.length !== 0 && (words[i].characters[j].word.toLowerCase() === words[i].characters[j].char.toLowerCase())) {
            sumPoints = sumPoints + 1;
          }
        }
      }
    }
  }

  activityLocalstore.characterPart(indexExercise, JSON.stringify(words), JSON.stringify(wordsErrors), totalPoints, sumPoints, scales);
}

function handleSelectOptWord(index: number) {
  if (viewResult === 1) {
    toast?.view({
      type: '',
      message: 'Estás en modo resultados',
      time: 3000
    });
    return;
  }
  indexOptWord = index;
}

</script>

<Dialog bind:this={dialog} action={()=>{}} />
<Toast bind:this={toast} />

<div class="rf-character">

  <div class="center-exercise-character">
    <div class="body-exercise-select user-select-none grid-select">

      <div class="box1-select">
        {#if typeGeneral === 'R'}
          <BtnChangeResult onclick={()=>handleChangeResultView()} {viewResult} />
        {/if}
        <h1 class="title-select">{question}</h1>
        <div class="container-words-character">

          <div class="container-words-part">

            {#each words as w, index}
              {@const type = index < words.length - 1 ? words[index + 1].type : words[index].type}
              {#if w.word === "\n" && w.type === "x"}
                <div class="break-part"></div>
              {:else}

                {#if type !== "s" && w.type === "w"}
                  <span 
                    class="word-character pointer normal-word-character">{w.word}</span>
                {:else if type !== "s" && w.type === "r"}
                  <div class="chr"> 
                    {#each w.characters as chars, ix}
                      {#if chars.br}
                        <span 
                          class="word-character pointer normal-word-ry raya-character-part" 
                          class:item-bad-character={(chars.char.toLowerCase() !== chars.word.toLowerCase()) && viewResult === 1}
                          onclick={()=>handleSelectWordCharacter(index, ix)} 
                          role="button" tabindex="0" onkeypress={() => {}}>
                          {@html chars.show ? chars.word : "&nbsp;&nbsp;&nbsp;"}
                        </span>
                      {:else}
                        <span 
                          class="word-character pointer normal-word-ry" class:raya-character-part={chars.br}>{chars.char}</span>
                      {/if}
                    {/each}
                  </div>
                {:else if w.type === "r" && type === "s"}
                  <div class="flex-part word-character">
                    <div class="chrf"> 
                      {#each w.characters as chars, ix}
                      {#if chars.br}
                          <span 
                            class="word-character pointer normal-word-ry raya-character-part" 
                            class:item-bad-character={(chars.char.toLowerCase() !== chars.word.toLowerCase()) && viewResult === 1}
                            onclick={()=>handleSelectWordCharacter(index, ix)} role="button" tabindex="0" onkeypress={() => {}}>
                            {@html chars.show ? chars.word : "&nbsp;&nbsp;&nbsp;"}
                          </span>
                      {:else}
                        <span 
                          class="word-character pointer normal-word-ry" class:raya-character-part={chars.br}>{chars.char}</span>
                      {/if}
                      {/each}
                    </div>
                    <span class="sign-part">{words[index + 1].word}</span>
                  </div>
                {:else if w.type === "w" && type === "s"}
                  {#if index < words.length - 1}
                    <div class="flex-part word-character">
                      <span 
                        class="fnt-character pointer last-word-character">{w.word}</span>
                      <span class="sign-part">{words[index + 1].word}</span>
                    </div>
                  {/if}
                {/if}

              {/if}
            {/each}

          </div>


        </div>
      </div>

      {#if options.length}
        <div class="box2-select">
          <div class="bx-select">
            {#each options as opt, index}
              <button class="w-opt-select {colors[index]}" class:border-word-x-select={indexOptWord === index} onclick={()=>handleSelectOptWord(index)}>
                {opt !== 'i' ? opt : 'I'}
              </button>
            {/each}
          </div>
        </div>
      {/if}

    </div>
  </div>

</div>

<style>
.break-part {
  height: 13px;
  width: 100%;
}
.sign-part {
  padding-right: 4px;
  padding-top: 2px;
}
.raya-character-part {
    border-bottom: 2px solid #333;
    min-width: 35px;
}
.chr {
  padding: 0.25em 0.2em 0.2em;
}
.container-words-part {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.word-character {
  margin-bottom: 0.4em;
  font-size: 1.1em;
  position: relative;
}
.normal-word-character {
  padding: 0.2em;
}
.normal-word-ry {
  text-align: center;
}
.chrf {
  padding: 0.3em 0 0.2em 0.2em;
}
.last-word-character {
  padding: 0.2em 0 0.2em 0.2em;
  border-radius: 4px;
}
.flex-part {
  display: flex;
  align-items: center;
}
</style>
