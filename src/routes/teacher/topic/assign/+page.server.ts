import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import { dbPlatform, selectDB, queryFirstDB, saveDB, deleteDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;
  const topicId = Number(url.searchParams.get("topicId") ?? 0);

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const queryTopic = 'SELECT * FROM topics WHERE topic_id = ? AND teacher_id = ?';
    const resultTopic = await queryFirstDB(db, queryTopic, topicId, teacherId);
    const query = `
SELECT 
  c.course_id,
  c.course,
  c.code,
  COUNT(DISTINCT s.subject_id) AS total_subjects,
  GROUP_CONCAT(
    s.subject_id || '§' || 
    s.subject || '§' || 
    IFNULL(ts.topic_subject_id, '')
  ) AS subjects
FROM courses c
LEFT JOIN (
    SELECT *
    FROM subjects
    ORDER BY subject ASC
) s ON s.course_id = c.course_id
LEFT JOIN topic_subjects ts
  ON ts.teacher_id = ?
 AND ts.course_id = c.course_id
 AND ts.subject_id = s.subject_id
 AND ts.topic_id = ?
WHERE c.teacher_id = ?
  AND c.visible = 1
GROUP BY c.course_id;
`;

    const results = await selectDB(db, query, teacherId, topicId, teacherId);

    const data = results.map((row: any) => ({
      course_id: row.course_id,
      course: row.course,
      code: row.code,
      total_subjects: row.total_subjects,
      subjects: row.subjects
        ? row.subjects.split(',').map((item: string) => {
          const [subject_id, subject, topic_subject_id] = item.split('§');

          return {
            subject_id: Number(subject_id),
            subject: subject,
            topic_subject_id: topic_subject_id
              ? Number(topic_subject_id)
              : null
          };
        })
        : []
    }));

    return { 
      type: 'success',
      topicId,
      topic: resultTopic.topic,
      courses: data,
      message: ''
    };

  } catch (error) {

    return fail(400, { 
      message: error,
      courses: [],
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

      const { topicId, courseId, subjectId } = await request.json();

      const queryTopic = 'SELECT * FROM topic_subjects WHERE teacher_id = ? AND course_id = ? AND subject_id = ? AND topic_id = ?';
      const resultTopic = await queryFirstDB(db, queryTopic, teacherId, courseId, subjectId, topicId);
      if (!resultTopic) {
        const query = 'INSERT INTO topic_subjects (teacher_id, course_id, subject_id, topic_id) VALUES (?, ?, ?, ?)';
        const results = await saveDB(db, query, teacherId, courseId, subjectId, topicId);
        return {
          type: 'success',
          topic_subject_id: Number(results.last_row_id),
          message: 'Tema asignado',
        }
      } else {
        const query = 'DELETE FROM topic_subjects WHERE teacher_id = ? AND course_id = ? AND subject_id = ? AND topic_id = ?';
        await deleteDB(db, query, teacherId, courseId, subjectId, topicId);
        return {
          type: 'success',
          topic_subject_id: null,
          message: 'Tema removido',
        }
      }

    } catch (error) {

      return fail(400, { 
        message: error,
      });

    }
  }
}
