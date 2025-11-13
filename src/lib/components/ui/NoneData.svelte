<script>
  import noneData from '$lib/assets/svg/none-data.svg?raw';
  let { children } = $props()
</script>

<div class="wr-none-data">
  <div>{@html noneData}</div>
  <p class="msg">{@render children()}</p>
</div>

<style>
  :global(.svg-none) {
    width: 150px;
  }
  .msg {
    font-size: 1.5em;
    font-family: var(--font-normal);
    font-weight: 500;
    text-align: center;
  }
  .wr-none-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
  }
  @media(min-width: 700px) {
    .msg {
      font-size: 1.3em;
    }
  }
</style>
