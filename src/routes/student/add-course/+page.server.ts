import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, saveDB, queryFirstDB } from '$lib/server/db';

type Error = {
  message: string;
  origin: string;
};

export const actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'S') { throw redirect(303, '/unauthorized'); }
    const student_id = locals.user.id;

    const data = await request.formData();
    const code = data.get('code')?.toString().trim() ?? '';

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw {message: 'DB: servicio no disponible', origin: 'server'};
      }

      const query = 'SELECT course_id FROM courses WHERE code = ?';
      const result = await queryFirstDB(db, query, code);
      if (!result) {
        throw {message: 'Código no encontrado', origin: 'form'};
      }

      const course_id = result.course_id;
      const queryCourse = 'SELECT * FROM courses_students WHERE student_id = ? AND course_id = ?';
      const resultCourse = await queryFirstDB(db, queryCourse, student_id, course_id);
      if (resultCourse) {
        throw {message: 'Código ya registrado', origin: 'form'};
      }

      const sv = 'INSERT INTO courses_students (student_id, course_id) VALUES (?, ?)';
      await saveDB(db, sv, student_id, course_id);

    } catch (err) {

      const _error = err as Error;
      return fail(400, { 
        message: _error.message, 
        origin: _error.origin, 
      });

    }

    throw redirect(303, '/student/subject');
  }
} satisfies Actions;
