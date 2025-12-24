import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform, updateDB } from '$lib/server/db';
import type { Actions } from "@sveltejs/kit";

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

    const [topic, activities] = await db.batch([
  db.prepare('SELECT topic_id, topic FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1')
    .bind(topicId, teacherId),
  
      db.prepare(`
  SELECT 
    a.activity_id, 
    a.activity, 
    a.type_general, 
    a.time, 
    a.file, 
    a.shadow_file, 
    a.items, 
    a.created_at,
    EXISTS(
      SELECT 1 
      FROM inbox_student i
      WHERE i.teacher_id = ? 
        AND i.topic_id = ? 
        AND i.activity_id = a.activity_id
    ) as has_inbox
  FROM activities a
  WHERE a.topic_id = ? AND 
        a.teacher_id = ? AND 
        a.visible = 1
  ORDER BY a.activity_id ASC
`).bind(teacherId, topicId, topicId, teacherId)
]);

    const result = {
      topic: topic.results[0] || null,
      activities: activities.results || []
    };

    return { result }

  } catch (err) {
    return { 
      type: 'failure',
      message: err,
      topic: null
    };
  }
};

export const actions: Actions = {

  visible: async ({ request, locals, platform }) => {
    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    const teacher_id = locals.user.id;
    const data = await request.formData();
    const topic_id = Number(data.get('topic_id'));
    const activity_id = Number(data.get('activity_id'));

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw 'DB: servicio no disponible';
      }

      const query = 'UPDATE activities SET visible = 0 WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?';
      await updateDB(db, query, activity_id, teacher_id, topic_id);

      return { 
        message: 'Actividad eliminada' 
      };

    } catch (error) {

      return fail(400, { 
        message: error 
      });

    }

  },

}
