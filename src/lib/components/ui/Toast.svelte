<script>
  import { onDestroy } from "svelte";
  let { top = "normal" } = $props();
  let t = $state({});
  let visible = $state(false);
  let id = 0;
  let idx = 0;

  export function view(data) {
    if (Object.entries(data).length !== 0) {
      t = data;
      t.time = "time" in t === false ? 4000 : t.time;
      t.message = "message" in t === false ? "Sin mensaje" : t.message;
      clearTimeout(id);
      clearTimeout(idx);
      visible = false;
      idx = setTimeout(() => {
        visible = true;
        id = setTimeout(() => {
          visible = false;
        }, t.time);
      }, 200);
    }
  }

  onDestroy(() => {
    clearTimeout(id);
    clearTimeout(idx);
  });
</script>

<div class="container-toast">
  <div class="toast" class:top-high={top === "high" && visible} class:top-normal={top === "normal" && visible}>
    {#if "icon" in t}
      <div class="wr-icon-toast"><span class="span-emoji">{@html t.icon}</span></div>
    {/if}
    <div class="message">{t.message}</div>
  </div>
</div>

<style>
  .message {
    font-size: 0.7em;
    text-align: center;
  }
  .wr-icon-toast {
    height: auto;
    display: flex;
    align-items: center;
  }
  :global(.wr-icon-toast > .span-emoji > svg) {
    display: flex;
    width: 30px;
    color: var(--color-svg-toast);
    position: relative;
    top: -1px;
  }
  .span-emoji {
    position: relative;
    top: 2px;
    font-size: 25px;
  }
  .container-toast {
    position: fixed;
    bottom: -10px;
    width: 100%;
    height: 0;
    display: flex;
    justify-content: center;
    z-index: 70;
    left: 0;
  }
  .toast {
    background: var(--bg-toast);
    box-shadow: rgb(0 0 0 / 28%) 0px 5px 15px;
    padding: 0.6em 1em;
    border-radius: 50px;
    transition: 0.3s;
    top: 0;
    display: flex;
    gap: 0.6em;
    align-items: center;
    margin: 0 0.5em;
    position: absolute;
    max-width: 330px;
    font-family: var(--font-normal);
    font-size: 1.5em;
    line-height: 22px;
    border: 2px solid #5a98c9;
  }
  .toast.top-normal {
    top: -120px;
  }
  .toast.top-high {
    top: -160px;
  }
  @media(min-width: 600px) {
    .span-emoji {
      font-size: 23px;
    }
    .toast {
      max-width: 290px;
      font-size: 1.3em;
    }
    .toast.top-high {
      top: -150px;
    }
    .message {
      font-size: 0.7em;
    }
  }
</style>
