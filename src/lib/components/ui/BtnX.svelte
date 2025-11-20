<script lang="ts">
  import close from '$lib/assets/svg/x.svg?raw';
  let { onclick }: { onclick: () => void } = $props();
</script>

<button class="btnx" {onclick}>
  {@html close}
</button>

<style>
:global(.btnx > svg) {
  width: 20px;
  color: #fff;
}
.btnx {
  display: flex;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background: transparent;
}
</style>
