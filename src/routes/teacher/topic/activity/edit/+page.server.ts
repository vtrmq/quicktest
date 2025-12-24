import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, updateDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;
  const topicId = Number(url.searchParams.get('topicId'));
  const activityId = Number(url.searchParams.get('activityId'));

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const [topic, activity] = await db.batch([
      db.prepare('SELECT topic_id, topic FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1').bind(topicId, teacherId),
      db.prepare(`SELECT activity_id, topic_id, activity, type_general, time 
        FROM activities WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?;`).bind(activityId, teacherId, topicId)
    ]);

    const result = {
      topic: topic.results[0] || null,
      activity: activity.results[0] || null
    };
    return { result }

  } catch (error) {
    return fail(400, { 
      message: error,
      activity: null
    });
  }

}

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacher_id = locals.user.id;

    const data = await request.formData();
    const activity = data.get('activity')?.toString().trim();
    const type_general = data.get('type_general')?.toString().trim();
    const time = data.get('time')?.toString().trim();
    const topicId = data.get('topicId')?.toString().trim();
    const activityId = data.get('activityId')?.toString().trim();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw 'DB: servicio no disponible';
      }
      if (time) {
        const query = `UPDATE activities SET activity = ?, type_general = ?, time = ? WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?`;
        await updateDB(db, query, activity, type_general, time, activityId, teacher_id, topicId);
      } else {
        const query = `UPDATE activities SET activity = ?, type_general = ?, time = ? WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?`;
        await updateDB(db, query, activity, type_general, null, activityId, teacher_id, topicId);
      }

    } catch (error) {
      return fail(400, { 
        message: error,
        topic: null
      });
    }
    throw redirect(303, `/teacher/topic/activity?topicId=${topicId}`);
  }
};
