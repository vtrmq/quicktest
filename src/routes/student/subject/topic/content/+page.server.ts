import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform } from '$lib/server/db'; // queryFirstDB

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

      //db.prepare('SELECT activity_id, topic_id, activity, type_general, time, file, items FROM activities WHERE teacher_id = ? AND topic_id = ? AND visible = 1')
      //.bind(teacherId, topicId),

    const [topic, activities, extras, scales] = await db.batch([
      db.prepare('SELECT * FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1')
      .bind(topicId, teacherId),

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
          AND ans.subject_id = isub.subject_id 
          AND ans.student_id = ?
        WHERE isub.teacher_id = ?
          AND isub.course_id = ?
          AND isub.subject_id = ?
          AND isub.topic_id = ?
          AND a.topic_id = ?
        ORDER BY a.activity_id ASC
      `).bind(studentId, teacherId, courseId, subjectId, topicId, topicId),

      db.prepare('SELECT items FROM activities_extra WHERE teacher_id = ? AND topic_id = ?')
      .bind(teacherId, topicId),

      db.prepare('SELECT scale, min_value, max_value FROM scales WHERE teacher_id = ?').bind(teacherId),

    ]);
    //console.log(activities)

    const _activitiesAll = activities.results || [];
    let _activities: any = [];
    for (let i = 0; i < _activitiesAll.length; i++) {
      if (JSON.parse(_activitiesAll[i].items) !== null || _activitiesAll[i].file !== null) {
        _activitiesAll[i].items = _activitiesAll[i].items !== null ? JSON.parse(_activitiesAll[i].items) : null;
        _activities.push(_activitiesAll[i]);
      }
    }
    //console.log(_activities)
    //console.log(extras)
    //const _topic = await queryFirstDB(db, 'SELECT * FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1', topicId, teacherId);
    //console.log(_topic)
    return { 
      teacherId: parseInt(teacherId),
      courseId: parseInt(courseId),
      subjectId: parseInt(subjectId),
      topicId: parseInt(topicId),
      type: 'success',
      topic: topic.results[0] || null,
      activities: _activities,
      extras: extras.results.length === 0 ? [] : JSON.parse(extras.results[0].items),
      scales: scales.results || [],
    };

  } catch (error) {
    return { 
      message: error,
      teacherId: parseInt(teacherId),
      courseId: parseInt(courseId),
      subjectId: parseInt(subjectId),
      topicId: parseInt(topicId),
      type: 'success',
      topic: [],
      activities: [],
      extras: [],
      scales: []
    };
  }
};
