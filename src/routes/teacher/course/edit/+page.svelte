<script lang="ts">
import type { ActionData, PageData } from './$types';
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { DataFrame, Title, Input, Button, LinkBack, Toast } from '$lib/components';
import trash from '$lib/assets/svg/trash.svg?raw';

//let { data } = $props<PageData>();

type Props = {
  form: ActionData,
  data: PageData
};

let { form, data }: Props = $props();
let btnSave = $state<Button>();
let toast = $state<Toast | null>(null);
let course = data.course
let courseId: number | undefined = data.course?.course_id;

type Subject = {
  course_id: number | undefined;
  delete: boolean;
  subject: string;
  subject_id: number;
  teacher_id: number | undefined;
}

let listField: Subject[] = $state(data.subjects ?? []);

function handleAddField() {
  listField?.push({course_id: courseId, delete: false, subject: '', subject_id: 0, teacher_id: course?.teacher_id});
}

function handleRemoveField(index: number) {
  if (listField?.length === 1) return;
  let count = 0;
  for (let i = 0; i < listField.length; i++) {
    if (listField[i].delete === false) {
      count++;
    }
  }
  if (count === 1) return;

  listField[index].delete = true;
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
      <Title>Editar curso</Title>
      <div class="body-form">
        <Input 
          style="border" type="text" requested label="Nombre del curso" 
          value={form?.input === 'course' ? form.value : course?.course} error={form?.error ?? ''} input={form?.input ?? ''} 
          name="course" />
        <input value={courseId} type="hidden" name="courseId" />
      </div>
      <Title>Asignaturas del curso</Title>
      <div class="body-form">
        {#each listField as field, index}
          {@const nameField = `subject-${index}`}
          <div class="row-subject" class:none={field.delete === true}>
            <Input 
              style="border" type="text" requested label="Asignatura" 
              value={form?.input === nameField ? form.value : field.subject} error={form?.error ?? ''} input={form?.input ?? ''} 
              name={nameField} oninput={(e: any) => field.subject = e.target.value} />
            <button type="button" class="btn-remove" onclick={()=>handleRemoveField(index)}>{@html trash}</button>

            {#if field.delete}
              <input type="hidden" name={`delete-${index}`} value="true" />
            {/if}
            <input type="hidden" name={`subject_id-${index}`} value={field.subject_id} />

          </div>
        {/each}
      </div>
      <div class="wr-btns">
        <Button type="button" onclick={handleAddField}>Agregar asignatura</Button>
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
.row-subject.none {
  display: none;
}
.wr-btns {
  display: flex;
  gap: 2em;
}
  .wr-form-reg {
    display: flex;
    justify-content: center;
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
    }
  }
</style>
