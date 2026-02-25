import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = Number(locals.user.id);
  const topicId = Number(url.searchParams.get("topicId") ?? 0);
  const courseId = Number(url.searchParams.get("courseId") ?? 0);
  const subjectId = Number(url.searchParams.get("subjectId") ?? 0);
  const activityId = Number(url.searchParams.get("activityId") ?? 0);

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }
    const [course, subject, topic, teacher, activity, students, scale] = await db.batch([
      // Curso
      db.prepare(`SELECT course_id, course FROM courses WHERE course_id = ?`).bind(courseId),
      // Asignatura
      db.prepare(`SELECT subject_id, subject FROM subjects WHERE subject_id = ?`).bind(subjectId),
      // Tema
      db.prepare(`SELECT topic_id, topic FROM topics WHERE topic_id = ?`).bind(topicId),  
      // Profesor
      db.prepare(`SELECT name, surnames FROM users WHERE id = ?`).bind(teacherId),
      // Actividades
      db.prepare(`SELECT activity_id, activity, type_general FROM activities WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?`).bind(activityId, teacherId, topicId),

      db.prepare(`
        SELECT 
    a.student_id,
    a.nota,
    a.performance,
    u.name,
    u.surnames
FROM answers a
LEFT JOIN users u ON u.id = a.student_id
WHERE 
    a.teacher_id = ?
    AND a.course_id = ?
    AND a.subject_id = ?
    AND a.topic_id = ?
    AND a.activity_id = ?`).bind(teacherId, courseId,subjectId, topicId, activityId),

      db.prepare('SELECT scale, min_value, max_value FROM scales WHERE teacher_id = ?').bind(teacherId),

    ]);

    const result = {
      course: course.results[0] || null,
      subject: subject.results[0] || null,
      topic: topic.results[0] || null,
      teacher: teacher.results[0] || null,
      activity: activity.results[0] || null,
      students: students.results || null,
      scale: scale.results || [],
    };

    return { result }

  } catch (error) {
    return fail(400, { 
      message: error,
      courses: [],
    });
  }

}
