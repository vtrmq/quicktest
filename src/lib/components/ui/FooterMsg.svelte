<script lang="ts">
import { filtrarParametros } from '$lib/utils';
import { page } from '$app/state';
const root = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId', 'topicId', 'activityId', 'origin']);
</script>

<div class="footer-msg">
  Tienes una actividad iniciada
  <a class="link" href="/student/subject/topic/activity/exercises?{root}">Continuar</a>
</div>

<style>
.link {
  color: #fff;
  text-decoration: none;
  background: #2196F3;
  padding: 0.4em 1em;
  border-radius: 6px;
}
.footer-msg {
  background: orange;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  font-size: 1em;
  font-family: var(--font-normal);
}
</style>
