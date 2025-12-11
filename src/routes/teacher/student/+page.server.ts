import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;
  const courseId = url.searchParams.get('courseId') ?? '0';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const [students, subjects, course] = await db.batch([
      db.prepare(`SELECT u.id, u.name, u.surnames, u.visible FROM users u JOIN courses_students cs ON u.id = cs.student_id WHERE cs.course_id = ?`).bind(courseId),
      db.prepare(`SELECT subject_id, subject FROM subjects WHERE course_id = ? AND teacher_id = ?`).bind(courseId, teacherId),
      db.prepare(`SELECT course_id, course FROM courses WHERE course_id = ? AND teacher_id = ?`).bind(courseId, teacherId)
    ]);

    if (course.results[0] !== undefined) {
      return {
        students: students.results,
        subjects: subjects.results,
        course: course.results[0]
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
