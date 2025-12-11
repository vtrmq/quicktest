<script lang="ts">
import { Title, LinkBack } from '$lib/components';
let { data } = $props();
</script>

<div class="wr-data">
  {#if data.type === 'success'}
    <LinkBack href="/login">Iniciar sesión</LinkBack>
    <Title>Cuenta activada</Title>
    <div class="row">
      <div class="label">Nombre</div>
      <p class="data">{data.user.name}</p>
    </div>
    <div class="row">
      <div class="label">Apellidos</div>
      <p class="data">{data.user.surnames}</p>
    </div>
    <div class="row">
      <div class="label">Correo electrónico</div>
      <p class="data">{data.user.email}</p>
    </div>
    <div class="row">
      <div class="label">Celular</div>
      <p class="data">{data.user.phone}</p>
    </div>
  {:else if data.type === 'failed'}
    <LinkBack href="/">Home</LinkBack>
    <Title>Información</Title>
    <div class="row">
      <div class="label">Mensaje de error</div>
      <p class="data">{@html data.message}</p>
    </div>
  {/if}
</div>

<style>
:global {
  .code-r {
    color: red;
    text-decoration: underline;
    text-underline-offset: 6px;
    text-decoration-thickness: 1px;
  }
}
.wr-data {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 1em 0;
}
.row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.label {
  font-family: var(--font-normal);
  color: #878787;
  font-weight: 600;
  font-size: 1em;
}
.data {
  font-family: var(--font-normal);
  line-height: 26px;
}
@media (min-width: 700px) {
  .label {
    font-size: 0.9em;
  }
}
</style>
