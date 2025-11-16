<script lang="ts">
  let { children, type = 'submit', bg = 'green', onclick, icon = ''} = $props()
  // , fn = ()=>{}
  let isLoad: boolean = $state(false);
  let isDisabled: boolean = $state(false);

  function Type(node: HTMLButtonElement) {
    switch (type) {
      case 'submit': node.type = "submit"; break;
      case 'button': node.type = "button"; break;
      case 'reset': node.type = "reset"; break;
    }
  }

  export function load(_isLoad: boolean) {
    isLoad = _isLoad;
  }

  export function disabled(_isDisabled: boolean) {
    isDisabled = _isDisabled;
  }

  /*function handleClick() {
    if (type === 'button') {
      fn();
    }
  }*/
</script>

<!-- onclick={handleClick} -->

<button use:Type 
  class="button" 
  {onclick} disabled={isLoad || isDisabled} 
  class:green={bg === 'green'} class:cadetblue={bg === 'cadetblue'}>
  {#if !isLoad}
    {#if icon}
      <span class="icon-botton">{@html icon}</span>
    {/if}
    {@render children()}
  {:else}
    <svg class="svg-load" stroke-width="2" viewBox="0 0 24 24" fill="none"><path d="M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  {/if}
</button>

<style>
  :global(.icon-botton > svg) {
    width: 20px;
  }
  .icon-botton {
    display: flex;
  }
  .svg-load {
    width: 22px;
    animation: girar 1.5s linear infinite;
  }
  @keyframes girar {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .cadetblue {
    background: cadetblue;
  }
  .green {
    background-color: #7cc54e;
  }
  .button {
    width: 100%;
    height: 50px;
    border-radius: 70px;
    font-family: var(--font-bold);
    font-size: 1.1em;
    color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
  }
  @media(min-width: 700px) {
    .button {
      height: 48px;
      font-size: 1.1em;
    }
  }
</style>
