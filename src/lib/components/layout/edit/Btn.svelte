<script lang="ts">
let { onclick = (e: string)=>{e}, children } = $props();
</script>
<button class="btn-action-edit" onclick={(e)=>{onclick(e)}}>{@render children()}</button>

<style>
:global {
  .btn-action-edit svg {
    width: 20px;
    color: #333;
  }
}
.btn-action-edit {
  padding: 6px 10px;
  font-family: var(--font-normal);
  border-radius: 40px;
  cursor: pointer;
  font-weight: 600;
  background: #fff;
  font-size: 1em;
  border: 1px solid #d7d7e3;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition);
}
.btn-action-edit:hover {
  background: #f3f3f3;
}
@media(min-width: 700px) {
  .btn-action-edit {
    font-size: 0.8em;
  }
}
</style>
