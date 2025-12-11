import type { PageServerLoad } from './$types';
import { kvPlatformCodes, kvGet, kvDelete } from '$lib/server/kv';
import { msgError, getDateTime } from '$lib/utils';
import { dbPlatform, saveDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ url, platform }) => {
  try {

    const email = url.searchParams.get("code");
    if (!email) {
      throw new msgError('Código de registro no proporcionado');
    }

    const db = dbPlatform(platform);
    if (!db) {
      throw new msgError("DB: servicio no disponible");
    }

    const kv = kvPlatformCodes(platform);
    if (!kv) {
      throw new msgError("KV: servicio no disponible");
    }

    const registerKey = `email:${email}`;
    const user = await kvGet(kv, registerKey);
    if (!user) {
      throw new msgError(`El correo electrónico <span class="code-r">${email}</span> de activación ha caducado o no existe. Para crear tu cuenta debes enviar tus datos.`);
    }

    const created_at = getDateTime();
    let response: D1ResultMeta;

    const userData = JSON.parse(user);

    const course_id = userData.course_id;
    const name = userData.name;
    const surnames = userData.surnames;
    const phone = userData.phone;
    const password = userData.password;

    const queryUser = `INSERT INTO users (user_id, name, surnames, email, phone, password, profile, photo, blocked, school, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    response = await saveDB(db, queryUser, course_id, name, surnames, email, phone, password, 'S', '', 'N', '', created_at);
    const student_id  = response.last_row_id;

    const queryCourse = `INSERT INTO courses_students (student_id, course_id) VALUES (?, ?)`;
    response = await saveDB(db, queryCourse, student_id, course_id);

    await kvDelete(kv, registerKey);

    return {
      type: 'success',
      user: JSON.parse(user)
    }

  } catch (error) {

    if (error instanceof msgError) {
      return {
        type: 'failed',
        message: error.message,
        user: {}
      };
    }

  }
}
