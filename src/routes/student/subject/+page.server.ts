import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const studentId = locals.user.id;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const [course, subjects] = await db.batch([
      db.prepare(`SELECT course FROM courses WHERE course_id IN (SELECT user_id FROM users WHERE id = ?)`).bind(studentId),
      db.prepare(`SELECT subject_id, teacher_id, course_id, subject FROM subjects WHERE course_id IN (SELECT course_id FROM courses_students WHERE student_id = ?) AND visible = 1;`).bind(studentId)
    ]);

    return {
      course: course.results[0].course,
      subjects: subjects.results
    };

  } catch (error) {
    return { 
      type: 'failure',
      subjects: [],
      courses: null
    };
  }
};
