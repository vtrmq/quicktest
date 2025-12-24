import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, queryFirstDB, updateDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const topicId = url.searchParams.get('topicId') ?? '0';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const query = `SELECT topic FROM topics WHERE topic_id = ? AND teacher_id = ?;`;
    const result = await queryFirstDB(db, query, parseInt(topicId), teacherId);

    return { 
      topicId,
      topic: result.topic,
      message: '',
    };

  } catch (error) {
    return fail(400, { 
      message: error,
    });
  }

}

export const actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacher_id = locals.user.id;

    const data = await request.formData();
    const topic_id = data.get('topic_id')?.toString().trim() ?? '';
    const topic = data.get('topic')?.toString().trim() ?? '';

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw 'DB: servicio no disponible';
      }

      const queryUpdate = `UPDATE topics SET topic = ? WHERE topic_id = ? AND teacher_id = ?`;
      await updateDB(db, queryUpdate, topic, topic_id, teacher_id);

    } catch (error) {

      return fail(400, { 
        message: error, 
      });

    }

    throw redirect(303, '/teacher/topic');
  }
} satisfies Actions;
