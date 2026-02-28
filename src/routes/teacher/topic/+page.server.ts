import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

/**
 * Organiza un array plano de temas y asignaturas en una estructura jerárquica.
 * @param {Array<Object>} flatResults El array de resultados planos de la consulta SQL.
 * @returns {Array<Object>} Una estructura organizada por tema, con sus asignaturas anidadas.
 */

function organizeTopicsBySubject(flatResults: any[]): Array<Object> {
    const topicsMap = new Map<number, any>();

    flatResults.forEach((row) => {
        const topicId = row.topic_id;

        if (!topicsMap.has(topicId)) {
            topicsMap.set(topicId, {
                topic_id: row.topic_id,
                topic: row.topic,
                teacher_id: row.teacher_id,
                created_at: row.created_at,
                subjects: []
            });
        }

        const currentTopic = topicsMap.get(topicId);

        if (row.subject_id !== null) {
            currentTopic.subjects.push({
                subject_id: row.subject_id,
                subject: row.subject_name,
                course_id: row.course_id,
                course: row.course_name
            });
        }
    });

    return Array.from(topicsMap.values());
}


export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 50;
  const offset = (page - 1) * limit;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    type Totals = { total_count: number; total_amount: number };
    const totalsQuery = `SELECT COUNT(t.topic_id) AS total_count FROM topics AS t WHERE t.teacher_id = ?`;
    const stmtPage = db.prepare(totalsQuery);
    const totals: Totals = await stmtPage.bind(teacherId).first();
    const totalCount = totals?.total_count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const stmt = db.prepare(`
SELECT
    T.topic_id,
    T.teacher_id,
    T.topic,
    T.file,
    T.shadow_file,
    T.content,
    T.order_by,
    T.visible,
    T.created_at,
    TS.topic_subject_id,
    TS.course_id,
    TS.subject_id,
    S.subject AS subject_name,
    C.course AS course_name
FROM (
    SELECT topic_id, teacher_id, topic, file, shadow_file, content, order_by, visible, created_at
    FROM topics
    WHERE teacher_id = ?
    ORDER BY order_by ASC
    LIMIT ?
    OFFSET ?
) AS T
LEFT JOIN topic_subjects AS TS ON T.topic_id = TS.topic_id
LEFT JOIN subjects AS S ON TS.subject_id = S.subject_id
LEFT JOIN courses AS C ON TS.course_id = C.course_id;
`);

    const rows = await stmt.bind(teacherId, limit, offset).all();
    const results = organizeTopicsBySubject(rows.results);

    return { 
      type: 'success',
      topics: results,
      message: '',
      pagination: {
        page,
        totalPages,
        limit,
        totalCount,
      }
    };

  } catch (error) {
    return { 
      type: 'failure',
      message: error,
      topics: []
    };
  }
};

