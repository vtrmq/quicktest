<script lang="ts">
import { colors } from '$lib/utils';

type CharacterPart = {
  br: boolean;
  char: string;
};
type Word = {
  characters: CharacterPart[];
  resp: boolean;
  type: string;
  word: string;
};

let { activity } = $props();
let question = $state('');
let options: string[] = $state([]);
let words: Word[] = $state([]);

$effect(() => {
  question = activity.question;
  words = activity.words;
  options = activity.options;
  //console.log($state.snapshot(activity))
});

</script>

<div class="rf-character">
  <div class="center-exercise-character">
    <div class="body-exercise-select user-select-none" class:grid-select={options.length}>

      <div class="box1-select">
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
                    {#each w.characters as chars}
                      <span 
                        class="word-character pointer normal-word-ry" class:raya-character-part={chars.br}>{chars.char}</span>
                    {/each}
                  </div>
                {:else if w.type === "r" && type === "s"}
                  <div class="flex-part word-character">
                    <div class="chrf"> 
                      {#each w.characters as chars}
                        <span 
                          class="word-character pointer normal-word-ry" class:raya-character-part={chars.br}>{chars.char}</span>
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
              <button class="w-opt-select {colors[index]}">{opt !== 'i' ? opt : 'I'}</button>
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
  padding-top: 8px;
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
  padding: 0.5em 0 0.2em 0.2em;
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
