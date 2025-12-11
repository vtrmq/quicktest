import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, updateDB, queryFirstDB } from '$lib/server/db';

type Scale = {
  max_value: number;
  min_value: number;
  scale: string;
  scale_id: number;
};

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;
  const scaleId = url.searchParams.get('scaleId') ?? '0';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const query = `SELECT scale, min_value, max_value FROM scales WHERE scale_id = ? AND teacher_id = ?;`;
    const scale: Scale = await queryFirstDB(db, query, scaleId, teacherId);
    if (scale) {
      scale.scale_id = parseInt(scaleId);
      return { scale }
    }
    throw '';

  } catch {
    throw redirect(303, '/teacher/scale');
  }

}

export const actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacherId = locals.user.id;

    const data = await request.formData();
    const scale_id = data.get('scale_id')?.toString() ?? '';
    const scale = data.get('scale')?.toString() ?? '';
    const min_value = data.get('min_value')?.toString() ?? '';
    const max_value = data.get('max_value')?.toString() ?? '';

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw 'DB: servicio no disponible';
      }

      const scaleId = parseInt(scale_id);
      const minValue = parseFloat(min_value);
      const maxValue = parseFloat(max_value);

      const queryUpdate = `UPDATE scales SET scale = ?, min_value = ?, max_value = ? WHERE scale_id = ? AND teacher_id = ?`;
      await updateDB(db, queryUpdate, scale, minValue, maxValue, scaleId, teacherId);

    } catch (err) {

      return fail(400, { 
        message: err
      });

    }

    throw redirect(303, '/teacher/scale');
  }
} satisfies Actions;


