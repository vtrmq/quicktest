<script lang="ts">
  import type { LayoutData } from './$types';
	let { data, children }: { data: LayoutData, children: any } = $props();
</script>

{#if Object.entries(data).length !== 0}
  <div class="wrapper">
    {@render children()}
  </div>
{/if}

<style>
  .wrapper {
    padding: 1em;
  }
</style>
