<script lang="ts">
import { page } from '$app/state';
import plus from '$lib/assets/svg/plus.svg?raw';
import { typeActivity, formatDate, filtrarParametros, extractParams, compareDates } from '$lib/utils';
import { LinkBack, LinkBtn, FooterMsg } from '$lib/components';
import { activityLocalstore } from '$lib/store/activity_student';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

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

//console.log(data)
//console.log(page)

const root = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId', 'topicId']);
type Item = {
  activity: object | null;
  item: object | null;
  time: object | null;
} | null
//let items: Item = $state({}) as Item;
let isEqualActivity = $state(false);
/*
type Activity = {
  activity_id: number;
  course_id: number;
  subject_id: number;
  teacher_id: number;
  topic_id: number;
} | null;
*/
let isVisible = $state(false);
let activity_store: Item = $state(null);

onMount(()=>{
  //console.log(info)
  //console.log($state.snapshot(items))
  //console.log($state.snapshot(isEqualActivity))

  const date_end = info.inbox.date_end;
  //console.log(date_end)
  if (!compareDates(date_end)) {
    activityLocalstore.clear();
    goto("/student/inbox");
  }
  //console.log(info.activity.type_general)
  activity_store = activityLocalstore.getActivity();
  //console.log($state.snapshot(activity_store))

  if (info.activity.type_general === 'R') {
    // teacherId=5&courseId=6&subjectId=6&topicId=1&activityId=1
    //const activity: Activity = items?.activity as Activity;
    //console.log($state.snapshot(info))
    const params = extractParams(page.url.search, ['teacherId', 'courseId', 'subjectId', 'topicId', 'activityId']);
    if (info.activity.activity_id === params.activityId && 
      info.course.course_id === params.courseId && 
      info.subject.subject_id === params.subjectId && 
      info.teacher.id === params.teacherId && 
      info.topic.topic_id === params.topicId) {
      isEqualActivity = true;
    }
    //console.log(isEqualActivity)
  } else if (info.activity.type_general === 'V' && activity_store?.item !== null) {
    const _root = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId', 'topicId', 'activityId', 'origin']);
    goto(`/student/subject/topic/activity/exercises?${_root}`);
    return;
  }
  isVisible = true;
  
});

</script>

{#if isVisible}
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

          {#if activity_store?.item !== null &&  isEqualActivity === true}
            <div class="wr-link-btn">
              <LinkBtn href="/student/subject/topic/activity/exercises?teacherId={info.teacher.id}&courseId={info.course.course_id}&subjectId={info.subject.subject_id}&topicId={info.topic.topic_id}&activityId={info.activity.activity_id}&origin={info.origin}" --max-width-link-btn="230px">{@html plus} Realizar actividad</LinkBtn>
            </div>
          {:else if activity_store?.item === null}
            <div class="wr-link-btn">
              <LinkBtn href="/student/subject/topic/activity/exercises?teacherId={info.teacher.id}&courseId={info.course.course_id}&subjectId={info.subject.subject_id}&topicId={info.topic.topic_id}&activityId={info.activity.activity_id}&origin={info.origin}" --max-width-link-btn="230px">{@html plus} Realizar actividad</LinkBtn>
            </div>
          {:else}
            <br />
          {/if}

        </div>
      </div>
    </div>
  </div>

  {#if activity_store?.item !== null && isEqualActivity === false}
    <FooterMsg />
  {/if}
{/if}

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
