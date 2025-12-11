import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, saveDB, updateDB } from '$lib/server/db';
import { getDateTime } from '$lib/utils';

type Error = {
  message: string;
  origin: string;
};

export const actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacher_id = locals.user.id;

    const data = await request.formData();
    const topic = data.get('topic')?.toString().trim() ?? '';

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw {message: 'DB: servicio no disponible', origin: 'server'};
      }

      const created_at = getDateTime();
      const sv = 'INSERT INTO topics (teacher_id, topic, visible, created_at) VALUES (?, ?, ?, ?)';
      const rs = await saveDB(db, sv, teacher_id, topic, 1, created_at);
      const topic_id  = rs.last_row_id;

      const queryUpdate = `UPDATE topics SET order_by = ? WHERE topic_id = ? AND teacher_id = ?`;
      await updateDB(db, queryUpdate, topic_id, topic_id, teacher_id);

    } catch (err) {

      const _error = err as Error;
      return fail(400, { 
        message: _error.message, 
        origin: _error.origin, 
      });

    }

    throw redirect(303, '/teacher/topic');
  }
} satisfies Actions;
