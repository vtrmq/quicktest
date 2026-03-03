import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';
import { dbPlatform, selectDB, updateDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const adminId = locals.user.id;
  const teacherId = url.searchParams.get('teacherId') ?? '0';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const query = `SELECT id, name, surnames, email, phone FROM users WHERE id = ? AND user_id = ?;`;
    const teacherResult = await selectDB(db, query, Number(teacherId), adminId);
    return { 
      teacher: teacherResult[0] || null
    };

  } catch (err) {
    console.log(err)
  }

}

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }
    const adminId = locals.user.id;

    const data = await request.formData();
    const name = data.get('name')?.toString().trim();
    const surnames = data.get('surnames')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const teacherId = data.get('teacherId')?.toString().trim();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw 'DB: servicio no disponible';
      }

      const query = `SELECT change_password FROM users WHERE id = ? AND user_id = ?;`;
      const teacherResult = await selectDB(db, query, Number(teacherId), adminId);
      const change_password = parseInt(teacherResult[0].change_password);

      if (change_password === 0 && phone) {
        const password = await bcrypt.hash(phone, 10);
        const query = `UPDATE users SET name = ?, surnames = ?, email = ?, phone = ?, password = ? WHERE id = ? AND user_id = ?`;
        await updateDB(db, query, name, surnames, email, phone, password, Number(teacherId), Number(adminId));
      } else {
        const query = `UPDATE users SET name = ?, surnames = ?, phone = ? WHERE id = ? AND user_id = ?`;
        await updateDB(db, query, name, surnames, phone, Number(teacherId), Number(adminId));
      }

    } catch (error) {
      return fail(400, { 
        message: error,
        topic: null
      });
    }
    throw redirect(303, "/admin/list-teachers");
  }
};
