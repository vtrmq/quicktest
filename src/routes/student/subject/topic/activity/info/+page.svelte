<script lang="ts">
import { page } from '$app/state';
import plus from '$lib/assets/svg/plus.svg?raw';
import { typeActivity, formatDate, filtrarParametros } from '$lib/utils';
import { LinkBack, LinkBtn } from '$lib/components';

type Info = {
  activity: {activity_id: number; activity: string; time: string, type_general: string};
  course: {course_id: number; name: string};
  inbox: {date_end: string};
  subject: {name: string; subject_id: number};
  teacher: {id: number; name: string; surnames: string};
  topic: {topic: string; topic_id: number};
  origin: string;
}
let { data } = $props();
let info: Info = data.result as Info;

const root = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId', 'topicId']);

</script>

<div class="container-topics">
  <div class="wrapper">
    <div class="info-subject">
      <div>
        {#if info.origin === 'inbox'}
          <LinkBack href="/student/inbox">Bandeja</LinkBack>
        {:else}
          <LinkBack href="/student/subject/topic/activity?{root}">Actividades del tema</LinkBack>
        {/if}
        <div class="hd">
          <h1 class="name-subject">{info.subject.name}</h1>
          <p class="name-teacher">{info.teacher.name} {info.teacher.surnames}</p>
        </div>
        <div class="wr-content-activity">
          <div class="info">{info.activity.activity}</div>
          <p class="info">{typeActivity(info.activity.type_general)}</p>
          {#if info.activity.time}
            <p class="info">
              Tiempo: <span>{info.activity.time} min</span>
            </p>
          {/if}
          <p class="info">
            <span>Fecha final: {formatDate(info.inbox.date_end)}</span>
          </p>
        </div>

        <div class="wr-link-btn">
          <LinkBtn href="/student/subject/topic/activity/exercises?teacherId={info.teacher.id}&courseId={info.course.course_id}&subjectId={info.subject.subject_id}&topicId={info.topic.topic_id}&activityId={info.activity.activity_id}&origin={info.origin}" --max-width-link-btn="230px">{@html plus} Realizar actividad</LinkBtn>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.wr-link-btn {
  display: flex;
  justify-content: center;
  margin: 2em 0 1em;
}
.wr-content-activity {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}
.info {
  font-size: 1em;
  font-family: var(--font-normal);
}
.hd {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}
.name-teacher {
  font-size: 1em;
  font-family: var(--font-normal);
}
.name-subject {
  font-size: 1.7em;
  font-family: var(--font-bold);
}
.container-topics {
  padding: 0 0 3em;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.wrapper {
  margin: 1em 0 2em;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #f0ffff8a;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
}
.info-subject {
  padding: 1em;
}
</style>
