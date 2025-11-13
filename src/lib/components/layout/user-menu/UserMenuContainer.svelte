<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    isOpen: boolean
    children: Snippet
  }
  let { isOpen = false, children }: Props = $props();
</script>

{#if isOpen}
  <div class="container-options">
    {@render children?.()}
  </div>
{/if}

<style>
  .container-options {
    position: absolute;
    right: 0.8em;
    background: #3a28a7;
    top: 55px;
    padding: 1em;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 10px 28px, rgba(0, 0, 0, 0.22) 0px 6px 10px;
  }
</style>
