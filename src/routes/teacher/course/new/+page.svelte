<script lang="ts">
import type { ActionData } from './$types';
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';
import trash from '$lib/assets/svg/trash.svg?raw';

let { form }: { form: ActionData } = $props();
let btnSave = $state<Button>();
let toast = $state<Toast | null>(null);

type Subject = {
  subject: string;
}
let listField: Subject[] = $state([{subject: ''}]);

function handleAddField() {
  listField.push({subject: ''});
}

function handleRemoveField(index: number) {
  if (listField.length === 1) return;
  listField = listField.filter((_, i) => i !== index);
}

const handleForm: SubmitFunction = () => {
  btnSave?.load(true);
  return async ({ update, result }) => {
    if (result.type === 'failure') {
      btnSave?.load(false);
    }
    await update();
  };
};

</script>

<Toast bind:this={toast} />

<div class="wr-form-reg">
  <DataFrame width="500px">
    <LinkBack href="/teacher/course">Mis cursos</LinkBack>
    <form class="wr-form" method="POST" use:enhance={handleForm} novalidate>
      <Title>Nuevo curso</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre del curso" 
          value={form?.value ?? ''} error={form?.error ?? ''} input={form?.input ?? ''} 
          name="course" />
      </div>
      <Title>Asignaturas del curso</Title>
      <div class="body-form">
        {#each listField as field, index}
          {@const nameField = `subject-${index}`}
          <div class="row-subject">
            <Input 
              style="border" type="text" requested label="Asignatura" 
              value={form?.value ?? field.subject} error={form?.error ?? ''} input={form?.input ?? ''} 
              name={nameField} />
            <button type="button" class="btn-remove" onclick={()=>handleRemoveField(index)}>{@html trash}</button>
          </div>
        {/each}
      </div>
      <div class="wr-btns">
        <Button type="button" onclick={handleAddField}>Agregar campo</Button>
        <Button bind:this={btnSave}>Guardar</Button>
      </div>
    </form>
  </DataFrame>
</div>

<style>
.btn-remove {
  width: 42px;
  height: 36px;
  background: transparent;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
}
:global {
  .btn-remove:hover {
    background: #ffe5e5;
  }
  .btn-remove > svg {
    width: 20px;
    color: red;
  }
}
.row-subject {
  display: flex;
  align-items: center;
  gap: 1em;
}
.wr-btns {
  display: flex;
  gap: 1em;
}
.wr-form-reg {
  display: flex;
  justify-content: center;
  background: #fff;
}
.wr-form {
  margin: 0 auto;
  width: 100%;
}
.body-form {
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
@media(min-width: 700px) {
  .wr-form-reg {
    padding: 2em 1em 3em;
    background: transparent;
    box-shadow: none;
  }
}
</style>
