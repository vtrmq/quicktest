import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, saveDB, deleteDB, queryFirstDB, updateDB } from '$lib/server/db';
import { getDateTime } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const topicId = Number(url.searchParams.get("topicId") ?? 0);
  const activityId = Number(url.searchParams.get("activityId") ?? 0);

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const [activity, topic, courses] = await db.batch([
      db.prepare('SELECT activity_id, activity FROM activities WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?')
      .bind(activityId, teacherId, topicId),

      db.prepare('SELECT topic_id, topic FROM topics WHERE topic_id = ? AND teacher_id = ?')
      .bind(topicId, teacherId),

      db.prepare(`
  SELECT 
    ts.course_id,
    c.course,
    ts.subject_id,
    s.subject,
    i.inbox_student_id,
    i.date_end 
  FROM topic_subjects ts
  JOIN courses c ON ts.course_id = c.course_id
  JOIN subjects s ON ts.subject_id = s.subject_id
  LEFT JOIN inbox_student i ON 
    i.teacher_id = ts.teacher_id AND
    i.topic_id = ts.topic_id AND
    i.course_id = ts.course_id AND
    i.subject_id = ts.subject_id AND
    i.activity_id = ?
  WHERE ts.teacher_id = ? 
    AND ts.topic_id = ?
  ORDER BY ts.course_id ASC, ts.subject_id ASC
`).bind(activityId, teacherId, topicId)

    ]);


    const coursesMap = new Map();
    const coursesAll = courses.results;
    type Row = { course_id: number; course: string; subject_id: number; subject: string; inbox_student_id: number | null; date_end: string; };

    coursesAll.forEach((row: Row) => {
      const { course_id, course, subject_id, subject, inbox_student_id, date_end } = row;

      if (!coursesMap.has(course_id)) {
        coursesMap.set(course_id, {
          course_id,
          course,
          subjects: []
        });
      }

      const courseData = coursesMap.get(course_id);

      courseData.subjects.push({
        subject_id,
        subject,
        inbox_student_id,  // será null si no existe en inbox_student
        date_end
      });
    });

    const resultCourses = Array.from(coursesMap.values());
    return {
      activity: activity.results[0],
      courses: resultCourses,
      topic: topic.results[0]
    }

  } catch (error) {
    return fail(400, { 
      message: error,
      topic: null
    });
  }
};

export const actions: Actions = {
  assign: async ({ request, platform, locals }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    const teacherId = locals.user.id;

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw "DB: servicio no disponible";
      }

      const { topicId, courseId, subjectId, activityId, dateEnd } = await request.json();

      const query = 'SELECT * FROM inbox_student WHERE teacher_id = ? AND course_id = ? AND subject_id = ? AND topic_id = ? AND activity_id = ?';
      const resultTopic = await queryFirstDB(db, query, teacherId, courseId, subjectId, topicId, activityId);

      if (!resultTopic) {
        const created_at = getDateTime();
        const query = `INSERT INTO inbox_student (teacher_id, course_id, subject_id, topic_id, activity_id, date_end, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const results = await saveDB(db, query, teacherId, courseId, subjectId, topicId, activityId, dateEnd, created_at);
        return {
          type: 'success',
          inbox_student_id: Number(results.last_row_id),
          message: 'Actividad enviada',
        }
      } else {
        const query = 'DELETE FROM inbox_student WHERE teacher_id = ? AND course_id = ? AND subject_id = ? AND topic_id = ? AND activity_id = ?';
        await deleteDB(db, query, teacherId, courseId, subjectId, topicId, activityId);
        return {
          type: 'success',
          inbox_student_id: null,
          message: 'Actividad removida',
        }
      }

    } catch (error) {

      return fail(400, { 
        message: error,
      });

    }
  },

  date: async ({ request, platform, locals }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw "DB: servicio no disponible";
      }

      const { inboxStudentId, dateEnd } = await request.json();

      const query = `UPDATE inbox_student SET date_end = ? WHERE inbox_student_id = ?`;
      await updateDB(db, query, dateEnd, inboxStudentId);

      return {
        message: 'Fecha final actualizada'
      }

    } catch (error) {

      return fail(400, { 
        message: error,
      });

    }
  }

}
