import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform, selectDB, deleteDB } from '$lib/server/db';
import type { Actions } from "@sveltejs/kit";

type Error = {
  message: string;
};

export const load: PageServerLoad = async ({ locals, platform }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const query = `SELECT * FROM scales WHERE teacher_id = ?;`;
    const scales = await selectDB(db, query, teacherId);
    if (scales) {
      return { scales };
    } else {
      throw "No hay datos para mostrar";
    }

  } catch (error) {
    return { 
      type: 'failure',
      message: error,
      scales: []
    };
  }
};


export const actions: Actions = {

  delete: async ({ request, locals, platform }) => {
    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    const teacher_id = locals.user.id;
    const data = await request.formData();
    const scale_id = data.get('scale_id')?.toString();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw {message: 'DB: servicio no disponible'};
      }

      const query = 'DELETE FROM scales WHERE scale_id = ? AND teacher_id = ?';
      deleteDB(db, query, scale_id, teacher_id);

      return { 
        message: 'Escala valorativa eliminada' 
      };

    } catch (err) {

      const validationError = err as Error;
      return fail(400, { 
        message: validationError.message
      });

    }

  }

}
