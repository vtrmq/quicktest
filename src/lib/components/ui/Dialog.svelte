<script lang="ts">
let { winEvent }: { winEvent: (str: string | undefined) => void } = $props();
let dialog = $state<HTMLDialogElement | null>(null);

function returnDialog() {
  winEvent(dialog?.returnValue);
}

function handleCancel() {
  dialog?.close('cancel');
}

function handleClick(e: Event) {
  if(e.target === dialog){
    dialog?.close('cancel');
  }
}

export function show() {
  dialog?.showModal();
}
</script>

<dialog bind:this={dialog} onclose={returnDialog} onclick={handleClick} oncancel={handleCancel}>
  <div class="win">
    <h2>¿Deseas continuar?</h2>
    <p>Pulsa Aceptar o Cancelar.</p>

    <form method="dialog" class="wr-btns">
      <button value="cancel">Cancelar</button>
      <button value="ok">Aceptar</button>
    </form>
  </div>
</dialog>

<style>
.win {
  padding: 2em;
}
/* Diálogo */
dialog {
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,.25);
  max-width: 320px;
  margin: auto;
}

/* Fondo oscuro que aparece cuando el diálogo está modal */
dialog::backdrop{
  background: rgba(0,0,0,.45);
}

</style>

