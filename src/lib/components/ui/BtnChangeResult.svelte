<script lang="ts">
import eye from '$lib/assets/svg/eye.svg?raw';
import eyeOff from '$lib/assets/svg/eye-off.svg?raw';
let { onclick, viewResult } = $props();
</script>

<button {onclick} class="btn-change">
  {#if viewResult === 1}
    {@html eyeOff}
  {:else}
    {@html eye}
  {/if}
</button>

<style>
.btn-change {
  position: absolute;
  right: 0;
  top: -1px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: transparent;
}
</style>
