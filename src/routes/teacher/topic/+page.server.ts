import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

/**
 * Organiza un array plano de temas y asignaturas en una estructura jerárquica.
 * @param {Array<Object>} flatResults El array de resultados planos de la consulta SQL.
 * @returns {Array<Object>} Una estructura organizada por tema, con sus asignaturas anidadas.
 */
function organizeTopicsBySubject(flatResults: any): Array<Object> {
    // Usamos un mapa temporal para agrupar por topic_id
    const topicsMap = new Map();

    flatResults.forEach((row: any) => {
        const topicId = row.topic_id;

        if (!topicsMap.has(topicId)) {
            // Si es la primera vez que vemos este topic_id, inicializamos el objeto del tema
            topicsMap.set(topicId, {
                topic_id: row.topic_id,
                topic: row.topic,
                teacher_id: row.teacher_id,
                // ...otros campos del tema que necesites...
                created_at: row.created_at,
                subjects: [] // Aquí almacenaremos las asignaturas relacionadas
            });
        }

        // Obtenemos la referencia al objeto del tema
        const currentTopic = topicsMap.get(topicId);

        // Añadimos la asignatura si existe y tiene un subject_id válido)
        if (row.subject_name !== 'Sin asignar' && row.subject_id !== null) {
            currentTopic.subjects.push({
                subject_id: row.subject_id,
                subject_name: row.subject_name,
                // Puedes añadir más campos de la tabla topic_subjects/subjects aquí si es necesario
            });
        }
    });

    // Convertimos el mapa de vuelta a un array de temas
    return Array.from(topicsMap.values());
}

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 10;
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
    const totalAmount = totals?.total_amount ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const stmt = db.prepare(`SELECT
    -- Campos de la tabla principal 'topics'
    T.topic_id,
    T.teacher_id,
    T.topic,
    T.videos,
    T.file,
    T.shadow_file,
    T.content,
    T.order_by,
    T.visible,
    T.created_at,
    -- Campos de la tabla de unión 'topic_subjects' (serán NULL si no hay coincidencia)
    TS.topic_subject_id,
    TS.course_id,
    TS.subject_id,
    -- Nombre de la asignatura de la tabla 'subjects' (será NULL si no hay coincidencia)
    S.subject AS subject_name
FROM
    topics AS T
LEFT JOIN
    topic_subjects AS TS ON T.topic_id = TS.topic_id
LEFT JOIN
    subjects AS S ON TS.subject_id = S.subject_id
WHERE
    T.teacher_id = ?
ORDER BY
    T.order_by ASC
LIMIT ?
OFFSET ?;`);

    const rows = await stmt.bind(teacherId, limit, offset).all();
    const results = organizeTopicsBySubject(rows.results);
    console.log('-->', results)

    return { 
      type: 'success',
      topics: results,
      message: '',
      pagination: {
        page,
        totalPages,
        limit,
        totalCount,
        totalAmount
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

