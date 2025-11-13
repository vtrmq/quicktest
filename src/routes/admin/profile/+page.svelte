<script lang="ts">
  import { userStore } from '$lib/store';
  function handlePhoto() {
    userStore.photo('https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg');
  }
</script>
<h1>Profile</h1>
<button onclick={handlePhoto}>Photo</button>
