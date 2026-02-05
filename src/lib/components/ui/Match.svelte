<script lang="ts">
import { fade } from 'svelte/transition';
import reading from '$lib/assets/images/reading.png';
import { activityLocalstore } from '$lib/store/activity';
import { onMount } from 'svelte';
import { colorSynt } from '$lib/utils';

type Side = 'left' | 'right';
type Words = { word: string; };
let { indexExercise, infoData } = $props();
let leftWords: Words[] = $state([]);
let rightWords: Words[] = $state([]);
</script>
