import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'S') { throw redirect(303, '/unauthorized'); }

  const studentId = locals.user.id;
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 50;
  const offset = (page - 1) * limit;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const totalsQuery = `
  SELECT COUNT(a.activity_id) AS total_count
  FROM courses_students cs
  JOIN inbox_student isub ON cs.course_id = isub.course_id
  JOIN activities a ON isub.activity_id = a.activity_id
  WHERE cs.student_id = ?
    AND a.visible = 1
    AND (a.items IS NOT NULL OR a.file IS NOT NULL)
`;
type Totals = { total_count: number };
const stmtPage = db.prepare(totalsQuery);
const totals: Totals = await stmtPage.bind(studentId).first();
const totalCount = totals?.total_count ?? 0;
const totalPages = Math.max(1, Math.ceil(totalCount / limit));

const activitiesResult = await db.prepare(`
  SELECT 
      a.*,
      isub.date_end,
      isub.course_id,
      isub.subject_id,
      isub.inbox_student_id,
      c.course,
      s.subject,
      ans.answer_id,
      ans.nota,
      ans.performance
  FROM courses_students cs
  JOIN inbox_student isub ON cs.course_id = isub.course_id
  JOIN activities a ON isub.activity_id = a.activity_id
  JOIN courses c ON isub.course_id = c.course_id
  JOIN subjects s ON isub.subject_id = s.subject_id
  LEFT JOIN answers ans ON 
      ans.activity_id = a.activity_id 
      AND ans.subject_id = s.subject_id
      AND ans.student_id = cs.student_id
  WHERE cs.student_id = ?
      AND a.visible = 1
      AND (a.items IS NOT NULL OR a.file IS NOT NULL)
  ORDER BY isub.inbox_student_id ASC
  LIMIT ? OFFSET ?
`).bind(studentId, limit, offset).all();

return {
    activities: activitiesResult.results,
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
      result: {},
    };
  }
};

