import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbPlatform, updateDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals, platform }) => { 

  try {

    if (!locals.user) { 
      throw new Error('Sesión cerrada');
    }

    let user = locals.user;
    const formData = await request.formData();
    const items = formData.get('items');
    const topicId = Number(formData.get('topicId'));
    const activityId = Number(formData.get('activityId'));

    const db = dbPlatform(platform);
    if (!db) {
      throw new Error('DB: servicio no disponible');
    }

    await updateDB(db, 'UPDATE activities SET items = ? WHERE activity_id = ? AND teacher_id = ? AND topic_id = ?', items, activityId, user.id, topicId);

    return json({
      success: true,
    });

  } catch (error) {
    return json({ 
      success: false,
      messsage: error instanceof Error ? error.message : String(error)
    });

  }
}
