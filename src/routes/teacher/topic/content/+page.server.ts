import { redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import { dbPlatform, updateDB, queryFirstDB, saveDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

  const teacherId = locals.user.id;
  const topicId = Number(url.searchParams.get("topicId") ?? 0);

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    //const topic = await queryFirstDB(db, 'SELECT * FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1', topicId, teacherId);
    
    const [topic, activities, extras, apikeys] = await db.batch([
      db.prepare('SELECT * FROM topics WHERE topic_id = ? AND teacher_id = ? AND visible = 1')
      .bind(topicId, teacherId),
      db.prepare('SELECT activity_id, topic_id, activity, type_general, time, file, items FROM activities WHERE teacher_id = ? AND topic_id = ? AND visible = 1')
      .bind(teacherId, topicId),
      db.prepare('SELECT items FROM activities_extra WHERE teacher_id = ? AND topic_id = ?')
      .bind(teacherId, topicId),
      db.prepare('SELECT apikey FROM apikeys WHERE user_id = ?')
      .bind(teacherId),
    ]);

    //console.log(apikeys.results[0].apikey)

    const _activitiesAll = activities.results || [];
    const apiKeys = apikeys.results[0] || [];
    let _activities: any = [];
    for (let i = 0; i < _activitiesAll.length; i++) {
      _activitiesAll[i].items = _activitiesAll[i].items !== null ? JSON.parse(_activitiesAll[i].items) : null;
      _activities.push(_activitiesAll[i]);
    }

    return { 
      type: 'success',
      topic: topic.results[0] || null,
      activities: _activities,
      message: '',
      extras: extras.results.length === 0 ? [] : JSON.parse(extras.results[0].items),
      apiKeys: Object.entries(apiKeys).length !== 0 ? JSON.parse(apiKeys.apikey) : null,
    };

  } catch (err) {
    return { 
      type: 'failure',
      message: err,
      topic: null
    };
  }
};


export const actions: Actions = {
  save: async ({ request, platform, locals }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }

    const teacherId = locals.user.id;

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw "DB: servicio no disponible";
      }

      const data = await request.formData();
      const topicId = Number(data.get('topicId'));
      const content = data.get('content');
      const extras = String(data.get('extras'));

      const query = 'UPDATE topics SET content = ? WHERE topic_id = ? AND teacher_id = ?';
      await updateDB(db, query, content, topicId, teacherId);

      //console.log(JSON.parse(extras))

      if (JSON.parse(extras).length !== 0) {
        const query_act = 'SELECT * FROM activities_extra WHERE teacher_id = ? AND topic_id = ?';
        const result = await queryFirstDB(db, query_act, teacherId, topicId);
        if (result === null) {
          const query = 'INSERT INTO activities_extra (teacher_id, topic_id, items) VALUES (?, ?, ?)';
          await saveDB(db, query, teacherId, topicId, extras);
        } else {
          //console.log("Actualizar")
          //console.log(result)
          const query = 'UPDATE activities_extra SET items = ? WHERE topic_id = ? AND teacher_id = ?';
          await updateDB(db, query, extras, topicId, teacherId);
        }
      } else {
        // Eliminar registro
        const query_act = 'SELECT * FROM activities_extra WHERE teacher_id = ? AND topic_id = ?';
        const result = await queryFirstDB(db, query_act, teacherId, topicId);
        if (result !== null) {
          console.log("Eliminar registro")
        }
      }

      return { 
        type: 'success',
        message: 'Contenido guardado',
      };

    } catch (err) {
      return { 
        type: 'failure',
        message: err,
      };
    }
  }
}
