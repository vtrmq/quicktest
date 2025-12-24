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
      db.prepare(`SELECT 
      s.subject_id, 
      s.teacher_id, 
      s.course_id, 
      s.subject,
      u.name,
      u.surnames
    FROM subjects s
    LEFT JOIN users u ON s.teacher_id = u.id
    WHERE s.course_id IN (
      SELECT course_id FROM courses_students WHERE student_id = ?
    ) 
    AND s.visible = 1;`).bind(studentId)
    ]);

    return {
      course: course.results[0]?.course,
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
