<script lang="ts">
  import type { DataProfile } from '$lib/types';
  import { profile } from '$lib/utils';
  type Props = { info: DataProfile }
  let { info = {name: '', surnames: '', email: '', profile: ''} }: Props = $props();
</script>

<div class="container-info">
  <p class="info-profile">{profile(info.profile ?? '')}</p>
  <p class="info-user-name">{info.name} {info.surnames}</p>
  <p class="info-user-email">{info.email}</p>
</div>

<style>
.info-profile {
  color: #fff;
  font-family: var(--font-normal);
  font-size: 1.4em;
}
.info-user-name {
  font-size: 1.1em;
  font-family: var(--font-bold);
  color: #fff;
}
.info-user-email {
  font-size: 1.2em;
  font-family: var(--font-normal);
  color: #0bc5b4;
}
.container-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1em;
}
@media(min-width: 700px) {
  .info-profile {
    font-size: 1.2em;
  }
}
</style>
