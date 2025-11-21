<script lang="ts">
	import trash from '$lib/assets/svg/trash.svg?raw';
  let { onclick }: { onclick: () => void } = $props();
</script>

<button class="btn-delete" {onclick}>
  {@html trash}
</button>

<style>
:global(.btn-delete > svg) {
  width: 20px;
  color: red;
}
.btn-delete {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 7px;
  top: 7px;
  border-radius: 60px;
  cursor: pointer;
  background: transparent;
  transition: var(--trasition);
}
.btn-delete:hover {
  background: #fdefef;
}
</style>
