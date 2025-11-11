<script lang="ts">
  import { enhance } from '$app/forms';
  let { data } = $props();
</script>

<h1>Logout</h1>
<div>
  <p>{data.user?.name} {data.user?.surnames}</p>
  <form method="POST" use:enhance>
    <button>Logout</button>
  </form>
</div>
