<script lang="ts">
import { fade } from 'svelte/transition';
import { tipbox } from './tipbox.svelte';
</script>
{#if tipbox.show.visible}
  <div class="container-tipbox">
    <div class="tipbox" transition:fade={{ duration: 300 }}>{tipbox.show.msg}</div>
  </div>
{/if}

<style>
.container-tipbox {
  position: fixed;
  left: 0;
  bottom: 50px;
  width: 100%;
  height: 0px;
  z-index: 20000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tipbox {
  background: #ffffff;
  padding: 0.5em 1em;
  border-radius: 6px;
  box-shadow: rgb(100 100 111 / 41%) 0px 7px 29px 0px;
  font-family: var(--font-normal);
}
@media (min-width: 700px) {
  .tipbox {
    font-size: 0.9em;
  }
}
</style>
