<script lang="ts">
  import { FOLDER_USER_PHOTOS, R2_DOMAIN } from '$lib/utils';
  type Props = {
    photo?: string
    onclick: ()=>void
  }
  let { photo = '', onclick }: Props = $props();
</script>

<button
  class="user-menu-button"
  type="button"
  aria-label="Menú de usuario"
  {onclick}>
  {#if photo}
    <img src='{R2_DOMAIN}/{FOLDER_USER_PHOTOS}/{photo}' alt="" class="user-photo" />
  {:else}
    <img src='/images/user.png' alt="" class="user-photo" />
  {/if}
</button>

<style>
  .user-menu-button {
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 50%;
    outline: none;
    width: 42px;
    height: 40px;
    display: flex;
    right: 0.8em;
    position: absolute;
    overflow: hidden;
  }
  .user-photo {
    width: 100%;
    height: 100%;
    object-fit: fill;
    align-self: baseline;
  }
  @media(min-width: 700px) {
    .user-menu-button {
      right: 20px;
    }
  }
</style>
