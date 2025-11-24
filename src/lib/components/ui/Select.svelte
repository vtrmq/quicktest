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
    children,
  } = $props();

  function onChange() {
    input = '';
    onchange();
  }

</script>
<div class="container-input">
  <div class="label">{label} <span class="requested">{requested ? '*' : ''}</span></div>
  <div class="inputText">
    <div class="wr-input">
      <select 
        autocomplete="off" 
        class="input"
        class:input-border={input !== name && style === 'border'} class:input-border-error={input === name && style === 'border' && icon.length === 0} 
        class:input-linear={input !== name && style === 'linear'} class:input-linear-error={input === name && style === 'linear' && icon.length === 0} 
        class:input-linear-error-icon={input === name && style === 'linear' && icon.length !== 0}
        class:input-border-error-icon={input === name && style === 'border' && icon.length !== 0}
        class:input-linear-error-x={input === name && style === 'linear' && icon.length !== 0}

        class:padding-right={type === 'password'}
        class:input-date={type === 'date'}
        class:padding-left={icon.length && style === 'linear'}
        class:padding-left-border={icon.length && style === 'border'}

        class:lowercase={lowercase}
        class:capitalize={capitalize}

        bind:value 
        {name} 
        spellcheck="false" 
        onchange={onChange}
        {disabled}
        required>
      {@render children()}
      </select>
      <div 
        class="wr-calendar"
        class:wr-calendar-linear={style === 'linear'}
        class:wr-calendar-border={style === 'border'}>
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
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
.wr-input {
  position: relative;
  display: flex;
  align-items: center;
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
  font-size: 1.3em;
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
  padding: 0.352em 0.5em;
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
  padding: 0.352em 0.5em;
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
  gap: 3px;
  width: 100%;
}
.msg-error {
  width: 100%;
  height: 20px;
  font-size: 1.2em;
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

.arrow-icon {
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
  background: transparent;
  -moz-appearance: textfield;
}

/* Ocultar icono de calendario nativo */
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

/* Para Firefox */
.input-date::-moz-calendar-picker-indicator {
  display: none;
}

/* Asegurar que el input date tenga padding derecho */
.input-date {
  padding-right: 35px !important;
}

@media(min-width: 700px) {
  /*
  .input {
    padding: 0.4em 0;
  }
  */
  .label {
    font-size: 1.1em;
  }
  .msg-error {
    font-size: 1.1em;
  }
}

</style>
