<script lang="ts">
import scanLine from '$lib/assets/svg/scan-line.svg?raw';
import typeOutline from '$lib/assets/svg/type-outline.svg?raw';
import type from '$lib/assets/svg/type.svg?raw';
import listOrdered from '$lib/assets/svg/list-ordered.svg?raw';
import image from '$lib/assets/svg/image.svg?raw';
import receiptText from '$lib/assets/svg/receipt-text.svg?raw';
import tvMinimalPlay from '$lib/assets/svg/tv-minimal-play.svg?raw';
import refreshCCW from '$lib/assets/svg/refresh-ccw.svg?raw';
import save from '$lib/assets/svg/save.svg?raw';
import audio from '$lib/assets/svg/audio-lines.svg?raw';
import { generate } from '$lib/components';

let { 
  isLoad = false, 
  visible = false, 
  handleEyeLine, 
  handleBtnToolbar, 
  noneSpace = false, 
  handleActionSave, 
  handleShowAudio, 
  apiKeys,
} = $props();

function handleGenerate() {
  generate.open();
}

generate.setApiKeys(apiKeys);

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
          <span class="span-save">{@html save}</span>
        {:else}
          <span class="span-save-refresh">{@html refreshCCW}</span>
        {/if}
      </button>
      <button class="btn-view-audio" onclick={()=>handleShowAudio()}>{@html audio}</button>
      <button class="btn-view-space" onclick={handleEyeLine} class:rs={noneSpace}>{@html scanLine}</button>
      <button class="btn-view-ia" onclick={handleGenerate}>{@html receiptText}</button>
    </div>
  {/if}
</div>

<style>
:global {
  .btn-save-content > .span-save > svg {
    width: 22px;
  }
  .btn-save-content > .span-save-refresh > svg {
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
  .btn-toolbar > svg {
    width: 20px;
    color: #333;
  }
 .btn-view-space > svg, .btn-view-ia > svg, .btn-view-audio > svg {
    width: 20px;
    color: #fff;
  }
}
.wr-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  background: #fff;
  padding: 6px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border-radius: 6px;
  border: 1px solid #e9e9e9;
}
.btn-view-space {
  height: 32px;
  width: 40px;
  padding: 0 0.6em;
  background: #01a701;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-view-audio {
  height: 32px;
  width: 40px;
  padding: 0 0.6em;
  background: #0797eb;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-view-ia {
  height: 32px;
  width: 40px;
  padding: 0 0.6em;
  background: #d57f00;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-view-space.rs {
  background: #ababab;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
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
  z-index: 10000 !important;
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
