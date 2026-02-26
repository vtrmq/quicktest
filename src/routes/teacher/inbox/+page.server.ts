import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const activitiesResult = await db.prepare(`
SELECT 
    a.course_id,
    a.subject_id,
    a.topic_id,
    a.activity_id,
    a.student_id,
    a.nota,
    a.performance,
    c.course,
    s.subject,
    t.topic,
    act.activity,
    act.type_general,
    u.name,
    u.surnames
FROM answers a
LEFT JOIN courses c ON c.course_id = a.course_id
LEFT JOIN subjects s ON s.subject_id = a.subject_id AND s.teacher_id = a.teacher_id
LEFT JOIN topics t ON t.topic_id = a.topic_id AND t.teacher_id = a.teacher_id
LEFT JOIN activities act ON act.activity_id = a.activity_id AND act.teacher_id = a.teacher_id
LEFT JOIN users u ON u.id = a.student_id
WHERE 
    a.teacher_id = ?
ORDER BY a.answer_id DESC
LIMIT ?
OFFSET ?
`).bind(teacherId, limit, offset).all();

    return {
      answers: activitiesResult.results
    };

  } catch (error) {
    return { 
      type: 'failure',
      result: {},
    };
  }
};

