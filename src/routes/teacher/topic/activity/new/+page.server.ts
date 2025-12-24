import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, saveDB } from '$lib/server/db';
import { getDateTime } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const topicId = Number(url.searchParams.get("topicId") ?? 0);

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }
    const topic = await db.prepare('SELECT topic_id, topic FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1').bind(topicId, teacherId).first();
    return { topic }

  } catch (error) {
    return fail(400, { 
      message: error,
      topic: null
    });
  }
};

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacher_id = locals.user.id;

    const data = await request.formData();
    const activity = data.get('activity')?.toString().trim();
    const type_activity = data.get('type_activity')?.toString().trim();
    const time = data.get('time')?.toString().trim();
    const topicId = data.get('topicId')?.toString().trim();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw 'DB: servicio no disponible';
      }
      const created_at = getDateTime();
      if (time) {
        const query = `INSERT INTO activities (teacher_id, topic_id, activity, type_general, time, visible, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
        await saveDB(db, query, teacher_id, topicId, activity, type_activity, time, 1, created_at);
      } else {
        const query = `INSERT INTO activities (teacher_id, topic_id, activity, type_general, visible, created_at) VALUES (?, ?, ?, ?, ?, ?)`
        await saveDB(db, query, teacher_id, topicId, activity, type_activity, 1, created_at);
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
