<script lang="ts">
  import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<h1>Activar mi cuenta</h1>
<p>{data.info.name}</p>

<form method="POST" use:enhance>
  <input type="hidden" value={data.info.email} name="email">
  <button>Activar cuenta</button>
</form>
