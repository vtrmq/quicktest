import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform, selectDB, updateDB } from '$lib/server/db';
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

    const query = `SELECT c.course_id, c.course, c.code,
      COUNT(DISTINCT s.subject_id) AS total_subjects,
      GROUP_CONCAT(s.subject ORDER BY s.subject_id) AS subjects
      FROM courses c
      LEFT JOIN subjects s 
        ON s.course_id = c.course_id
      WHERE c.teacher_id = ? AND c.visible = 1 
      GROUP BY c.course_id;`;
    const results = await selectDB(db, query, teacherId);

    const data = results.map((row: any) => ({
      ...row,
      subjects: row.subjects
        ? row.subjects.split(',').map((s: any) => ({ subject: s.trim() }))
        : []
    }));

    return { 
      type: 'success',
      courses: data,
      message: ''
    };

  } catch (error) {
    return { 
      type: 'failure',
      message: error,
      courses: []
    };
  }
};


export const actions: Actions = {

  code: async ({ request, locals, platform }) => {
    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    const teacher_id = locals.user.id;
    const data = await request.formData();
    const course_id = data.get('course_id')?.toString();
    const action = data.get('action')?.toString();
    const code = data.get('code')?.toString();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw {message: 'DB: servicio no disponible'};
      }

      if (action === 'clear') {

        const query = 'UPDATE courses SET code = ? WHERE course_id = ? AND teacher_id = ?';
        await updateDB(db, query, code, course_id, teacher_id);

        return { 
          success: true, 
          message: 'Código eliminado' 
        };

      } else if (action === 'create') {

        const query = 'UPDATE courses SET code = ? WHERE course_id = ? AND teacher_id = ?';
        await updateDB(db, query, code, course_id, teacher_id);

        return { 
          success: true, 
          message: 'Código generado' 
        };

      }

    } catch (err) {

      const validationError = err as Error;
      return fail(400, { 
        success: false, 
        message: validationError.message
      });

    }

  },


  visible: async ({ request, locals, platform }) => {
    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    const teacher_id = locals.user.id;
    const data = await request.formData();
    const course_id = data.get('course_id')?.toString();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw {message: 'DB: servicio no disponible'};
      }

      const query = 'UPDATE courses SET visible = 0 WHERE course_id = ? AND teacher_id = ?';
      await updateDB(db, query, course_id, teacher_id);

      return { 
        success: true, 
        message: 'Curso eliminado' 
      };


    } catch (err) {

      const validationError = err as Error;
      return fail(400, { 
        success: false, 
        message: validationError.message
      });

    }

  }

}
