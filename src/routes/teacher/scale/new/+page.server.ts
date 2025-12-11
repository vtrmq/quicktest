import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, saveDB } from '$lib/server/db';

export const actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacher_id = locals.user.id;

    const data = await request.formData();
    const scale = data.get('scale')?.toString().trim() ?? '';
    const min_value = data.get('min_value')?.toString().trim() ?? '';
    const max_value = data.get('max_value')?.toString().trim() ?? '';

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw 'DB: servicio no disponible';
      }

      const minValue = parseFloat(min_value);
      const maxValue = parseFloat(max_value);
      const sv = 'INSERT INTO scales (teacher_id, scale, min_value, max_value) VALUES (?, ?, ?, ?)';
      await saveDB(db, sv, teacher_id, scale, minValue, maxValue);

    } catch (err) {

      return fail(400, { 
        message: err, 
      });

    }

    throw redirect(303, '/teacher/scale');
  }
} satisfies Actions;
