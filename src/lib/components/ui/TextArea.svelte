<script lang="ts">
let { 
  label = 'Label', 
  value = $bindable(), 
  name = 'a', 
  error = '', 
  input = '', 
  requested = true,
  style = 'border',
  onchange = () => {},
  oninput = () => {},
  lowercase = false,
  capitalize = false,
  disabled = false,
} = $props();

function keyup(e: KeyboardEvent) {
  if (e.key !== 'Enter') {
    input = '';
  }
}

function onChange(e: Event) {
  input = '';
  onchange(e);
}

function onInput(e: Event) {
  oninput(e)
}

</script>

<div class="container-input">
  <div class="label">{label} <span class="requested">{requested ? '*' : ''}</span></div>
  <div class="inputText">
    <div class="wr-input">
      <textarea 
        autocomplete="off" 
        class="input"
        class:input-border={input !== name && style === 'border'} class:input-border-error={input === name && style === 'border'} 
        class:input-linear={input !== name && style === 'linear'} class:input-linear-error={input === name && style === 'linear'} 
        class:lowercase={lowercase}
        class:capitalize={capitalize}

        oninput={onInput}

        bind:value 
        {name} 
        onkeydown={keyup} 
        spellcheck="false" 
        onchange={onChange}
        {disabled}
        required></textarea>
    </div>
    <line class:display-none={style === 'border'}></line>

  </div>
  <div class="msg-error">
    {#if input === name}
      {error}
    {/if}
  </div>
</div>

<style>
textarea::-webkit-scrollbar {
  width: 10px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  cursor: default;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}
:global(.icon-form) {
  width: 30px;
  color: var(--color-icon-form);
}
:global {
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }
  .btn-search-input > svg {
    width: 20px;
    color: #333;
  }
}
.lowercase {
  text-transform: lowercase;
}
.capitalize {
  text-transform: capitalize;
}
.wr-input {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-input);
  border-radius: var(--border-radius);
  padding: 2px 2px 2px 0;
  transition: var(--transition);
}
.wr-input:focus-within {
  border: 1px solid #6049eb;
  box-shadow: 0px 0px 0px 4px rgba(119, 112, 255, 0.2);
}
.display-none {
  display: none;
}
:after, :before {
  box-sizing: border-box;
}
.inputText {
  position: relative;
  display: inline-block;
  width: 100%;
}
.inputText>line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-line-input);
  transform: scaleX(0);
  transition: transform 0.5s ease;
}

.inputText:focus-within>line {
  transform: scaleX(1);
}

.inputText:has(.input-linear-error)>line,
.inputText:has(.input-border-error)>line {
  background: var(--color-border-input-red);
}

.requested {
  color: var(--red);
}
.label {
  font-family: var(--font-normal);
  font-weight: 600;
  font-size: 1em;
  color: var(--color-label-input);
}
.input-linear {
  width: 100%;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  border-bottom: 1px solid var(--color-border-input);
  padding: 0.2em 0;
}
.input-linear-error {
  width: 100%;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  border-bottom: 1px solid var(--color-border-input-red);
  padding: 0.2em 0;
}
.input-linear-error:focus {
  border-bottom: 1px solid var(--color-border-input-red);
}
.input-border {
  width: 100%;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  /*border: 1px solid var(--color-border-input);*/
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
}
/*
.input-border:focus {
  border: 1px solid #6049eb;
  box-shadow: 0px 0px 0px 4px rgba(119, 112, 255, 0.2);
  transition: var(--transition);
}
*/
.input-border-error {
  width: 100%;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  border: 1px solid var(--color-border-input-red);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
  box-shadow: 0px 0px 0px 4px #ffdfd5;
}
.input-border-error:focus {
  border: 1px solid var(--color-border-input-red);
  box-shadow: 0px 0px 0px 4px #ffdfd5;
  transition: var(--transition);
}
.container-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}
.msg-error {
  width: 100%;
  height: 20px;
  font-size: 1em;
  color: var(--red);
  font-family: var(--font-normal);
}

.input::-webkit-outer-spin-button,
.input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input {
  line-height: 23px;
  color: var(--color);
  background: #fff;
  -moz-appearance: textfield;
  height: 50px;
  width: 100%;
  resize: none;
  background: transparent;
  height: var(--height-text-area);
}

@media(min-width: 700px) {
  .label {
    font-size: 0.8em;
  }
  .msg-error {
    font-size: 0.8em;
  }
}

</style>
