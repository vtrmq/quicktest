import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, updateDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;
  const courseId = url.searchParams.get('courseId') ?? '0';
  const dateStart = url.searchParams.get('dateStart') ?? '';
  const dateEnd = url.searchParams.get('dateEnd') ?? '';
  const subjectId = Number(url.searchParams.get('subjectId')) ?? 0;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const [students, subjects, course] = await db.batch([
      db.prepare(`SELECT u.id, u.name, u.surnames, u.blocked FROM users u JOIN courses_students cs ON u.id = cs.student_id WHERE cs.course_id = ?`).bind(courseId),
      db.prepare(`SELECT subject_id, subject FROM subjects WHERE course_id = ? AND teacher_id = ?`).bind(courseId, teacherId),
      db.prepare(`SELECT course_id, course FROM courses WHERE course_id = ? AND teacher_id = ?`).bind(courseId, teacherId)
    ]);

    if (course.results[0] !== undefined) {
      return {
        students: students.results,
        subjects: subjects.results,
        course: course.results[0],
        dateStart,
        dateEnd,
        subjectId,
      };
    } else {
      throw "El curso no existe";
    }

  } catch (error) {
    return {
      students: [],
      subjects: [],
      course: '',
      message: error
    }
  }
};


type Error = {
  message: string;
  redirect: boolean;
};

export const actions: Actions = {
  blocked: async ({ request, platform, locals }) => {

    if (!locals.user || locals.user.profile !== 'T') {
      throw redirect(303, '/');
    }

    try {

      const formData = await request.formData();
      const studentId = Number(formData.get('studentId'));
      const blocked = formData.get('blocked');

      const db = dbPlatform(platform);
      if (!db) {
        throw {
          message: "DB: servicio no disponible",
          redirect: false
        };
      }

      const queryUpdate = `UPDATE users SET blocked = ? WHERE id = ?`;
      await updateDB(db, queryUpdate, blocked, studentId);

      return {success: true};

    } catch (err) {
      
      const validationError = err as Error;
      return fail(400, { 
        message: validationError.message, 
        redirec: validationError.redirect,
      });

    }
  }
}
