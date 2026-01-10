import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, url, platform }) => {
  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const topicId = Number(url.searchParams.get("topicId") ?? 0);
  const activityId = Number(url.searchParams.get("activityId") ?? 0);

  const db = dbPlatform(platform);
  if (!db) {
    throw redirect(303, '/');
  }

  const [topic, activity] = await db.batch([
    db.prepare('SELECT topic_id, topic FROM topics WHERE topic_id = ? AND teacher_id = ?')
    .bind(topicId, teacherId),
    db.prepare('SELECT activity_id, activity, items FROM activities WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?')
    .bind(activityId, teacherId, topicId)
  ]);

  return { 
    topic: topic.results[0] || null,
    activity: activity.results[0] || null
  };
};
