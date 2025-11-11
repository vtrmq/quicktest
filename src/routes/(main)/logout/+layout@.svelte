<script lang="ts">
  import type { LayoutData } from './$types';
  import { DASHBOARDS } from "$lib/utils";
	let { data, children }: { data: LayoutData; children: any } = $props();
  const root = data.user?.profile;
</script>

{#if Object.entries(data).length !== 0}
  <a  href="{root === undefined ? '/' : DASHBOARDS[root]}">Home</a>
  {@render children()}
{/if}
