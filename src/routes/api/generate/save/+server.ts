import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbPlatform, selectDB, saveDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals, platform }) => { 

  if (!locals.user) { 
    return json({
      success: 'failed',
    });
  }

  const teacherId = locals.user.id;

  try {
    const formData = await request.formData();
    const apis = formData.get('apis') as string;

    const db = dbPlatform(platform);
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    const query = `SELECT * FROM apikeys WHERE user_id = ?;`;
    const api = await selectDB(db, query, teacherId);
    if (api.length === 0) {
      const sv = 'INSERT INTO apikeys (user_id, apikey) VALUES (?, ?)';
      await saveDB(db, sv, teacherId, apis);
    } else {
      const sv = 'UPDATE apikeys SET apikey = ? WHERE user_id = ?';
      await saveDB(db, sv, apis, teacherId);
    }

    return json({
      success: true,
      message: 'Información guardada',
    });

  } catch (error) {

    return json({ 
      success: false,
      message: error,
      files: []
    }, { status: 400 });

  }
}
