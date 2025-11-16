<script lang="ts">
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
    <img src={photo} alt="" class="user-photo" />
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
  }
  .user-photo {
    object-fit: scale-down;
    width: 100%;
  }
  @media(min-width: 700px) {
    .user-menu-button {
      right: 20px;
    }
  }
</style>
