import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'S') { throw redirect(303, '/unauthorized'); }

  const studentId = locals.user.id;
  const teacherId = url.searchParams.get('teacherId') ?? '0';
  const courseId = url.searchParams.get('courseId') ?? '0';
  const subjectId = url.searchParams.get('subjectId') ?? '0';
  const topicId = url.searchParams.get('topicId') ?? '0';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    // Consulta por lotes (batch) para obtener todos los datos
    const [courseResult, subjectResult, teacherResult, topicsResult, activitiesResult, scalesResult] = await db.batch([
      // Curso
      db.prepare(`SELECT course_id, course as name FROM courses WHERE course_id = ?`).bind(courseId),
  
      // Asignatura
      db.prepare(`SELECT subject_id, subject as name FROM subjects WHERE subject_id = ?`).bind(subjectId),
  
      // Profesor
      db.prepare(`SELECT id, name, surnames FROM users WHERE id = ?`).bind(teacherId),

      // Tema
      db.prepare(`SELECT topic_id, topic FROM topics WHERE topic_id = ?`).bind(topicId),

      // Actividades y asnwers
      db.prepare(`
        SELECT 
          a.*,
          isub.date_end,
          ans.answer_id,
          ans.nota,
          ans.performance,
        CASE WHEN ans.answer_id IS NOT NULL THEN 1 ELSE 0 END as answered
        FROM inbox_student isub
        JOIN activities a ON isub.activity_id = a.activity_id
        LEFT JOIN answers ans ON 
          ans.activity_id = a.activity_id 
          AND ans.student_id = ?
        WHERE isub.teacher_id = ?
          AND isub.course_id = ?
          AND isub.subject_id = ?
          AND isub.topic_id = ?
          AND a.topic_id = ?
        ORDER BY a.activity_id DESC
      `).bind(studentId, teacherId, courseId, subjectId, topicId, topicId),

      db.prepare('SELECT scale, min_value, max_value FROM scales WHERE teacher_id = ?').bind(teacherId)

    ]);

    let activitiesAll: any = [];
    if (activitiesResult.results !== null) {
      for (let i = 0; i < activitiesResult.results.length; i++) {
        if (activitiesResult.results[i].items !== null || activitiesResult.results[i].file !== null) {
          activitiesAll.push(activitiesResult.results[i]);
        }
      }
    }
    //console.log(activitiesAll)

    // Construir el resultado
    const result = {
      course: courseResult.results[0] || null,
      subject: subjectResult.results[0] || null,
      teacher: teacherResult.results[0] || null,
      topic: topicsResult.results[0],
      activities: activitiesAll,
      scales: scalesResult.results || [],
      //activities: activitiesResult.results
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

