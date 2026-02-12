import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, url, platform }) => {
  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'S') { throw redirect(303, '/unauthorized'); }

  const teacherId = url.searchParams.get('teacherId') ?? '0';
  const courseId = url.searchParams.get('courseId') ?? '0';
  const subjectId = url.searchParams.get('subjectId') ?? '0';
  const topicId = url.searchParams.get('topicId') ?? '0';
  const activityId = Number(url.searchParams.get("activityId") ?? 0);
  const origin = url.searchParams.get("origin") ?? 'inbox';

  const db = dbPlatform(platform);
  if (!db) {
    throw redirect(303, '/');
  }

  const [topic, activity, scales] = await db.batch([
    db.prepare('SELECT topic FROM topics WHERE topic_id = ?').bind(topicId),
    db.prepare('SELECT * FROM activities WHERE activity_id = ? AND topic_id = ?').bind(activityId, topicId),
    db.prepare('SELECT scale, min_value, max_value FROM scales WHERE teacher_id = ?').bind(teacherId)
  ]);
  return { 
    result: activity.results[0] || null,
    scales: scales.results || [],
    topic: topic.results[0].topic || null,
    activity: activity.results[0] || null,
    teacherId: Number(teacherId),
    courseId: Number(courseId),
    subjectId: Number(subjectId),
    topicId: Number(topicId),
    activityId: Number(activityId),
    origin
  };
};
