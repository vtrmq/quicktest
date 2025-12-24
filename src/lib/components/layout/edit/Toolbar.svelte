<script lang="ts">
import scanLine from '$lib/assets/svg/scan-line.svg?raw';
import typeOutline from '$lib/assets/svg/type-outline.svg?raw';
import type from '$lib/assets/svg/type.svg?raw';
import listOrdered from '$lib/assets/svg/list-ordered.svg?raw';
import image from '$lib/assets/svg/image.svg?raw';
import receiptText from '$lib/assets/svg/receipt-text.svg?raw';
import tvMinimalPlay from '$lib/assets/svg/tv-minimal-play.svg?raw';
import refreshCCW from '$lib/assets/svg/refresh-ccw.svg?raw';

let { isLoad = false, visible = false, handleEyeLine, handleBtnToolbar, noneSpace = false, handleActionSave } = $props();

</script>

<div class="wr-toolbar">
  {#if visible}
    <div class="toolbar">
      <button class="btn-toolbar" onclick={()=>handleBtnToolbar('title')}>{@html typeOutline}</button>
      <button class="btn-toolbar" onclick={()=>handleBtnToolbar('subtitle')}>{@html type}</button>
      <button class="btn-toolbar" onclick={()=>handleBtnToolbar('paragraph')}>{@html receiptText}</button>
      <button class="btn-toolbar" onclick={()=>handleBtnToolbar('vignette')}>{@html listOrdered}</button>
      <button class="btn-toolbar" onclick={()=>handleBtnToolbar('image')}>{@html image}</button>
      <button class="btn-toolbar" onclick={()=>handleBtnToolbar('video')}>{@html tvMinimalPlay}</button>
    </div>
  {:else}
    <div class="wr-btns">
      <button class="btn-save-content" onclick={handleActionSave}>
        {#if !isLoad}
          <span>Guardar</span>
        {:else}
          {@html refreshCCW}
        {/if}
      </button>
      <button class="btn-view-space" onclick={handleEyeLine} class:rs={noneSpace}>{@html scanLine}</button>
    </div>
  {/if}
</div>

<style>
:global {
  .btn-save-content > svg {
    width: 22px;
    animation: girar 1.5s linear infinite;
  }
}
@keyframes girar {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
}
:global {
  .btn-view-space > svg {
    width: 20px;
    color: #fff;
  }
  .btn-toolbar > svg {
    width: 20px;
    color: #333;
  }
}
.btn-save-content > span {
  position: relative;
  top: -2px;
}
.wr-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  background: #fff;
  padding: 6px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border-radius: 6px;
  border: 1px solid #e9e9e9;
}
.btn-view-space {
  height: 32px;
  padding: 0 0.6em;
  background: #01a701;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-view-space.rs {
  background: #7d7d7d;
}
.btn-save-content {
  background: #7461fb;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-normal);
  cursor: pointer;
  font-size: 1em;
  height: 32px;
  padding: 0 1em;
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-toolbar {
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50px;
  background: transparent;
  transition: var(--transition);
}
.btn-toolbar:hover {
  background: #e9e9e9;
}
.wr-toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 40px;
  width: 100%;
  left: 0;
  height: 0;
}
.toolbar {
  background: #fff;
  padding: 5px 15px;
  border: 1px solid #dddcdc;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6em;
}
@media(min-width: 700px) {
  .wr-btns {
    right: 20px;
    position: absolute;
  }
}
</style>
