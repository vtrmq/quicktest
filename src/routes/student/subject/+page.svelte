<script lang="ts">
import plus from '$lib/assets/svg/plus.svg?raw';
import sendHorizontal from '$lib/assets/svg/send-horizontal.svg?raw';
import { Title, NoneData, LinkBtn } from '$lib/components';
let { data } = $props();
let subjects = data.subjects
</script>

<div class="container-teachers-registrations">

  <div class="wr-title">
    <Title>Mis asignaturas</Title>
    <p class="course">{data.course}</p>
    <p class="desc">Registra más asignaturas adicionando el código del curso.</p>
    <LinkBtn href="/student/add-course" --max-width-link-btn="230px">{@html plus} Adicionar código</LinkBtn>
  </div>

  {#if subjects.length !== 0}
    <div class="wrapper">
      
      {#each subjects as row, i}
        <div>
          <div class="row-teacher">
            <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === subjects.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb" class:border-left={i !== 0 && i + 1 <= subjects.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < subjects.length}>&nbsp;</div>
              </div>
            </div>
            <div class="box-course">
              <div class="info-subject">
                <div>
                  <div class="subject">{row.subject}</div>
                  <div class="teacher">{row.name} {row.surnames}</div>
                </div>
                <a class="box-link-subject" href="/student/subject/topic?teacherId={row.teacher_id}&courseId={row.course_id}&subjectId={row.subject_id}">{@html sendHorizontal}</a>
              </div>
            </div>
          </div>
        </div>
      {/each}

    </div>
  {/if}

</div>

{#if subjects.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay datos para mostrar</NoneData>
  </div>
{/if}

<style>
.subject {
  font-weight: 700;
  font-size: 1.2em;
  margin-bottom: 0.3em;
}
.teacher {
  font-size: 1em;
  color: #6d6d6d;
  font-style: italic;
}
.box-link-subject {
  display: flex;
  justify-content: center;
  align-items: center;
}
.course {
  font-size: 1.1em;
  font-family: var(--font-normal);
  font-weight: 800;
}
:global {
  .svg-subject > svg {
    width: 14px;
    color: #fff;
    stroke-width: 3px;
  }
  .box-link-subject > svg {
    width: 20px;
    color: orange;
    stroke-width: 3px;
  }
}
.box-course {
  padding: 1em 0;
  position: relative;
}
.circle-green {
  background: #a5fbcf;
  width: 18px;
  height: 18px;
  border-radius: 60px;
  box-shadow: rgb(17 17 26 / 38%) 0px 4px 15px, rgb(17 17 26 / 34%) 0px 0px 6px;
}
.border-left {
  border-left: 1px solid #4ca1a1;
}
.point {
  font-size: 1em;
  font-family: var(--font-bold);
  width: 40px;
  height: 40px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #7bd5d5 0%, #35a3a3 100%);
  color: #fff;
  box-shadow: 0 6px 12px rgb(103 185 185);
  position: absolute;
  outline: none;
  border: none;
}
.box-a {
  height: 100%;
  width: 50%;
}
.box-bb {
  height: 50%;
}
.box-b {
  height: 50%;
}
.box-point {
  display: flex;
  background: #a0e7e7;
  width: 60px;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
}
.border-top-left {
  border-top-left-radius: 8px;
}
.border-bottom-left {
  border-bottom-left-radius: 8px;
}
.row-teacher {
  display: grid;
  align-items: center;
  gap: 1em;
  grid-template-columns: 60px 1fr;
}
.desc {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
}
.container-teachers-registrations {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
.wr-none-data {
  padding: 3em 0;
}
.wr-title {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  margin-top: 1em;
  margin-bottom: 1.5em;
}
.wrapper {
  margin: 2em 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #f0ffff8a;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
}
.info-subject {
  font-size: 1em;
  padding: 0.5em;
  font-family: var(--font-normal);
  display: grid;
  gap: 1em;
  grid-template-columns: 1fr 40px;
}
@media(min-width: 800px) {
  .subject {
    font-size: 1em;
  }
  .teacher {
    font-size: 0.9em;
  }
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
  .info-subject {
    font-size: 1.1em;
  }
  .desc {
    font-size: 1em;
  }
  .wr-title {
    position: sticky;
    top: 105px;
    height: fit-content;
    margin-top: 10px;
    margin-bottom: 0;
  }
}
</style>
