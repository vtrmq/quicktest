import { redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import { dbPlatform, queryFirstDB, updateDB } from '$lib/server/db';

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

    const topic = await queryFirstDB(db, 'SELECT * FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1', topicId, teacherId);
    return { 
      type: 'success',
      topic,
      message: '',
    };

  } catch (err) {
    return { 
      type: 'failure',
      message: err,
      topic: null
    };
  }
};


export const actions: Actions = {
  save: async ({ request, platform, locals }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    const teacherId = locals.user.id;

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw "DB: servicio no disponible";
      }

      const data = await request.formData();
      const topicId = Number(data.get('topicId'));
      const content = data.get('content');

      const query = 'UPDATE topics SET content = ? WHERE topic_id = ? AND teacher_id = ?';
      await updateDB(db, query, content, topicId, teacherId);

      return { 
        type: 'success',
        message: 'Contenido guardado',
      };

    } catch (err) {
      return { 
        type: 'failure',
        message: err,
      };
    }
  }
}
