import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const courseId = Number(url.searchParams.get("courseId") ?? 0);
  const studentId = Number(url.searchParams.get("studentId") ?? 0);
  let dateStart = url.searchParams.get("dateStart") ?? '';
  let dateEnd = url.searchParams.get("dateEnd") ?? '';
  const subjectId = Number(url.searchParams.get("subjectId") ?? 0);

  dateStart = `${dateStart} 23:59:59`;
  dateEnd = `${dateEnd} 23:59:59`;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const [course, subject, student, answers, scale] = await db.batch([
      // Curso
      db.prepare(`SELECT course_id, course FROM courses WHERE course_id = ?`).bind(courseId),
      // Asignatura
      db.prepare(`SELECT subject_id, subject FROM subjects WHERE subject_id = ?`).bind(subjectId),
      // Estudiante
      db.prepare(`SELECT name, surnames FROM users WHERE id = ?`).bind(studentId),

    db.prepare(`
SELECT 
    a.topic_id,
    a.activity_id,
    a.nota,
    a.performance,
    a.percentage,
    a.date_time,
    t.topic,
    c.activity
FROM answers a
JOIN topics t ON a.topic_id = t.topic_id
JOIN activities c ON a.activity_id = c.activity_id
WHERE a.teacher_id = ?
  AND a.course_id = ?
  AND a.subject_id = ?
  AND a.student_id = ?
  AND a.date_time BETWEEN ? AND ?
ORDER BY a.answer_id DESC
`).bind(teacherId, courseId, subjectId, studentId, dateStart, dateEnd),

      db.prepare('SELECT scale, min_value, max_value FROM scales WHERE teacher_id = ?').bind(teacherId),

    ]);

    return {
      student: student.results[0] || null,
      course: course.results[0] || null,
      subject: subject.results[0] || null,
      answers: answers.results || null,
      scale: scale.results || [],
    };

  } catch {
    return { 
      type: 'failure',
      result: {},
    };
  }
};

