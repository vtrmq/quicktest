import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = Number(locals.user.id);
  const topicId = Number(url.searchParams.get("topicId") ?? 0);
  const courseId = Number(url.searchParams.get("courseId") ?? 0);
  const subjectId = Number(url.searchParams.get("subjectId") ?? 0);

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    // Consulta por lotes (batch) para obtener todos los datos
    const [course, subject, topic, teacher, activities, scale] = await db.batch([
      // Curso
      db.prepare(`SELECT course_id, course FROM courses WHERE course_id = ?`).bind(courseId),
  
      // Asignatura
      db.prepare(`SELECT subject_id, subject FROM subjects WHERE subject_id = ?`).bind(subjectId),

      // Tema
      db.prepare(`SELECT topic_id, topic FROM topics WHERE topic_id = ?`).bind(topicId),
  
      // Profesor
      db.prepare(`SELECT name, surnames FROM users WHERE id = ?`).bind(teacherId),

      // Actividades
      db.prepare(`
        SELECT 
          a.*,
          ins.created_at,
          ins.inbox_student_id
        FROM activities a
        JOIN inbox_student ins ON a.activity_id = ins.activity_id
        WHERE ins.topic_id = ? 
          AND ins.course_id = ? 
          AND ins.subject_id = ?
        ORDER BY a.activity_id ASC
      `).bind(topicId, courseId, subjectId),

      db.prepare('SELECT scale, min_value, max_value FROM scales WHERE teacher_id = ?').bind(teacherId),
      
    ]);

    const activitiesAll = activities.results;
    if (activitiesAll.length !== 0) {
      for (let i = 0; i < activitiesAll.length; i++) {
        const activityId = activitiesAll[i].activity_id;
        const result = await db.prepare(`SELECT nota FROM answers WHERE course_id = ? AND subject_id = ? AND topic_id = ? AND activity_id = ?`)
        .bind(courseId, subjectId, topicId, activityId).all();
        let sumaNota = 0;
        if (result.results.length !== 0) {
          let count = 0;
          for (let j = 0; j < result.results.length; j++) {
            if (result.results[j].nota !== 0) {
              sumaNota += result.results[j].nota;
              count = count + 1;
            }
          }
          sumaNota = sumaNota / count;
        }
        activitiesAll[i].nota = sumaNota;
        delete activitiesAll[i].items;
      }
    }
    const result = {
      course: course.results[0] || null,
      subject: subject.results[0] || null,
      topic: topic.results[0] || null,
      teacher: teacher.results[0] || null,
      activities: activitiesAll || null,
      scale: scale.results || [],
    };

    return { result }

  } catch (error) {

    return fail(400, { 
      message: error,
      courses: [],
    });

  }
};
