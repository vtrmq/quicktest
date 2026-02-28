<script lang="ts">
  import type { LayoutData } from './$types';
	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

{#if Object.entries(data).length !== 0}
  {@render children()}
{/if}
