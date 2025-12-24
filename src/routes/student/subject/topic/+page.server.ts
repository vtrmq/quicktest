import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'S') { throw redirect(303, '/unauthorized'); }

  const teacherId = url.searchParams.get('teacherId') ?? '0';
  const courseId = url.searchParams.get('courseId') ?? '0';
  const subjectId = url.searchParams.get('subjectId') ?? '0';

  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    // Consulta por lotes (batch) para obtener todos los datos
    const [courseResult, subjectResult, teacherResult, topicsResult, countResult] = await db.batch([
      // Curso
      db.prepare(`SELECT course_id, course as name FROM courses WHERE course_id = ?`).bind(courseId),
  
      // Asignatura
      db.prepare(`SELECT subject_id, subject as name FROM subjects WHERE subject_id = ?`).bind(subjectId),
  
      // Profesor
      db.prepare(`SELECT name, surnames FROM users WHERE id = ?`).bind(teacherId),

      db.prepare(`
  SELECT 
    t.topic_id,
    t.topic,
    t.content,
    EXISTS(
      SELECT 1 
      FROM inbox_student i
      WHERE i.topic_id = t.topic_id
        AND i.teacher_id = ts.teacher_id
        AND i.course_id = ts.course_id
        AND i.subject_id = ts.subject_id
    ) as has_inbox
  FROM topic_subjects ts
  JOIN topics t 
    ON ts.topic_id = t.topic_id
  WHERE ts.teacher_id = ? 
    AND ts.course_id = ? 
    AND ts.subject_id = ? 
    AND t.visible = 1 
  ORDER BY t.topic_id DESC
  LIMIT ? OFFSET ?
`).bind(teacherId, courseId, subjectId, limit, offset),


      // Conteo TOTAL de temas
      db.prepare(`
        SELECT COUNT(*) as total
        FROM topic_subjects ts
        WHERE ts.teacher_id = ? 
          AND ts.course_id = ? 
          AND ts.subject_id = ?
      `).bind(teacherId, courseId, subjectId)
  
    ]);

    const totalCount = countResult.results[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    // Construir el resultado
    const result = {
      course: courseResult.results[0] || null,
      subject: subjectResult.results[0] || null,
      teacher: teacherResult.results[0] || null,
      topics: topicsResult.results || []
    };

    return {
      result,
      teacherId,
      courseId,
      subjectId,
      pagination: {
        page,
        totalPages,
        limit,
        totalCount
      }
    };

  } catch (error) {
    return { 
      type: 'failure',
      result: {
        teacherId,
        courseId,
        subjectId,
        course: null,
        subject: null,
        teacher: null,
        topics: []
      },
    };
  }
};
