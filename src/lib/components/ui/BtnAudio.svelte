<script lang="ts">
import audioLines from '$lib/assets/svg/audio-lines.svg?raw';
let { onclick, sw = false } = $props();
</script>
<button class="btn-audio" onclick={onclick}>
  {#if !sw}
    Audio
  {:else}
    {@html audioLines}
  {/if}
</button>

<style>
:global {
  .btn-audio > svg {
    width: 19px;
    display: flex;
  }
}
.btn-audio {
  justify-content: center;
  display: flex;
  background: #03A9F4;
  padding: 0.4em 1em;
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-normal);
  font-size: 1em;
  color: #fff;
  font-weight: 800;
  box-shadow: #0d78cd 0px 7px 0px 0px;
  width: 90px;
}
</style>
