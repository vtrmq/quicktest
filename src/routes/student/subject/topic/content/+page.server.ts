import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbPlatform, queryFirstDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'S') { throw redirect(303, '/unauthorized'); }

  const teacherId = url.searchParams.get('teacherId') ?? '0';
  const courseId = url.searchParams.get('courseId') ?? '0';
  const subjectId = url.searchParams.get('subjectId') ?? '0';
  const topicId = url.searchParams.get('topicId') ?? '0';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const topic = await queryFirstDB(db, 'SELECT * FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1', topicId, teacherId);
    return { 
      teacherId: parseInt(teacherId),
      courseId: parseInt(courseId),
      subjectId: parseInt(subjectId),
      topicId: parseInt(topicId),
      type: 'success',
      topic,
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
    };
  }
};
