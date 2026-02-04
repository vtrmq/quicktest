import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'S') { throw redirect(303, '/unauthorized'); }

  //const studentId = locals.user.id;
  const teacherId = url.searchParams.get('teacherId') ?? '0';
  const courseId = url.searchParams.get('courseId') ?? '0';
  const subjectId = url.searchParams.get('subjectId') ?? '0';
  const topicId = url.searchParams.get('topicId') ?? '0';
  const activityId = url.searchParams.get('activityId') ?? '0';
  const origin = url.searchParams.get('origin') ?? 'inbox';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    // Consulta por lotes (batch) para obtener todos los datos
    const [courseResult, subjectResult, teacherResult, topicsResult, activityResult, inboxResult] = await db.batch([
      // Curso
      db.prepare(`SELECT course_id, course as name FROM courses WHERE course_id = ?`).bind(courseId),
  
      // Asignatura
      db.prepare(`SELECT subject_id, subject as name FROM subjects WHERE subject_id = ?`).bind(subjectId),
  
      // Profesor
      db.prepare(`SELECT id, name, surnames FROM users WHERE id = ?`).bind(teacherId),

      // Tema
      db.prepare(`SELECT topic_id, topic FROM topics WHERE topic_id = ?`).bind(topicId),

      // Actividad
      db.prepare(`SELECT activity_id, activity, type_general, time FROM activities WHERE activity_id = ? AND topic_id = ? AND visible = ?`)
      .bind(activityId, topicId, true),

      // Inbox student
      db.prepare(`SELECT date_end FROM inbox_student WHERE course_id = ? AND subject_id = ? AND topic_id = ? AND activity_id = ?`)
      .bind(courseId, subjectId, topicId, activityId)

    ]);

    // Construir el resultado
    const result = {
      course: courseResult.results[0] || null,
      subject: subjectResult.results[0] || null,
      teacher: teacherResult.results[0] || null,
      topic: topicsResult.results[0],
      activity: activityResult.results[0],
      inbox: inboxResult.results[0],
      origin
    };

    return {
      result,
    };

  } catch (error) {
    return { 
      type: 'failure',
      result: {},
    };
  }
};
