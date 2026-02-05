<script lang="ts">
import { activityLocalstore } from '$lib/store/activity';
import { colorSynt, bgColorSynt, removeFinalPunctuationMark, wordObjects } from '$lib/utils';
import { Toast, Select, Input } from '$lib/components';

let { infoData, indexExercise = -1 } = $props();
</script>
