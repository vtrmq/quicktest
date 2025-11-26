<script lang="ts">
  let { 
    label = 'Label', 
    value = $bindable(), 
    name = 'a', 
    error = '', 
    input = '', 
    requested = true,
    style = 'border',
    type = 'text',
    onchange = () => {},
    icon = '',
    lowercase = false,
    capitalize = false,
    disabled = false,
  } = $props();

  let _node: HTMLInputElement;
  let _type = $state(type);

  const changeInput = () => { 
    _type = _type === "text" ? "password" : "text"; 
    Type(_node);
  }

  function keyup(e: KeyboardEvent) {
    if (e.key !== 'Enter') {
      input = '';
    }
  }

  function Type(node: HTMLInputElement) {
    _node = node;
    switch (_type) {
      case 'text': node.type = "text"; break;
      case 'password': node.type = "password"; break;
      case 'number': node.type = "number"; break;
      case 'date': node.type = "date"; break;
      case 'email': node.type = "email"; break;
    }
  }

  function onChange() {
    input = '';
    onchange();
  }

</script>
<div class="container-input">
  <div class="label">{label} <span class="requested">{requested ? '*' : ''}</span></div>
  <div class="inputText">
    <div class="wr-input">
      {#if icon.length}
        <div class="icon" class:padding-left-icon-border={style === 'border'}>{@html icon}</div>
      {/if}
      <!-- class:input-date={type === 'date'} -->
      <input 
        use:Type
        autocomplete="off" 
        class="input"
        class:input-border={input !== name && style === 'border'} class:input-border-error={input === name && style === 'border' && icon.length === 0} 
        class:input-linear={input !== name && style === 'linear'} class:input-linear-error={input === name && style === 'linear' && icon.length === 0} 
        class:input-linear-error-icon={input === name && style === 'linear' && icon.length !== 0}
        class:input-border-error-icon={input === name && style === 'border' && icon.length !== 0}
        class:input-linear-error-x={input === name && style === 'linear' && icon.length !== 0}
        class:padding-right={type === 'password'} 
        class:padding-left={icon.length && style === 'linear'}
        class:padding-left-border={icon.length && style === 'border'}

        class:lowercase={lowercase}
        class:capitalize={capitalize}

        bind:value 
        {name} 
        onkeydown={keyup} 
        spellcheck="false" 
        onchange={onChange}
        {disabled}
        required>
      <button 
        class="btn-password"
        class:display-btn-passw={type === 'password'} 
        class:btn-svg-linear={style === 'linear'}
        class:btn-svg-border={style === 'border'}
        type="button" onclick={changeInput}>
        {#if _type === "password"}
          <svg class="eye" stroke-width="2" viewBox="0 0 24 24" fill="none"><path d="M12 14a2 2 0 100-4 2 2 0 000 4z" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 12c-1.889 2.991-5.282 6-9 6s-7.111-3.009-9-6c2.299-2.842 4.992-6 9-6s6.701 3.158 9 6z" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        {:else}
          <svg class="eye" stroke-width="2" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.5 10.677a2 2 0 002.823 2.823" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c4.008 0 6.701 3.158 9 6a15.66 15.66 0 01-1.078 1.5" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        {/if}
      </button>
      {#if type === 'date'}
        <div 
          class="wr-calendar"
          class:wr-calendar-linear={style === 'linear'}
          class:wr-calendar-border={style === 'border'}>
          <svg 
            class="calendar-icon" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      {/if}
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
:global(.icon-form) {
  width: 30px;
  color: var(--color-icon-form);
}
.lowercase {
  text-transform: lowercase;
}
.capitalize {
  text-transform: capitalize;
}
.input-linear-error-icon.input-linear-error-x {
  width: 100%;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  border-bottom: 1px solid var(--color-border-input-red);
  padding: 0.4em 0.5em;
  padding-left: 30px;
}
.input-linear-error-icon.input-linear-error-x:focus {
  border-bottom: 1px solid var(--color-border-input-red);
}
.input-linear-error-icon {
  padding: 0.4em 0.5em;
  padding-left: 30px;
  width: 100%;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  border-bottom: 1px solid var(--color-border-input);
}

.inputText:has(.input-linear-error-icon)>line,
.inputText:has(.input-border-error-icon)>line {
  background: var(--color-border-input-red);
}

.input-border-error-icon {
  padding: 0.4em 0.5em;
  padding-left: 40px;
  width: 100%;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  border: 1px solid var(--color-border-input-red);
  border-radius: var(--border-radius);
}
.input-border-error-icon:focus {
  border: 1px solid var(--color-border-input-red);
  box-shadow: 0px 0px 0px 4px #ffdfd5;
}


.icon.padding-left-icon-border {
  left: 10px;
}
.input-border.padding-left-border {
  padding-left: 40px;
}
.input-linear.padding-left {
  padding-left: 30px;
}
 .input-border.padding-left {
  padding-left: 30px;
}
.input-linear-error.padding-left {
  padding-left: 30px;
}
 .input-border-error.padding-left {
  padding-left: 30px;
}
.icon {
  position: absolute;
  background: transparent;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.eye {
  width: 22px;
  color: var(--color-icon-form);
}
.btn-password.display-btn-passw {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wr-input {
  position: relative;
  display: flex;
  align-items: center;
}
.btn-password {
  position: absolute;
  width: 36px;
  height: 30px;
  border-radius: var(--border-radius);
  background: transparent;
  cursor: pointer;
  display: none;
}
.btn-svg-linear {
  right: -7px;
}
.btn-svg-border {
  right: 3px;
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
  border: 1px solid var(--color-border-input);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
}
.input-border:focus {
  border: 1px solid #6049eb;
  box-shadow: 0px 0px 0px 4px rgba(119, 112, 255, 0.2);
  transition: var(--transition);
}
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
.input-border.padding-right, .input-linear.padding-right {
  padding-right: 40px;
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

.wr-calendar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90%;
  background: var(--bg-form);
  border-radius: var(--border-radius);
  pointer-events: none;
  z-index: 0;
}
.wr-calendar-linear {
  position: absolute;
  right: 0;
}
.wr-calendar-border {
  position: absolute;
  right: 3px;
  width: 37px;
}

.calendar-icon {
  pointer-events: none;
  color: var(--color-icon-form);
  width: 22px;
  z-index: 1;
}

.input::-webkit-outer-spin-button,
.input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input {
  color: var(--color);
  background: #fff;
  -moz-appearance: textfield;
  height: 50px;
}

/* Ocultar icono de calendario nativo */
/*
.input-date::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
  cursor: pointer;
  z-index: 2;
}
.input-date::-moz-calendar-picker-indicator {
  display: none;
}
.input-date {
  padding-right: 35px !important;
}
*/

@media(min-width: 700px) {
  /*
  .input {
    padding: 0.4em 0;
  }
  */
  .label {
    font-size: 0.8em;
  }
  .msg-error {
    font-size: 0.8em;
  }
}

</style>
